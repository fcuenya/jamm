const { faker } = require("@faker-js/faker");
const fs = require("node:fs");

const generateTrack = ({ trackId, trackNumber, albumId }) => {
  const track = {
    id: trackId,
    trackNumber,
    albumId,
    title: faker.music.songName(),
    artist: faker.music.artist(),
    genre: faker.music.genre(),
    year: faker.date.anytime(),
    bpm: faker.number.int({ min: 60, max: 180 }),
    key: "C Major",
  };
  return track;
};

const generateAlbum = (albumId) => ({
  id: albumId,
  title: faker.music.album(),
  artist: faker.music.artist(),
  year: faker.date.anytime(),
  genre: faker.music.genre(),
  albumArt: faker.image.urlPicsumPhotos({ height: 500, width: 500 }),
  trackCount: faker.number.int({ min: 5, max: 20 }),
  acquisitionDate: faker.date.anytime(),
});

const data = {
  albums: [],
  tracks: [],
};

const NUM_ALBUMS = 1000;

for (let i = 1; i <= NUM_ALBUMS; i++) {
  const album = generateAlbum(i);
  data.albums.push(album);
  for (let j = 1; j <= album.trackCount; j++) {
    const track = generateTrack({
      trackId: i * album.trackCount + j,
      trackNumber: j,
      albumId: album.id,
    });
    data.tracks.push(track);
  }
}

fs.writeFileSync("./db.json", JSON.stringify(data));
