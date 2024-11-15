/** The ITLibAlbum class represents an album where a given media item (ITLibMediaItem) is contained. */
interface ITLibAlbum {
    /** The name of this album. */
    title?: string;
    /** The name of this that should be used for sorting purposes. */
    sortTitle?: string;
    /** Whether this album is a compilation. */
    isCompilation: boolean;
    /** Deprecated. Will be removed in future versions. */
    artist?: ITLibArtist;
    /** The number of discs in this album. */
    discCount: number;
    /** The index (i.e. 1, 2, 3, etc.) of the disc this album refers to within a compilation. */
    discNumber: number;
    /** The rating of this track's album. */
    rating: number;
    /** The rating of this track's album. */
    isRatingComputed: boolean;
    /** Whether this track's album is gapless. */
    isGapless: boolean;
    /** Number of tracks in this album. */
    trackCount: number;
    /** The artist associated with this album. */
    albumArtist?: string;
    /** The artist associated with this album. This field should be used when sorting. */
    sortAlbumArtist?: string;
    /** The unique identifier of this album. */
    persistentID: number;
}

/** The ITLibArtist class represents an artist, such as the performer of a song. */
interface ITLibArtist {
    /** The name of this artist. */
    name?: string;
    /** The name of this artist that should be used for sorting purposes. */
    sortName?: string;
    /** The unique identifier of this artist. */
    persistentID: number;
}

/** These constants specify the possible formats of the data returned by ITLibArtwork's imageData method. */
enum ITLibArtworkFormat {
    None = 0,
    Bitmap = 1,
    JPEG = 2,
    JPEG2000 = 3,
    GIF = 4,
    PNG = 5,
    BMP = 6,
    TIFF = 7,
    PICT = 8
}

/** The ITLibArtwork class represents a media item artwork. */
interface ITLibArtwork {
    /** The NSImage formed by calling [[NSImage alloc] initWithData:self.imageData]. */
    image?: any; // Assuming this is represented by another interface in your app.
    /** The data (bytes) of this artwork image. */
    imageData?: ArrayBuffer;
    /** The format of the data returned by the imageData method. */
    imageDataFormat: ITLibArtworkFormat;
}

/** The ITLibMediaEntity class serves as the abstract superclass for ITLibMediaItem and ITLibPlaylist instances. */
interface ITLibMediaEntity {
    /** The unique identifier of this media entity. */
    persistentID: number;
}

/** These constants specify the possible media kinds of an iTunes media item. */
enum ITLibMediaItemMediaKind {
    Unknown = 1,
    Song = 2,
    Movie = 3,
    Podcast = 4,
    Audiobook = 5,
    PDFBooklet = 6,
    MusicVideo = 7,
    TVShow = 8,
    InteractiveBooklet = 9,
    HomeVideo = 12,
    Ringtone = 14,
    DigitalBooklet = 15,
    IOSApplication = 16,
    VoiceMemo = 17,
    iTunesU = 18,
    Book = 19,
    PDFBook = 20,
    AlertTone = 21
}

/** These constants specify the possible ratings of media item lyrics. */
enum ITLibMediaItemLyricsContentRating {
    None = 0,
    Explicit = 1,
    Clean = 2
}

/** These constants specify the location type of a media item. */
enum ITLibMediaItemLocationType {
    Unknown = 0,
    File = 1,
    URL = 2,
    Remote = 3
}

/** These constants specify the "blue dot" play status of this media item. */
enum ITLibMediaItemPlayStatus {
    None = 0,
    PartiallyPlayed = 1,
    Unplayed = 2
}

