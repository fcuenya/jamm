enum MusicalKey {
    C_Major = "C Major",
    C_Minor = "C Minor",
    CSharp_Major = "C# Major",
    CSharp_Minor = "C# Minor",
    D_Major = "D Major",
    D_Minor = "D Minor",
    DSharp_Major = "D# Major",
    DSharp_Minor = "D# Minor",
    E_Major = "E Major",
    E_Minor = "E Minor",
    F_Major = "F Major",
    F_Minor = "F Minor",
    FSharp_Major = "F# Major",
    FSharp_Minor = "F# Minor",
    G_Major = "G Major",
    G_Minor = "G Minor",
    GSharp_Major = "G# Major",
    GSharp_Minor = "G# Minor",
    A_Major = "A Major",
    A_Minor = "A Minor",
    ASharp_Major = "A# Major",
    ASharp_Minor = "A# Minor",
    B_Major = "B Major",
    B_Minor = "B Minor",
}

interface Track {
    id: number,
    trackNumber: number,
    title: string,
    artist: string,
    albumId: number,
    year: Date, //use number instead?
    genre: string //use enum instead?
    bpm: number
    duration: number
    key: MusicalKey
}

interface Album {
    id: number,
    title: string,
    artist: string,
    year: Date, //use number instead?
    genre: string //use enum instead?
    albumArt: string //what is the right type for this?
    trackCount: number,
    acquisitionDate: Date
}

interface AlbumData extends Album {
    tracks: Track[]
};

type DataFetch<T> = {
    isLoading: boolean,
    data: T[]
};

export type { MusicalKey, Track, Album, AlbumData, DataFetch }