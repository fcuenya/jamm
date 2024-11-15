import Foundation
import iTunesLibrary

// Helper function to safely encode JSON
func encodeToJson<T: Encodable>(_ value: T) -> String? {
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .withoutEscapingSlashes]
    do {
        let data = try encoder.encode(value)
        return String(data: data, encoding: .utf8)
    } catch {
        print("Error encoding JSON: \(error)")
        return nil
    }
}

// Helper function to safely encode JSON and write to file
func writeJsonToFile(_ jsonString: String, filename: String) -> Bool {
    do {
        // Get the documents directory to save the file
        let currentDirectoryURL = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
        let dataDirectoryURL = currentDirectoryURL.appendingPathComponent("data")        
        // Create data directory if it doesn't exist
        try FileManager.default.createDirectory(at: dataDirectoryURL, withIntermediateDirectories: true)        
        // Create file URL in data directory
        let fileURL = dataDirectoryURL.appendingPathComponent(filename)
        // Write data to the file
        try jsonString.write(to: fileURL, atomically: true, encoding: .utf8)
        print("JSON written to: \(fileURL.path)")
        return true
    } catch {
        print("Error writing JSON to file: \(error)")
        return false
    }
}

// Define Codable structures that match the library items
struct Album: Codable {
    let uuid: String
    let title: String?
    let sortTitle: String?
    let isCompilation: Bool
    let discCount: Int
    let discNumber: Int
    let rating: Int
    let isRatingComputed: Bool
    let isGapless: Bool
    let trackCount: Int
    let albumArtist: String?
    let sortAlbumArtist: String?
}

struct Artist: Codable {
    let uuid: String
    let name: String?
    let sortName: String?
}

struct MediaItem: Codable {
    let uuid: String
    let title: String
    let sortTitle: String?
    let artist: Artist?
    let composer: String
    let sortComposer: String?
    let rating: Int
    let isRatingComputed: Bool
    let startTime: Int
    let stopTime: Int
    let album: Album?
    let genre: String
    let kind: String?
    let totalTime: Int
    let trackNumber: Int
    let playCount: Int
    let lastPlayedDate: Date?
    let location: URL?
    let isPurchased: Bool
    let isCloud: Bool
    let isDRMProtected: Bool
    let modifiedDate: Date?
    let addedDate: Date?
    let bitrate: Int
    let sampleRate: Int
    let beatsPerMinute: Int
    let comments: String?
    let releaseDate: Date?
    let year: Int
    let grouping: String?
}

struct Playlist: Codable {
    let name: String
    let items: [MediaItem]
}

struct Library: Codable {
    let allMediaItems: [MediaItem]
    let allPlaylists: [Playlist]
}

func serializeLibraryToJSON(filename: String) -> Bool {
    guard let library = try? ITLibrary(apiVersion: "1.0") else {
        print("Could not access iTunes Library.")
        return false
    }
    
    // Extract media items
    debugPrint("Processing tracks")
    let mediaItems = library.allMediaItems.compactMap { item -> MediaItem? in

        let artistInfo = item.artist.map { artist in
            Artist(
                uuid: artist.persistentID.stringValue,
                name: artist.name,
                sortName: artist.sortName
            )
        }
    
        let albumInfo = Album(
            uuid: item.album.persistentID.stringValue,
            title: item.album.title,
            sortTitle: item.album.sortTitle,
            isCompilation: item.album.isCompilation,
            discCount: item.album.discCount,
            discNumber: item.album.discNumber,
            rating: item.album.rating,
            isRatingComputed: item.album.isRatingComputed,
            isGapless: item.album.isGapless,
            trackCount: item.album.trackCount,
            albumArtist: item.album.albumArtist,
            sortAlbumArtist: item.album.sortAlbumArtist
        )
        
        let mediaItem = MediaItem(
            uuid: item.persistentID.stringValue,
            title: item.title,
            sortTitle: item.sortTitle,
            artist: artistInfo,
            composer: item.composer,
            sortComposer: item.sortComposer,
            rating: item.rating,
            isRatingComputed: item.isRatingComputed,
            startTime: item.startTime,
            stopTime: item.stopTime,
            album: albumInfo,
            genre: item.genre,
            kind: item.kind,
            totalTime: item.totalTime,
            trackNumber: item.trackNumber,
            playCount: item.playCount,
            lastPlayedDate: item.lastPlayedDate,
            location: item.location,
            isPurchased: item.isPurchased,
            isDRMProtected: item.isDRMProtected,
            modifiedDate: item.modifiedDate,
            addedDate: item.addedDate,
            bitrate: item.bitrate,
            sampleRate: item.sampleRate,
            beatsPerMinute: item.beatsPerMinute,
            comments: item.comments,
            releaseDate: item.releaseDate,
            year: item.year,
            grouping: item.grouping
        )

        debugPrint("- \(mediaItem.location?.absoluteString)")
        //encodeToJson(mediaItem)

        return mediaItem
    }
    
    // Extract playlists  
    debugPrint("Processing playlists")  
    let playlists = library.allPlaylists.map { playlist -> Playlist in
        let items = playlist.items.compactMap { item -> MediaItem? in
            return mediaItems.first { $0.title == item.title }
        }
        debugPrint("- \(playlist.name)")
        return Playlist(name: playlist.name, items: items)
    }
    
    // Create library object
    let libraryData = Library(allMediaItems: mediaItems, allPlaylists: playlists)
    
    // Convert library data to JSON string
    debugPrint("Converting library data to JSON string")
    guard let jsonString = encodeToJson(libraryData) else {
        print("Failed to encode library data to JSON.")
        return false
    }
    
    // Write JSON to file
    debugPrint("Saving JSON to \(filename)")
    let success = writeJsonToFile(jsonString, filename: filename)    

    return success
}

func main() {
    let filename = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "Library.json"
    if serializeLibraryToJSON(filename: filename) {
        print("Library successfully serialized to JSON file and printed to console.")
    } else {
        print("Failed to serialize library to JSON file.")
    }
}

main()