/** A media item represents a single piece of media (such as a song, a video, a podcast, etc) in the iTunes library. */
interface ITLibMediaItem extends ITLibMediaEntity {
    /** The title of this media item. May be empty. */
    title: string;
    /** The title of this media item that should be used for sorting purposes. */
    sortTitle?: string;
    /** The artist associated with this media item. */
    artist?: ITLibArtist;
    /** The name of the composer associated with this media item. */
    composer: string;
    /** The name of the composer associated with this media item that should be used for sorting purposes. */
    sortComposer?: string;
    /** The rating of this media item. */
    rating: number;
    /** Whether this media item's rating is computed. */
    isRatingComputed: boolean;
    /** Playback start time in milliseconds. */
    startTime: number;
    /** Playback stop time in milliseconds. */
    stopTime: number;
    /** The album where this media item belongs. */
    album: ITLibAlbum;
    /** The genre associated with this media item. */
    genre: string;
    /** This media item's file kind (e.g., MPEG audio file). */
    kind?: string;
    /** This media item's media kind. */
    mediaKind: ITLibMediaItemMediaKind;
    /** File size in bytes. */
    fileSize: number;
    /** Length of this media item in milliseconds. */
    totalTime: number;
    /** Position within its album. */
    trackNumber: number;
    /** Category for podcast items. */
    category?: string;
    /** Description for podcast items. */
    description?: string;
    /** Lyrics content rating. */
    lyricsContentRating: ITLibMediaItemLyricsContentRating;
    /** Content rating. */
    contentRating?: string;
    /** Last modified date. */
    modifiedDate?: Date;
    /** Date added to the library. */
    addedDate?: Date;
    /** Bitrate in kbps. */
    bitrate: number;
    /** Sample rate in samples per second. */
    sampleRate: number;
    /** Beats per minute (BPM). */
    beatsPerMinute: number;
    /** Play count in iTunes. */
    playCount: number;
    /** Last played date. */
    lastPlayedDate?: Date;
    /** Play status. */
    playStatus: ITLibMediaItemPlayStatus;
    /** Location of the item on disk. */
    location?: URL;
    /** Whether artwork is available. */
    hasArtworkAvailable: boolean;
    /** Artwork for this media item. */
    artwork?: ITLibArtwork;
    /** Comments for this media item. */
    comments?: string;
    /** Whether the item was purchased. */
    isPurchased: boolean;
    /** Whether the item is iTunes Match or iTunes in the Cloud. */
    isCloud: boolean;
    /** Whether the item is DRM protected. */
    isDRMProtected: boolean;
    /** Whether the item is a video. */
    isVideo: boolean;
    /** Release date of the item. */
    releaseDate?: Date;
    /** Release year. */
    year: number;
    /** Skip count for the item. */
    skipCount: number;
    /** Skip date. */
    skipDate?: Date;
    /** Grouping of this media item. */
    grouping?: string;
    /** Location type. */
    locationType: ITLibMediaItemLocationType;
}

/** These constants specify the possible kinds of playlists. */
enum ITLibPlaylistKind {
    Regular = 0,
    Smart = 1,
    Genius = 2,
    Folder = 3,
    GeniusMix = 4
}

/** A playlist is a collection of related media items. */
interface ITLibPlaylist extends ITLibMediaEntity {
    /** The name or title of this playlist. */
    name: string;
    /** Whether this playlist is the primary playlist. */
    isPrimary: boolean;
    /** Unique identifier of the playlist's parent. */
    parentID?: number;
    /** Whether the playlist is visible. */
    isVisible: boolean;
    /** The media items in this playlist. */
    items: ITLibMediaItem[];
    /** Kind of this playlist. */
    kind: ITLibPlaylistKind;
    /** Whether this playlist is the primary playlist. */
    isMaster: boolean;
}

/** A class representing an iTunes library whose metadata is being queried. */
interface ITLibrary {
    /** Version of iTunes being accessed. */
    applicationVersion: string;
    /** Features of this library. */
    features: number;
    /** Major version number of this API. */
    apiMajorVersion: number;
    /** Minor version number of this API. */
    apiMinorVersion: number;
    /** Location of the iTunes music folder. */
    mediaFolderLocation?: URL;
    /** All media items in the library. */
    allMediaItems: ITLibMediaItem[];
    /** All playlists in the library. */
    allPlaylists: ITLibPlaylist[];
}
