import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseFile } from "music-metadata";

// Create dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIBRARY_PATH = "../data/Library.json";
const ARTWORK_DIR = "../data/artwork";

function convertFileUrlToPath(fileUrl) {
  const url = new URL(fileUrl);
  return decodeURIComponent(url.pathname);
}

async function extractArtwork(filePath, uuid) {
  try {
    const metadata = await parseFile(filePath);
    if (!metadata.common.picture || !metadata.common.picture[0]) {
      return null;
    }

    const picture = metadata.common.picture[0];
    const format = picture.format.split("/")[1]; // e.g. 'image/jpeg' -> 'jpeg'
    const artworkPath = path.join(
      __dirname,
      ARTWORK_DIR,
      `${uuid}-artwork.${format}`
    );

    // Create artwork directory if it doesn't exist
    fs.mkdirSync(path.join(__dirname, ARTWORK_DIR), { recursive: true });

    // Write artwork file
    fs.writeFileSync(artworkPath, picture.data);

    return `file://${artworkPath}`;
  } catch (error) {
    console.warn(`Error extracting artwork for ${filePath}: ${error.message}`);
    return null;
  }
}

const prisma = new PrismaClient();

let trackCount = 0;
let failedTracks = 0;

const asDate = (date) => (date ? new Date(date) : null);

async function main() {
  const { allMediaItems } = JSON.parse(
    fs.readFileSync(path.join(__dirname, LIBRARY_PATH), "utf8")
  );

  trackCount = allMediaItems.length;

  const artistsByUuid = {};
  const albumsByUuid = {};

  // Process all items in a single loop
  for (const mediaItem of allMediaItems) {
    try {
      const mediaLocation = convertFileUrlToPath(mediaItem.location);
      // Create artist if new
      if (mediaItem.artist?.uuid && !artistsByUuid[mediaItem.artist.uuid]) {
        const artist = await prisma.artist.create({
          data: {
            uuid: mediaItem.artist.uuid,
            name: mediaItem.artist.name,
          },
        });
        artistsByUuid[mediaItem.artist.uuid] = artist;
      }

      // Create album if new
      if (mediaItem.album?.uuid && !albumsByUuid[mediaItem.album.uuid]) {
        const artworkLocation = await extractArtwork(
          mediaLocation,
          mediaItem.album.uuid
        );
        const album = await prisma.album.create({
          data: {
            uuid: mediaItem.album.uuid,
            title: mediaItem.album.title,
            isCompilation: mediaItem.album.isCompilation,
            discCount: mediaItem.album.discCount,
            discNumber: mediaItem.album.discNumber,
            rating: mediaItem.album.rating,
            isGapless: mediaItem.album.isGapless,
            trackCount: mediaItem.album.trackCount,
            albumArtist: mediaItem.album.albumArtist,
            artwork: artworkLocation,
          },
        });
        albumsByUuid[mediaItem.album.uuid] = album;
      }

      // Create track with relations
      await prisma.track.create({
        data: {
          uuid: mediaItem.uuid,
          title: mediaItem.title,
          artistId: artistsByUuid[mediaItem.artist?.uuid]?.id,
          composer: mediaItem.composer,
          rating: mediaItem.rating,
          albumId: albumsByUuid[mediaItem.album?.uuid]?.id,
          genre: mediaItem.genre,
          kind: mediaItem.kind,
          totalTime: mediaItem.totalTime,
          trackNumber: mediaItem.trackNumber,
          playCount: mediaItem.playCount,
          lastPlayedDate: asDate(mediaItem.lastPlayedDate),
          location: mediaLocation,
          isPurchased: mediaItem.isPurchased,
          isDRMProtected: mediaItem.isDRMProtected,
          modifiedDate: asDate(mediaItem.modifiedDate),
          addedDate: new Date(mediaItem.addedDate),
          bitrate: mediaItem.bitrate,
          sampleRate: mediaItem.sampleRate,
          beatsPerMinute: mediaItem.beatsPerMinute,
          comments: mediaItem.comments,
          releaseDate: asDate(mediaItem.releaseDate),
          year: mediaItem.year,
          grouping: mediaItem.grouping,
        },
      });
    } catch (error) {
      failedTracks++;
      console.warn(
        `Failed to process track: ${
          mediaItem.title
        } - ${mediaItem.location?.toString()}`
      );
      console.warn(`${error.message}`);
      // Continue with next track instead of breaking
      continue;
    }
  }
  console.warn(
    failedTracks > 0
      ? `Failed to process ${failedTracks} tracks out of ${trackCount} tracks.`
      : `Processed ${trackCount} tracks successfully.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
