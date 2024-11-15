interface Artist {
    id: number;
    uuid: number; // ITL persistentID
    name: string;
}

interface Album {
    id: number;
    uuid: number; // ITL persistentID
    title: string;
    isCompilation: boolean;
    // The number of discs in a multiple-disc set.
    discCount: number;
    /** The index (i.e. 1, 2, 3, etc.) of the disc this album refers to within a compilation. */
    discNumber: number;
    rating: number;
    isGapless: boolean;
    trackCount: number;
    albumArtist?: Artist;
    artwork?: URL;
}

interface Track {
    id: number;
    uuid: number; // ITL persistentID
    title: string;
    artist: Artist;
    composer: string;
    rating: number;
    album: Album;
    genre: string;
    filePath: URL;
    fileSize: number;
    fileType: string
    totalTime: number;
    trackNumber: number;
    modifiedDate?: Date;
    /** Date added to the (Apple Music) library. */
    addedDate?: Date;
    /** Bitrate in kbps. */
    bitrate: number;
    /** Sample rate in samples per second. */
    sampleRate: number;
    /** Beats per minute (BPM). */
    bpm: number;
    /** Play count in iTunes. */
    playCount: number;
    /** Last played date. */
    lastPlayedDate?: Date;
    /** Location of the item on disk. */
    location?: URL;
    /** Comments for this media item. */
    comments?: string;
    /** Whether the item was purchased. */
    isPurchased: boolean;
    /** Whether the item is DRM protected. */
    isDRMProtected: boolean;
    /** Release date of the item. */
    releaseDate?: Date;
    /** Release year. */
    year: number;
    /** Grouping of this media item. */
    grouping?: string;
}

interface AlbumData extends Album {

}

interface TrackData extends Track {

}
