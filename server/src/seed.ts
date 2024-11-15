//TODO: integrate this logic as a feature for importing data from an external library

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  const libraryData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../data/Library.json'), 'utf8')
  )

  // First create all artists (unique)
  const artists = new Map()
  for (const track of libraryData.tracks) {
    if (!artists.has(track.artist.uuid)) {
      const artist = await prisma.artist.create({
        data: {
          uuid: track.artist.uuid,
          name: track.artist.name
        }
      })
      artists.set(artist.uuid, artist)
    }
  }

  // Then create albums (unique)
  const albums = new Map()
  for (const album of libraryData.albums) {
    if (!albums.has(album.uuid)) {
      const newAlbum = await prisma.album.create({
        data: {
          uuid: album.uuid,
          title: album.title,
          isCompilation: album.isCompilation,
          discCount: album.discCount,
          discNumber: album.discNumber,
          rating: album.rating,
          isGapless: album.isGapless,
          trackCount: album.trackCount,
          albumArtist: album.albumArtist,
          artwork: album.artwork?.toString()
        }
      })
      albums.set(album.uuid, newAlbum)
    }
  }

  // Finally create all tracks with relations
  for (const track of libraryData.tracks) {
    await prisma.track.create({
      data: {
        uuid: track.uuid,
        title: track.title,
        artistId: artists.get(track.artist.uuid).id,
        composer: track.composer,
        rating: track.rating,
        albumId: albums.get(track.album.uuid).id,
        genre: track.genre,
        fileType: track.fileInfo.type,
        fileSize: track.fileInfo.size,
        totalTime: track.totalTime,
        trackNumber: track.trackNumber,
        modifiedDate: track.modifiedDate,
        addedDate: track.addedDate,
        bitrate: track.bitrate,
        sampleRate: track.sampleRate,
        beatsPerMinute: track.beatsPerMinute,
        playCount: track.playCount,
        lastPlayedDate: track.lastPlayedDate,
        location: track.location?.toString(),
        comments: track.comments,
        isPurchased: track.isPurchased,
        isDRMProtected: track.isDRMProtected,
        releaseDate: track.releaseDate,
        year: track.year,
        grouping: track.grouping
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
