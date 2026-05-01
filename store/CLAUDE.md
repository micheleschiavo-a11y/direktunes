# Direktune App Builder — CLAUDE.md

## 1. Your Role

You are the **Direktune App Builder**. Your job is to produce a complete iOS Xcode project and a complete Android Gradle project for an independent music album app.

**Do not write any code until you have confirmed receipt of every required asset listed in Section 2.**

When the user runs the trigger prompt:
1. Read this file fully first.
2. Follow the asset collection protocol (Section 2) — ask in a friendly, non-technical way.
3. Build both projects (Sections 4 + 5).
4. Run the audit checklist (Section 7).
5. Deliver with upload instructions (Section 8).

---

## 2. Asset Collection Protocol

Ask the user for all of the following before generating anything. The user is a musician, not a developer — use plain language.

### Album Info
- **Artist/band name**
- **Album title**
- **Year** of release
- **Genre** (free text, e.g. "Indie Rock", "Jazz", "Electronic")
- **Theme** — choose one:
  - `indie` — dark purple, rounded fonts
  - `rock` — dark grey + red, heavy fonts
  - `pop` — bright blue, rounded bold
  - `jazz` — sepia/brown, serif fonts
  - `funky` — dark green, monospaced
- **Accent color** — optional hex (e.g. `#E040FB`) to override theme accent
- **iOS Bundle ID** — e.g. `com.yourname.albumname` (lowercase, no spaces)
- **Android Package ID** — same format, can be identical to iOS Bundle ID

### Music Files
- Up to **12 MP3 files**, total ≤ 100 MB. Ask the user to place them in their project folder.
- **Song title** for each file (in play order).

### Lyrics
For each song, the user can provide:
- **Plain text lyrics** — typed/pasted directly
- **.lrc file** — timestamped sync file. Example format:
  ```
  [00:05.00] First line of the song
  [00:09.50] Second line of the song
  ```

### Images
Ask the user to place these in their project folder:
- **Artist/band photo** — JPG or PNG, any aspect (shown full-screen on Home)
- **Album artwork** — JPG or PNG, square (shown on Player + spinning vinyl)
- **App icon** — JPG or PNG, square, at least 1024×1024 px

### Album Text
- **Liner notes** — shown on the Notes screen
- **Album credits** — shown on the Credits screen
- **Ownership badge text** — one sentence shown at the bottom of Credits (e.g. "You own this album outright — no streaming, no subscription.")

### Tour Dates (optional)
Up to 12 rows. For each row: **date**, **place**, **details**. If the user skips this, the Tour screen shows "Coming Soon to your Town" placeholder rows.

---

## 3. content.json Schema

Both apps read a single `content.json`. Claude generates this from user answers.

```json
{
  "artistName": "The Velvet Circuit",
  "albumTitle": "Neon Atlas",
  "genre": "Indie / Electronic",
  "year": 2025,
  "theme": "indie",
  "accentColor": "#7F52CF",
  "bandPhotoFilename": "band_photo",
  "albumArtworkFilename": "album_artwork",
  "notes": "Liner notes text...",
  "credits": "Credits text...",
  "ownershipBadgeText": "You own this album outright — no streaming, no subscription.",
  "songs": [
    {
      "title": "Track Title",
      "filename": "track01.mp3",
      "artworkFilename": "album_artwork",
      "lrcFilename": "track01.lrc",
      "lyrics": "Plain lyrics fallback if no LRC"
    }
  ],
  "tourDates": [
    { "date": "15 Jun 2025", "place": "Paris, France", "details": "Le Bataclan" }
  ]
}
```

**Rules:**
- `theme` must be one of: `indie`, `rock`, `pop`, `jazz`, `funky`
- `accentColor`: optional hex string; omit if not provided
- `bandPhotoFilename` / `albumArtworkFilename`: filename **without extension**
- `lrcFilename`: filename without extension; omit key entirely if no LRC for that song
- `lyrics`: omit key if no plain lyrics for that song
- `tourDates`: omit key if user provided none

---

## 4. iOS Project Specification

### 4.1 Directory Tree

```
Direktune/
├── Direktune.xcodeproj/
│   └── project.pbxproj
├── Direktune/
│   ├── Info.plist
│   ├── App/
│   │   ├── DirektureApp.swift
│   │   └── ContentLoader.swift
│   ├── Audio/
│   │   ├── AudioPlayerManager.swift
│   │   └── LyricsSync.swift
│   ├── Components/
│   │   ├── MiniPlayerBar.swift
│   │   ├── OwnershipBadge.swift
│   │   ├── RotatingVinyl.swift
│   │   └── SeekBar.swift
│   ├── Models/
│   │   ├── AppContent.swift
│   │   ├── AppContent+Helpers.swift
│   │   ├── LRCLine.swift
│   │   └── Song.swift
│   ├── Screens/
│   │   ├── CreditsScreen.swift
│   │   ├── HomeScreen.swift
│   │   ├── LyricsScreen.swift
│   │   ├── MainTabView.swift
│   │   ├── NotesScreen.swift
│   │   ├── PlayerScreen.swift
│   │   ├── TourScreen.swift
│   │   └── TracklistScreen.swift
│   ├── Theme/
│   │   ├── DirectuneTheme.swift
│   │   ├── FunkyTheme.swift
│   │   ├── IndieTheme.swift
│   │   ├── JazzTheme.swift
│   │   ├── PopTheme.swift
│   │   └── RockTheme.swift
│   ├── Resources/
│   │   ├── content.json
│   │   ├── [song01.mp3]  ← user's audio files go here
│   │   └── [song01.lrc]  ← user's LRC files go here (if any)
│   └── Assets.xcassets/
│       ├── Contents.json
│       ├── AccentColor.colorset/Contents.json
│       ├── AppIcon.appiconset/
│       │   ├── Contents.json
│       │   └── [app_icon.png]
│       ├── album_artwork.imageset/
│       │   ├── Contents.json
│       │   └── [album_artwork.png]
│       └── band_photo.imageset/
│           ├── Contents.json
│           └── [band_photo.png]
```

---

### 4.2 Info.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleDisplayName</key>
	<string>$(APP_DISPLAY_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleShortVersionString</key>
	<string>$(MARKETING_VERSION)</string>
	<key>CFBundleVersion</key>
	<string>$(CURRENT_PROJECT_VERSION)</string>
	<key>CFBundlePackageType</key>
	<string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
	<key>UIBackgroundModes</key>
	<array>
		<string>audio</string>
	</array>
	<key>UILaunchScreen</key>
	<dict/>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
	</array>
	<key>UIApplicationSupportsIndirectInputEvents</key>
	<true/>
</dict>
</plist>
```

---

### 4.3 Assets.xcassets — Contents.json files

**Assets.xcassets/Contents.json**
```json
{ "info": { "author": "xcode", "version": 1 } }
```

**Assets.xcassets/AccentColor.colorset/Contents.json**
```json
{
  "colors": [{"color": {"color-space": "srgb", "components": {"alpha": "1.000", "blue": "0.816", "green": "0.322", "red": "0.498"}}, "idiom": "universal"}],
  "info": {"author": "xcode", "version": 1}
}
```

**Assets.xcassets/AppIcon.appiconset/Contents.json**
Copy the user's app icon file into this folder. Name it `app_icon.png`. Update the filename field below if the user provides a different name.
```json
{
  "images": [{"filename": "app_icon.png", "idiom": "universal", "platform": "ios", "size": "1024x1024"}],
  "info": {"author": "xcode", "version": 1}
}
```

**Assets.xcassets/album_artwork.imageset/Contents.json**
Copy the user's album artwork into this folder as `album_artwork.png`.
```json
{
  "images": [
    {"filename": "album_artwork.png", "idiom": "universal", "scale": "1x"},
    {"filename": "album_artwork.png", "idiom": "universal", "scale": "2x"},
    {"filename": "album_artwork.png", "idiom": "universal", "scale": "3x"}
  ],
  "info": {"author": "xcode", "version": 1}
}
```

**Assets.xcassets/band_photo.imageset/Contents.json**
Copy the user's band/artist photo into this folder as `band_photo.png`.
```json
{
  "images": [
    {"filename": "band_photo.png", "idiom": "universal", "scale": "1x"},
    {"filename": "band_photo.png", "idiom": "universal", "scale": "2x"},
    {"filename": "band_photo.png", "idiom": "universal", "scale": "3x"}
  ],
  "info": {"author": "xcode", "version": 1}
}
```

---

### 4.4 App/DirektureApp.swift

```swift
import SwiftUI

@main
struct DirektureApp: App {
    @StateObject private var player = AudioPlayerManager()
    @State private var content: AppContent?
    @State private var theme: any DirectuneTheme = IndieTheme()
    @State private var showHome = true
    @State private var selectedTab: Int = 0

    var body: some Scene {
        WindowGroup {
            Group {
                if let content {
                    if showHome {
                        HomeScreen(content: content, showHome: $showHome, selectedTab: $selectedTab)
                            .environmentObject(player)
                            .environment(\.direktuneTheme, theme)
                    } else {
                        MainTabView(content: content, showHome: $showHome, selectedTab: $selectedTab)
                            .environmentObject(player)
                            .environment(\.direktuneTheme, theme)
                    }
                } else {
                    Color.black.ignoresSafeArea()
                }
            }
            .onAppear(perform: boot)
        }
    }

    private func boot() {
        guard let loaded = try? ContentLoader.load() else { return }
        content = loaded
        theme   = ThemeRegistry.resolve(key: loaded.theme, accentOverride: loaded.accentColor)
        player.configure(songs: loaded.songs)
    }
}
```

---

### 4.5 App/ContentLoader.swift

```swift
import Foundation

enum ContentLoaderError: LocalizedError {
    case fileNotFound
    case decodingFailed(Error)

    var errorDescription: String? {
        switch self {
        case .fileNotFound:       return "content.json not found in app bundle."
        case .decodingFailed(let e): return "content.json decode failed: \(e)"
        }
    }
}

struct ContentLoader {
    static func load() throws -> AppContent {
        guard let url = Bundle.main.url(forResource: "content", withExtension: "json") else {
            throw ContentLoaderError.fileNotFound
        }
        do {
            let data = try Data(contentsOf: url)
            return try JSONDecoder().decode(AppContent.self, from: data)
        } catch {
            throw ContentLoaderError.decodingFailed(error)
        }
    }
}
```

---

### 4.6 Models/AppContent.swift

```swift
import Foundation

struct TourDate: Codable {
    let date: String
    let place: String
    let details: String
}

struct AppContent: Codable {
    let artistName: String
    let albumTitle: String
    let genre: String
    let year: Int
    let bandPhotoFilename: String
    let accentColor: String?
    let theme: String
    let notes: String
    let credits: String
    let ownershipBadgeText: String
    let albumArtworkFilename: String?
    let songs: [Song]
    let tourDates: [TourDate]?
}
```

---

### 4.7 Models/AppContent+Helpers.swift

```swift
import UIKit

extension AppContent {

    func currentSong(at index: Int) -> Song? {
        songs.indices.contains(index) ? songs[index] : nil
    }

    func artwork(for song: Song?) -> UIImage? {
        let name = song?.artworkFilename ?? albumArtworkFilename ?? ""
        guard !name.isEmpty else { return nil }
        return Self.loadImage(named: name)
    }

    static func loadImage(named name: String) -> UIImage? {
        guard !name.isEmpty else { return nil }
        if let img = UIImage(named: name) { return img }
        for ext in ["png", "jpg", "jpeg"] {
            if let path = Bundle.main.path(forResource: name, ofType: ext),
               let img = UIImage(contentsOfFile: path) { return img }
        }
        return nil
    }
}
```

---

### 4.8 Models/Song.swift

```swift
import Foundation

struct Song: Codable, Identifiable {
    let title: String
    let filename: String
    let artworkFilename: String?
    let lrcFilename: String?
    let lyrics: String?

    var id: String { filename }
}
```

---

### 4.9 Models/LRCLine.swift

```swift
import Foundation

struct LRCLine: Identifiable {
    let id: Int
    let timestamp: TimeInterval
    let text: String
}
```

---

### 4.10 Audio/AudioPlayerManager.swift

```swift
import AVFoundation
import MediaPlayer
import SwiftUI

@MainActor
final class AudioPlayerManager: NSObject, ObservableObject {
    @Published var currentTrackIndex: Int = 0
    @Published var isPlaying: Bool = false
    @Published var isShuffled: Bool = false
    @Published var progress: Double = 0.0
    @Published var elapsed: TimeInterval = 0.0
    @Published var duration: TimeInterval = 0.0

    private var player: AVAudioPlayer?
    private var timer: Timer?
    private var songs: [Song] = []
    private var shuffleOrder: [Int] = []
    private var interruptionObserver: NSObjectProtocol?
    private var routeChangeObserver: NSObjectProtocol?

    deinit {
        if let observer = interruptionObserver { NotificationCenter.default.removeObserver(observer) }
        if let observer = routeChangeObserver  { NotificationCenter.default.removeObserver(observer) }
    }

    func configure(songs: [Song]) {
        self.songs = songs
        reshuffleOrder()
        configureAudioSession()
        setupRemoteCommands()
        setupInterruptionObserver()
        setupRouteChangeObserver()
        loadTrack(index: 0, autoplay: false)
    }

    func loadTrack(index: Int, autoplay: Bool = true) {
        guard songs.indices.contains(index) else { return }
        currentTrackIndex = index
        let song = songs[index]

        let base = (song.filename as NSString).deletingPathExtension
        let ext  = (song.filename as NSString).pathExtension
        guard let url = Bundle.main.url(forResource: base, withExtension: ext) else {
            print("[Audio] File not found in bundle: \(song.filename)")
            return
        }
        do {
            player?.stop()
            player = try AVAudioPlayer(contentsOf: url)
            player?.delegate = self
            player?.prepareToPlay()
            duration = player?.duration ?? 0
            progress = 0
            elapsed = 0
            if autoplay { play() } else { updateNowPlaying() }
        } catch {
            print("[Audio] Load error for \(song.filename): \(error)")
        }
    }

    func play() {
        configureAudioSession()
        player?.play()
        isPlaying = true
        startTimer()
        updateNowPlaying()
    }

    func pause() {
        player?.pause()
        isPlaying = false
        stopTimer()
        updateNowPlaying()
    }

    func togglePlayPause() { isPlaying ? pause() : play() }

    func next() { loadTrack(index: resolveNext(), autoplay: isPlaying) }

    func previous() {
        if elapsed > 3 { seek(to: 0) }
        else { loadTrack(index: resolvePrevious(), autoplay: isPlaying) }
    }

    func seek(to fraction: Double) {
        guard let player else { return }
        let time = fraction * player.duration
        player.currentTime = time
        elapsed = time
        progress = fraction
        updateNowPlaying()
    }

    func toggleShuffle() { isShuffled.toggle(); reshuffleOrder() }

    private func configureAudioSession() {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .default, options: [.allowAirPlay, .allowBluetoothA2DP])
        try? session.setActive(true)
    }

    private func deactivateAudioSession() {
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }

    private func setupInterruptionObserver() {
        interruptionObserver = NotificationCenter.default.addObserver(
            forName: AVAudioSession.interruptionNotification, object: nil, queue: .main
        ) { [weak self] notification in
            guard let info = notification.userInfo,
                  let typeValue = info[AVAudioSessionInterruptionTypeKey] as? UInt,
                  let type = AVAudioSession.InterruptionType(rawValue: typeValue) else { return }
            Task { @MainActor [weak self] in
                switch type {
                case .began:
                    self?.pause()
                    self?.deactivateAudioSession()
                case .ended:
                    if let optionsValue = info[AVAudioSessionInterruptionOptionKey] as? UInt,
                       AVAudioSession.InterruptionOptions(rawValue: optionsValue).contains(.shouldResume) {
                        self?.configureAudioSession()
                        self?.play()
                    }
                @unknown default: break
                }
            }
        }
    }

    private func setupRouteChangeObserver() {
        routeChangeObserver = NotificationCenter.default.addObserver(
            forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main
        ) { [weak self] notification in
            guard let info = notification.userInfo,
                  let reasonValue = info[AVAudioSessionRouteChangeReasonKey] as? UInt,
                  let reason = AVAudioSession.RouteChangeReason(rawValue: reasonValue) else { return }
            Task { @MainActor [weak self] in
                if reason == .oldDeviceUnavailable { self?.pause() }
            }
        }
    }

    private func setupRemoteCommands() {
        let center = MPRemoteCommandCenter.shared()
        center.playCommand.addTarget { [weak self] _ in self?.play(); return .success }
        center.pauseCommand.addTarget { [weak self] _ in self?.pause(); return .success }
        center.togglePlayPauseCommand.addTarget { [weak self] _ in self?.togglePlayPause(); return .success }
        center.nextTrackCommand.addTarget { [weak self] _ in self?.next(); return .success }
        center.previousTrackCommand.addTarget { [weak self] _ in self?.previous(); return .success }
        center.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let e = event as? MPChangePlaybackPositionCommandEvent,
                  let duration = self?.duration, duration > 0 else { return .commandFailed }
            self?.seek(to: e.positionTime / duration)
            return .success
        }
    }

    private func updateNowPlaying() {
        guard songs.indices.contains(currentTrackIndex) else { return }
        let song = songs[currentTrackIndex]
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: song.title,
            MPMediaItemPropertyPlaybackDuration: duration,
            MPNowPlayingInfoPropertyElapsedPlaybackTime: elapsed,
            MPNowPlayingInfoPropertyPlaybackRate: isPlaying ? 1.0 : 0.0
        ]
        let artworkName = song.artworkFilename.flatMap { $0.isEmpty ? nil : $0 }
        let img = artworkName.flatMap { UIImage(named: $0) } ?? UIImage(named: "album_artwork")
        if let img {
            info[MPMediaItemPropertyArtwork] = MPMediaItemArtwork(boundsSize: img.size) { _ in img }
        }
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
    }

    private func reshuffleOrder() { shuffleOrder = songs.indices.shuffled() }

    private func resolveNext() -> Int {
        guard !songs.isEmpty else { return 0 }
        if isShuffled {
            let pos = shuffleOrder.firstIndex(of: currentTrackIndex) ?? 0
            return shuffleOrder[(pos + 1) % shuffleOrder.count]
        }
        return (currentTrackIndex + 1) % songs.count
    }

    private func resolvePrevious() -> Int {
        guard !songs.isEmpty else { return 0 }
        if isShuffled {
            let pos = shuffleOrder.firstIndex(of: currentTrackIndex) ?? 0
            return shuffleOrder[(pos - 1 + shuffleOrder.count) % shuffleOrder.count]
        }
        return (currentTrackIndex - 1 + songs.count) % songs.count
    }

    private func startTimer() {
        stopTimer()
        timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in self?.tick() }
        }
    }

    private func stopTimer() { timer?.invalidate(); timer = nil }

    private func tick() {
        guard let player else { return }
        elapsed  = player.currentTime
        duration = player.duration
        progress = duration > 0 ? elapsed / duration : 0
    }
}

extension AudioPlayerManager: AVAudioPlayerDelegate {
    nonisolated func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        guard flag else { return }
        Task { @MainActor in self.next() }
    }
}
```

---

### 4.11 Audio/LyricsSync.swift

```swift
import Foundation

enum LyricsSync {
    static func parse(lrcText: String) -> [LRCLine] {
        var lines: [LRCLine] = []
        var id = 0
        for raw in lrcText.components(separatedBy: .newlines) {
            if let line = parseLine(raw, id: id) { lines.append(line); id += 1 }
        }
        return lines.sorted { $0.timestamp < $1.timestamp }
    }

    static func currentLineIndex(lines: [LRCLine], elapsed: TimeInterval) -> Int {
        guard !lines.isEmpty else { return 0 }
        var result = 0
        for (i, line) in lines.enumerated() {
            if elapsed >= line.timestamp { result = i }
        }
        return result
    }

    static func lrcText(for song: Song) -> String? {
        guard let filename = song.lrcFilename else { return nil }
        let base = (filename as NSString).deletingPathExtension
        let ext  = (filename as NSString).pathExtension
        guard let url = Bundle.main.url(forResource: base, withExtension: ext) else { return nil }
        return try? String(contentsOf: url, encoding: .utf8)
    }

    private static func parseLine(_ raw: String, id: Int) -> LRCLine? {
        let pattern = #"^\[(\d{2}):(\d{2})\.(\d{2,3})\](.+)"#
        guard let regex = try? NSRegularExpression(pattern: pattern),
              let match = regex.firstMatch(in: raw, range: NSRange(raw.startIndex..., in: raw))
        else { return nil }
        func group(_ i: Int) -> String {
            let r = Range(match.range(at: i), in: raw)!
            return String(raw[r])
        }
        let minutes = Double(group(1)) ?? 0
        let seconds = Double(group(2)) ?? 0
        let frac    = Double(group(3)) ?? 0
        let divisor = group(3).count == 3 ? 1000.0 : 100.0
        let timestamp = minutes * 60 + seconds + frac / divisor
        let text = group(4).trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return nil }
        return LRCLine(id: id, timestamp: timestamp, text: text)
    }
}
```

---

### 4.12 Theme files

**Theme/DirectuneTheme.swift**
```swift
import SwiftUI

protocol DirectuneTheme {
    var backgroundPrimary: Color { get }
    var backgroundSecondary: Color { get }
    var accentDefault: Color { get }
    var textPrimary: Color { get }
    var textSecondary: Color { get }
    var headingFont: Font { get }
    var bodyFont: Font { get }
}

private struct ThemeKey: EnvironmentKey {
    static let defaultValue: any DirectuneTheme = IndieTheme()
}

extension EnvironmentValues {
    var direktuneTheme: any DirectuneTheme {
        get { self[ThemeKey.self] }
        set { self[ThemeKey.self] = newValue }
    }
}

enum ThemeRegistry {
    static func resolve(key: String, accentOverride: String?) -> any DirectuneTheme {
        let base: any DirectuneTheme
        switch key {
        case "rock":  base = RockTheme()
        case "jazz":  base = JazzTheme()
        case "pop":   base = PopTheme()
        case "funky": base = FunkyTheme()
        default:      base = IndieTheme()
        }
        guard let hex = accentOverride, let color = Color(hex: hex) else { return base }
        return AccentOverride(base: base, accent: color)
    }
}

private struct AccentOverride: DirectuneTheme {
    let base: any DirectuneTheme
    let accent: Color
    var backgroundPrimary: Color   { base.backgroundPrimary }
    var backgroundSecondary: Color { base.backgroundSecondary }
    var accentDefault: Color       { accent }
    var textPrimary: Color         { base.textPrimary }
    var textSecondary: Color       { base.textSecondary }
    var headingFont: Font          { base.headingFont }
    var bodyFont: Font             { base.bodyFont }
}

extension Color {
    init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        guard Scanner(string: hex).scanHexInt64(&int), hex.count == 6 else { return nil }
        self.init(
            red:   Double((int >> 16) & 0xFF) / 255,
            green: Double((int >>  8) & 0xFF) / 255,
            blue:  Double( int        & 0xFF) / 255
        )
    }
}
```

**Theme/IndieTheme.swift**
```swift
import SwiftUI
struct IndieTheme: DirectuneTheme {
    var backgroundPrimary:   Color { Color(red: 0.10, green: 0.07, blue: 0.18) }
    var backgroundSecondary: Color { Color(red: 0.16, green: 0.11, blue: 0.26) }
    var accentDefault:       Color { Color(red: 0.50, green: 0.32, blue: 0.81) }
    var textPrimary:         Color { .white }
    var textSecondary:       Color { Color(white: 0.65) }
    var headingFont:         Font  { .system(.title2, design: .rounded, weight: .bold) }
    var bodyFont:            Font  { .system(.body,   design: .rounded) }
}
```

**Theme/RockTheme.swift**
```swift
import SwiftUI
struct RockTheme: DirectuneTheme {
    var backgroundPrimary:   Color { Color(red: 0.07, green: 0.07, blue: 0.07) }
    var backgroundSecondary: Color { Color(red: 0.14, green: 0.14, blue: 0.14) }
    var accentDefault:       Color { Color(red: 0.80, green: 0.10, blue: 0.10) }
    var textPrimary:         Color { .white }
    var textSecondary:       Color { Color(white: 0.60) }
    var headingFont:         Font  { .system(.title2, design: .default, weight: .heavy) }
    var bodyFont:            Font  { .system(.body,   design: .default) }
}
```

**Theme/PopTheme.swift**
```swift
import SwiftUI
struct PopTheme: DirectuneTheme {
    var backgroundPrimary:   Color { Color(red: 0.06, green: 0.28, blue: 0.65) }
    var backgroundSecondary: Color { Color(red: 0.10, green: 0.40, blue: 0.80) }
    var accentDefault:       Color { .white }
    var textPrimary:         Color { .white }
    var textSecondary:       Color { Color(white: 0.85) }
    var headingFont:         Font  { .system(.title2, design: .rounded, weight: .black) }
    var bodyFont:            Font  { .system(.body,   design: .rounded) }
}
```

**Theme/JazzTheme.swift**
```swift
import SwiftUI
struct JazzTheme: DirectuneTheme {
    var backgroundPrimary:   Color { Color(red: 0.13, green: 0.08, blue: 0.04) }
    var backgroundSecondary: Color { Color(red: 0.20, green: 0.13, blue: 0.07) }
    var accentDefault:       Color { Color(red: 0.85, green: 0.68, blue: 0.20) }
    var textPrimary:         Color { Color(red: 0.97, green: 0.93, blue: 0.85) }
    var textSecondary:       Color { Color(red: 0.72, green: 0.65, blue: 0.50) }
    var headingFont:         Font  { .system(.title2, design: .serif,   weight: .semibold) }
    var bodyFont:            Font  { .system(.body,   design: .serif) }
}
```

**Theme/FunkyTheme.swift**
```swift
import SwiftUI
struct FunkyTheme: DirectuneTheme {
    var backgroundPrimary:   Color { Color(red: 0.04, green: 0.12, blue: 0.04) }
    var backgroundSecondary: Color { Color(red: 0.07, green: 0.20, blue: 0.07) }
    var accentDefault:       Color { Color(red: 0.18, green: 0.90, blue: 0.18) }
    var textPrimary:         Color { .white }
    var textSecondary:       Color { Color(white: 0.65) }
    var headingFont:         Font  { .system(.title2, design: .monospaced, weight: .bold) }
    var bodyFont:            Font  { .system(.body,   design: .monospaced) }
}
```

---

### 4.13 Components

**Components/OwnershipBadge.swift**
```swift
import SwiftUI
struct OwnershipBadge: View {
    let text: String
    let theme: any DirectuneTheme
    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            Image(systemName: "lock.fill")
                .foregroundStyle(theme.accentDefault)
                .font(.system(size: 20))
                .padding(.top, 2)
            Text(text)
                .font(theme.bodyFont)
                .foregroundStyle(theme.textPrimary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(16)
        .background(theme.backgroundSecondary)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(theme.accentDefault.opacity(0.45), lineWidth: 1))
    }
}
```

**Components/SeekBar.swift**
```swift
import SwiftUI
struct SeekBar: View {
    let progress: Double
    let elapsed: TimeInterval
    let duration: TimeInterval
    let onSeek: (Double) -> Void
    @Environment(\.direktuneTheme) var theme
    @State private var isDragging = false
    @State private var dragFraction: Double = 0
    private var display: Double { isDragging ? dragFraction : progress }
    var body: some View {
        VStack(spacing: 6) {
            GeometryReader { geo in
                let w = geo.size.width
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 2).fill(theme.textSecondary.opacity(0.25)).frame(height: 4)
                    RoundedRectangle(cornerRadius: 2).fill(theme.accentDefault).frame(width: w * display, height: 4)
                    Circle().fill(theme.accentDefault).frame(width: 14, height: 14).offset(x: w * display - 7)
                }
                .gesture(DragGesture(minimumDistance: 0)
                    .onChanged { v in isDragging = true; dragFraction = max(0, min(1, v.location.x / w)) }
                    .onEnded { _ in onSeek(dragFraction); isDragging = false })
            }
            .frame(height: 14)
            HStack {
                Text(format(elapsed)); Spacer(); Text(format(duration))
            }
            .font(.caption.monospacedDigit()).foregroundStyle(theme.textSecondary)
        }
    }
    private func format(_ t: TimeInterval) -> String {
        let total = max(0, Int(t))
        return String(format: "%d:%02d", total / 60, total % 60)
    }
}
```

**Components/RotatingVinyl.swift**
```swift
import SwiftUI
struct RotatingVinyl: View {
    let isSpinning: Bool
    var artwork: UIImage? = nil
    private let rpm: Double = 2.8
    var body: some View {
        TimelineView(.animation(paused: !isSpinning)) { context in
            let elapsed = context.date.timeIntervalSinceReferenceDate
            let angle   = elapsed.truncatingRemainder(dividingBy: rpm) / rpm * 360
            disc(angle: isSpinning ? angle : 0)
        }
    }
    @ViewBuilder private func disc(angle: Double) -> some View {
        ZStack {
            Circle().fill(Color(white: 0.14))
            ForEach([0.88, 0.76, 0.64, 0.52] as [Double], id: \.self) { scale in
                Circle().stroke(Color.white.opacity(0.18), lineWidth: 1).scaleEffect(scale)
            }
            Circle().fill(AngularGradient(colors: [.clear, .white.opacity(0.06), .clear, .clear], center: .center))
            if let artwork {
                Image(uiImage: artwork).resizable().scaledToFill().clipShape(Circle()).scaleEffect(0.34)
                    .overlay(Circle().stroke(Color.white.opacity(0.15), lineWidth: 1).scaleEffect(0.34))
            } else {
                Circle().fill(Color(white: 0.24)).scaleEffect(0.34)
                Circle().stroke(Color.white.opacity(0.12), lineWidth: 1).scaleEffect(0.34)
            }
            Circle().fill(Color.white.opacity(0.85)).scaleEffect(0.05)
        }
        .rotationEffect(.degrees(angle))
    }
}
```

**Components/MiniPlayerBar.swift**
```swift
import SwiftUI
struct MiniPlayerBar: View {
    let content: AppContent
    @Binding var selectedTab: Int
    @EnvironmentObject var player: AudioPlayerManager
    @Environment(\.direktuneTheme) var theme
    private var currentSong: Song? { content.currentSong(at: player.currentTrackIndex) }
    var body: some View {
        VStack(spacing: 0) {
            GeometryReader { geo in
                Rectangle().fill(theme.accentDefault).frame(width: max(0, geo.size.width * player.progress), height: 2)
            }.frame(height: 2)
            HStack(spacing: 16) {
                Button { selectedTab = 0 } label: {
                    Text(currentSong?.title ?? "—").font(theme.bodyFont).foregroundStyle(theme.textPrimary)
                        .lineLimit(1).frame(maxWidth: .infinity, alignment: .leading)
                }
                Button { player.togglePlayPause() } label: {
                    Image(systemName: player.isPlaying ? "pause.fill" : "play.fill")
                        .font(.system(size: 20)).foregroundStyle(theme.accentDefault)
                }
                Button { player.next() } label: {
                    Image(systemName: "forward.fill").font(.system(size: 20)).foregroundStyle(theme.textPrimary)
                }
            }
            .padding(.horizontal, 20).padding(.vertical, 10)
            .background(theme.backgroundPrimary)
            .overlay(Rectangle().frame(height: 0.5).foregroundColor(.white.opacity(0.15)), alignment: .top)
        }
    }
}
```

---

### 4.14 Screens

**Screens/HomeScreen.swift**
```swift
import SwiftUI
struct HomeScreen: View {
    let content: AppContent
    @Binding var showHome: Bool
    @Binding var selectedTab: Int
    @EnvironmentObject var player: AudioPlayerManager
    @Environment(\.direktuneTheme) var theme
    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .bottom) {
                VStack(spacing: 0) {
                    ZStack(alignment: .bottom) {
                        artistPhoto.frame(width: geo.size.width, height: geo.size.height * 0.50).clipped()
                        VStack(spacing: 2) {
                            Text(content.artistName).font(.system(.headline, design: .rounded, weight: .bold)).foregroundColor(.white)
                            Text(content.albumTitle).font(.system(.caption, design: .rounded)).foregroundColor(.white.opacity(0.70))
                        }
                        .padding(.bottom, 10).padding(.horizontal, 12).frame(maxWidth: .infinity)
                        .background(LinearGradient(colors: [.clear, .black.opacity(0.65)], startPoint: .top, endPoint: .bottom))
                    }
                    .frame(width: geo.size.width, height: geo.size.height * 0.50)
                    ZStack {
                        theme.backgroundPrimary
                        let cols = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]
                        LazyVGrid(columns: cols, spacing: 12) {
                            gridButton(label: "Player",  icon: "play.fill")           { selectedTab = 0; showHome = false }
                            gridButton(label: "Lyrics",  icon: "text.quote")          { selectedTab = 1; showHome = false }
                            gridButton(label: "Tour",    icon: "mappin.and.ellipse")  { selectedTab = 2; showHome = false }
                            gridButton(label: "Notes",   icon: "note.text")           { selectedTab = 3; showHome = false }
                            gridButton(label: "Credits", icon: "person.3.fill")       { selectedTab = 4; showHome = false }
                            gridButton(label: "Random",  icon: "shuffle")             { playRandom() }
                        }.padding(16)
                    }.frame(width: geo.size.width, height: geo.size.height * 0.50)
                }
                if player.isPlaying || player.elapsed > 0 {
                    MiniPlayerBar(content: content, selectedTab: $selectedTab)
                        .padding(.bottom, geo.safeAreaInsets.bottom + 49)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
        }
        .ignoresSafeArea()
        .animation(.easeInOut(duration: 0.3), value: player.isPlaying)
        .gesture(DragGesture(minimumDistance: 40).onEnded { value in
            let h = value.translation.width; let v = value.translation.height
            if h < -60, abs(h) > abs(v) { withAnimation(.easeInOut(duration: 0.25)) { showHome = false } }
        })
    }
    @ViewBuilder private var artistPhoto: some View {
        if let img = AppContent.loadImage(named: content.bandPhotoFilename) {
            Image(uiImage: img).resizable().scaledToFill()
        } else {
            LinearGradient(stops: [.init(color: Color(red: 0.20, green: 0.10, blue: 0.38), location: 0.0), .init(color: Color(red: 0.06, green: 0.03, blue: 0.15), location: 1.0)], startPoint: .topLeading, endPoint: .bottomTrailing)
        }
    }
    @ViewBuilder private func gridButton(label: String, icon: String, action: @escaping () -> Void) -> some View {
        ZStack {
            RoundedRectangle(cornerRadius: 14).fill(Color(red: 0.28, green: 0.16, blue: 0.50))
            VStack(spacing: 8) {
                Image(systemName: icon).font(.system(size: 26, weight: .medium)).foregroundColor(.white)
                Text(label).font(.system(size: 13, weight: .bold, design: .rounded)).foregroundColor(.white).multilineTextAlignment(.center)
            }
        }.aspectRatio(1, contentMode: .fit).onTapGesture { action() }
    }
    private func playRandom() {
        let count = content.songs.count; guard count > 0 else { return }
        var index = Int.random(in: 0..<count)
        if count > 1, index == player.currentTrackIndex { index = (index + 1) % count }
        player.loadTrack(index: index, autoplay: true)
    }
}
```

**Screens/MainTabView.swift**
```swift
import SwiftUI
struct MainTabView: View {
    let content: AppContent
    @Binding var showHome: Bool
    @Binding var selectedTab: Int
    @EnvironmentObject var player: AudioPlayerManager
    @Environment(\.direktuneTheme) var theme
    var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $selectedTab) {
                PlayerScreen(content: content).tag(0)
                LyricsScreen(content: content).tag(1)
                TourScreen(content: content).tag(2)
                NotesScreen(content: content).tag(3)
                CreditsScreen(content: content).tag(4)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .ignoresSafeArea(edges: .bottom)
            DirectuneTabBar(selectedTab: $selectedTab, showHome: $showHome, content: content)
        }
        .background(theme.backgroundPrimary.ignoresSafeArea())
        .simultaneousGesture(DragGesture(minimumDistance: 40).onEnded { value in
            let h = value.translation.width; let v = value.translation.height
            guard selectedTab == 0, h > 60, abs(h) > abs(v) else { return }
            withAnimation(.easeInOut(duration: 0.25)) { showHome = true }
        })
    }
}

private struct DirectuneTabBar: View {
    @Binding var selectedTab: Int
    @Binding var showHome: Bool
    let content: AppContent
    @EnvironmentObject var player: AudioPlayerManager
    @Environment(\.direktuneTheme) var theme
    private struct TabItem { let label: String; let icon: String; let tag: Int? }
    private let items: [TabItem] = [
        TabItem(label: "Home",    icon: "house.fill",         tag: nil),
        TabItem(label: "Player",  icon: "play.circle.fill",   tag: 0),
        TabItem(label: "Lyrics",  icon: "text.quote",         tag: 1),
        TabItem(label: "Tour",    icon: "mappin.and.ellipse", tag: 2),
        TabItem(label: "Notes",   icon: "note.text",          tag: 3),
        TabItem(label: "Credits", icon: "person.3.fill",      tag: 4),
    ]
    var body: some View {
        VStack(spacing: 0) {
            if player.isPlaying || player.elapsed > 0 {
                MiniPlayerBar(content: content, selectedTab: $selectedTab).transition(.move(edge: .bottom).combined(with: .opacity))
            }
            HStack(spacing: 0) {
                ForEach(items, id: \.label) { item in
                    Button {
                        if let tag = item.tag { selectedTab = tag }
                        else { withAnimation(.easeInOut(duration: 0.25)) { showHome = true } }
                    } label: {
                        VStack(spacing: 3) {
                            Image(systemName: item.icon).font(.system(size: 18, weight: .medium))
                            Text(item.label).font(.system(size: 9, weight: .medium, design: .rounded))
                        }
                        .foregroundStyle(isSelected(item) ? theme.accentDefault : theme.textSecondary)
                        .frame(maxWidth: .infinity).padding(.vertical, 10)
                    }
                }
            }
            .background(theme.backgroundPrimary)
            .overlay(alignment: .top) { Rectangle().fill(theme.textSecondary.opacity(0.15)).frame(height: 0.5) }
            theme.backgroundPrimary.frame(height: 0).ignoresSafeArea(edges: .bottom)
        }
        .animation(.easeInOut(duration: 0.3), value: player.isPlaying)
        .animation(.easeInOut(duration: 0.3), value: player.elapsed > 0)
    }
    private func isSelected(_ item: TabItem) -> Bool {
        guard let tag = item.tag else { return false }
        return selectedTab == tag
    }
}
```

**Screens/PlayerScreen.swift**
```swift
import SwiftUI
struct PlayerScreen: View {
    let content: AppContent
    @EnvironmentObject var player: AudioPlayerManager
    @Environment(\.direktuneTheme) var theme
    private var currentSong: Song? { content.currentSong(at: player.currentTrackIndex) }
    private var currentArtwork: UIImage? { content.artwork(for: currentSong) ?? content.artwork(for: nil) }
    var body: some View {
        ZStack {
            theme.backgroundPrimary.ignoresSafeArea()
            ScrollView {
                VStack(spacing: 0) {
                    artworkView.frame(width: 270, height: 270).clipShape(RoundedRectangle(cornerRadius: 20))
                        .shadow(color: theme.accentDefault.opacity(0.40), radius: 28, y: 10).padding(.top, 28)
                    Text(content.albumTitle).font(theme.headingFont).foregroundStyle(theme.textPrimary).lineLimit(1).padding(.top, 20).padding(.horizontal, 24)
                    Text("\(content.artistName) · \(content.year)").font(theme.bodyFont).foregroundStyle(theme.textSecondary).lineLimit(1).padding(.top, 4).padding(.horizontal, 24)
                    HStack(spacing: 12) {
                        Button { player.togglePlayPause() } label: {
                            HStack(spacing: 8) {
                                Image(systemName: player.isPlaying ? "pause.fill" : "play.fill").font(.system(size: 18, weight: .semibold))
                                Text(player.isPlaying ? "Pause" : "Play").font(.system(.body, design: .rounded, weight: .semibold))
                            }
                            .foregroundStyle(.white).frame(maxWidth: .infinity).padding(.vertical, 15)
                            .background(theme.accentDefault).clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        Button {
                            if !player.isShuffled { player.toggleShuffle() }
                            let count = content.songs.count; guard count > 0 else { return }
                            var next = Int.random(in: 0..<count)
                            if count > 1, next == player.currentTrackIndex { next = (next + 1) % count }
                            player.loadTrack(index: next, autoplay: true)
                        } label: {
                            HStack(spacing: 8) {
                                Image(systemName: "shuffle").font(.system(size: 16, weight: .medium))
                                Text("Shuffle").font(.system(.body, design: .rounded, weight: .medium))
                            }
                            .foregroundStyle(player.isShuffled ? theme.accentDefault : theme.textSecondary)
                            .frame(maxWidth: .infinity).padding(.vertical, 15)
                            .background(player.isShuffled ? theme.accentDefault.opacity(0.15) : theme.backgroundSecondary)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                    }.padding(.horizontal, 24).padding(.top, 24).padding(.bottom, 8)
                    Divider().overlay(theme.textSecondary.opacity(0.2)).padding(.horizontal, 20).padding(.bottom, 4)
                    ForEach(Array(content.songs.enumerated()), id: \.offset) { index, song in
                        SongRow(index: index + 1, song: song, isActive: player.currentTrackIndex == index, theme: theme)
                            .onTapGesture { player.loadTrack(index: index, autoplay: true) }
                        if index < content.songs.count - 1 {
                            Divider().overlay(theme.textSecondary.opacity(0.08)).padding(.horizontal, 20)
                        }
                    }
                }.padding(.bottom, 120)
            }
        }
    }
    @ViewBuilder private var artworkView: some View {
        if let img = currentArtwork { Image(uiImage: img).resizable().scaledToFill() }
        else { theme.backgroundSecondary.overlay(Image(systemName: "music.note").font(.system(size: 60)).foregroundStyle(theme.textSecondary)) }
    }
}
private struct SongRow: View {
    let index: Int; let song: Song; let isActive: Bool; let theme: any DirectuneTheme
    var body: some View {
        HStack(spacing: 14) {
            Text("\(index)").font(.system(.subheadline, design: .rounded, weight: .medium))
                .foregroundStyle(isActive ? theme.accentDefault : theme.textSecondary).frame(width: 28, alignment: .center)
            Text(song.title).font(.system(.body, design: .rounded)).foregroundStyle(isActive ? theme.accentDefault : theme.textPrimary).lineLimit(1).frame(maxWidth: .infinity, alignment: .leading)
            if isActive { Image(systemName: "waveform").font(.system(size: 14)).foregroundStyle(theme.accentDefault) }
        }.padding(.horizontal, 20).padding(.vertical, 14).background(isActive ? theme.accentDefault.opacity(0.08) : Color.clear)
    }
}
```

**Screens/LyricsScreen.swift**
```swift
import SwiftUI
struct LyricsScreen: View {
    let content: AppContent
    @EnvironmentObject var player: AudioPlayerManager
    @Environment(\.direktuneTheme) var theme
    private var currentSong: Song? { content.currentSong(at: player.currentTrackIndex) }
    private var currentArtwork: UIImage? { content.artwork(for: currentSong) }
    private var lrcLines: [LRCLine]? {
        guard let song = currentSong, let text = LyricsSync.lrcText(for: song) else { return nil }
        let lines = LyricsSync.parse(lrcText: text)
        return lines.isEmpty ? nil : lines
    }
    var body: some View {
        ZStack {
            theme.backgroundPrimary.ignoresSafeArea()
            VStack(spacing: 0) {
                RotatingVinyl(isSpinning: player.isPlaying, artwork: currentArtwork)
                    .frame(width: 220, height: 220).shadow(color: .black.opacity(0.4), radius: 16, y: 6)
                    .padding(.top, 24).padding(.bottom, 16)
                if let song = currentSong {
                    Text(song.title).font(theme.bodyFont).foregroundStyle(theme.accentDefault).padding(.bottom, 12)
                }
                if let lines = lrcLines { SyncedLyricsView(lines: lines, elapsed: player.elapsed, theme: theme) }
                else { PlainLyricsView(text: currentSong?.lyrics ?? "No lyrics available.", theme: theme) }
            }.padding(.bottom, 100)
        }
    }
}
private struct SyncedLyricsView: View {
    let lines: [LRCLine]; let elapsed: TimeInterval; let theme: any DirectuneTheme
    private var activeIndex: Int { LyricsSync.currentLineIndex(lines: lines, elapsed: elapsed) }
    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 22) {
                    ForEach(lines) { line in
                        let isActive = line.id == activeIndex
                        Text(line.text)
                            .font(isActive ? theme.headingFont : theme.bodyFont)
                            .foregroundStyle(isActive ? theme.accentDefault : theme.textSecondary)
                            .multilineTextAlignment(.center).padding(.horizontal, 32)
                            .scaleEffect(isActive ? 1.05 : 1.0)
                            .animation(.easeInOut(duration: 0.25), value: activeIndex).id(line.id)
                    }
                }.padding(.vertical, 24)
            }
            .onChange(of: activeIndex) { newIndex in
                withAnimation(.easeInOut(duration: 0.35)) { proxy.scrollTo(newIndex, anchor: .center) }
            }
        }
    }
}
private struct PlainLyricsView: View {
    let text: String; let theme: any DirectuneTheme
    var body: some View {
        ScrollView {
            Text(text).font(theme.bodyFont).foregroundStyle(theme.textPrimary)
                .multilineTextAlignment(.center).lineSpacing(6).padding(.horizontal, 32).padding(.vertical, 24)
        }
    }
}
```

**Screens/TourScreen.swift**
```swift
import SwiftUI
struct TourScreen: View {
    let content: AppContent
    @Environment(\.direktuneTheme) var theme
    private var rows: [TourDate] {
        if let dates = content.tourDates, !dates.isEmpty { return dates }
        return (0..<12).map { _ in TourDate(date: "", place: "", details: "Coming Soon to your Town") }
    }
    var body: some View {
        ZStack {
            theme.backgroundPrimary.ignoresSafeArea()
            ScrollView {
                VStack(spacing: 0) {
                    Text("Tour").font(theme.headingFont).foregroundStyle(theme.textPrimary)
                        .frame(maxWidth: .infinity, alignment: .leading).padding(.horizontal, 20).padding(.top, 20).padding(.bottom, 16)
                    HStack(spacing: 0) {
                        Text("Date").frame(width: 90, alignment: .leading)
                        Text("Place").frame(maxWidth: .infinity, alignment: .leading)
                        Text("Details").frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .font(.system(.caption, design: .rounded, weight: .semibold)).foregroundStyle(theme.textSecondary)
                    .padding(.horizontal, 20).padding(.bottom, 8)
                    Divider().overlay(theme.textSecondary.opacity(0.2)).padding(.horizontal, 20)
                    ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                        TourDateRow(date: row.date, place: row.place, details: row.details, theme: theme)
                        Divider().overlay(theme.textSecondary.opacity(0.1)).padding(.horizontal, 20)
                    }
                }.padding(.bottom, 120)
            }
        }
    }
}
private struct TourDateRow: View {
    let date: String; let place: String; let details: String; let theme: any DirectuneTheme
    var body: some View {
        HStack(spacing: 0) {
            Text(date.isEmpty ? "–" : date).frame(width: 90, alignment: .leading).foregroundStyle(date.isEmpty ? theme.textSecondary : theme.textPrimary)
            Text(place.isEmpty ? "–" : place).frame(maxWidth: .infinity, alignment: .leading).foregroundStyle(place.isEmpty ? theme.textSecondary : theme.textPrimary)
            Text(details.isEmpty ? "–" : details).frame(maxWidth: .infinity, alignment: .leading).foregroundStyle(details.isEmpty ? theme.textSecondary : theme.accentDefault)
        }
        .font(.system(.subheadline, design: .rounded)).padding(.horizontal, 20).padding(.vertical, 14)
    }
}
```

**Screens/NotesScreen.swift**
```swift
import SwiftUI
struct NotesScreen: View {
    let content: AppContent
    @Environment(\.direktuneTheme) var theme
    var body: some View {
        ZStack {
            theme.backgroundPrimary.ignoresSafeArea()
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(content.albumTitle).font(theme.headingFont).foregroundStyle(theme.textPrimary)
                        Text(content.artistName).font(theme.bodyFont).foregroundStyle(theme.accentDefault)
                        Text("\(content.genre)  ·  \(content.year)").font(.caption).foregroundStyle(theme.textSecondary)
                    }
                    Divider().background(theme.textSecondary.opacity(0.3))
                    Text(content.notes).font(theme.bodyFont).foregroundStyle(theme.textPrimary).lineSpacing(7).fixedSize(horizontal: false, vertical: true)
                }.padding(24).padding(.bottom, 100)
            }
        }
    }
}
```

**Screens/CreditsScreen.swift**
```swift
import SwiftUI
struct CreditsScreen: View {
    let content: AppContent
    @Environment(\.direktuneTheme) var theme
    var body: some View {
        ZStack {
            theme.backgroundPrimary.ignoresSafeArea()
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    Text("Credits").font(theme.headingFont).foregroundStyle(theme.textPrimary)
                    Text(content.credits).font(theme.bodyFont).foregroundStyle(theme.textPrimary).lineSpacing(7).fixedSize(horizontal: false, vertical: true)
                    Divider().background(theme.textSecondary.opacity(0.3))
                    OwnershipBadge(text: content.ownershipBadgeText, theme: theme)
                }.padding(24).padding(.bottom, 100)
            }
        }
    }
}
```

**Screens/TracklistScreen.swift**
```swift
import SwiftUI
struct TracklistScreen: View {
    let content: AppContent
    @Binding var selectedTab: Int
    @EnvironmentObject var player: AudioPlayerManager
    @Environment(\.direktuneTheme) var theme
    var body: some View {
        ZStack {
            theme.backgroundPrimary.ignoresSafeArea()
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(Array(content.songs.enumerated()), id: \.offset) { idx, song in
                        TrackRow(index: idx, song: song, isCurrent: player.currentTrackIndex == idx,
                                 isPlaying: player.currentTrackIndex == idx && player.isPlaying, theme: theme) {
                            player.loadTrack(index: idx, autoplay: true); selectedTab = 0
                        }
                        if idx < content.songs.count - 1 {
                            Divider().background(theme.textSecondary.opacity(0.15)).padding(.leading, 64)
                        }
                    }
                    Text("\(content.songs.count) songs").font(.footnote).foregroundStyle(theme.textSecondary).padding(.vertical, 24)
                }.padding(.top, 8).padding(.bottom, 100)
            }
        }
    }
}
private struct TrackRow: View {
    let index: Int; let song: Song; let isCurrent: Bool; let isPlaying: Bool; let theme: any DirectuneTheme; let action: () -> Void
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Text("\(index + 1)").font(.system(.caption, design: .monospaced)).foregroundStyle(isCurrent ? theme.accentDefault : theme.textSecondary).frame(width: 28, alignment: .trailing)
                Text(song.title).font(theme.bodyFont).foregroundStyle(isCurrent ? theme.accentDefault : theme.textPrimary).lineLimit(1).frame(maxWidth: .infinity, alignment: .leading)
                if isPlaying { Image(systemName: "waveform").foregroundStyle(theme.accentDefault).font(.system(size: 14)) }
            }.padding(.horizontal, 20).padding(.vertical, 15).background(isCurrent ? theme.backgroundSecondary.opacity(0.45) : Color.clear)
        }
    }
}
```

---

### 4.15 Direktune.xcodeproj/project.pbxproj

**How to generate this file:**

All static Swift source UUIDs below are fixed and must be kept verbatim. For each of the user's audio files and LRC files, follow the UUID pattern described in the comments to add dynamic entries.

**UUID rules for user files:**
- MP3 file N (1-based): fileRef UUID = `AA0000000000000000000N01`, buildFile UUID = `AA0000000000000000000N02`
- LRC file N (1-based): fileRef UUID = `BB0000000000000000000N01`, buildFile UUID = `BB0000000000000000000N02`

**Before writing:** Replace `USER_BUNDLE_ID` with the user's iOS Bundle ID. Remove the `DEVELOPMENT_TEAM` lines entirely.

```
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {

/* Begin PBXBuildFile section */
		00000000000000000000000F /* ContentLoader.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000000E /* ContentLoader.swift */; };
		000000000000000000000011 /* DirektureApp.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000010 /* DirektureApp.swift */; };
		000000000000000000000013 /* AudioPlayerManager.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000012 /* AudioPlayerManager.swift */; };
		000000000000000000000015 /* LyricsSync.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000014 /* LyricsSync.swift */; };
		000000000000000000000017 /* MiniPlayerBar.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000016 /* MiniPlayerBar.swift */; };
		000000000000000000000019 /* OwnershipBadge.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000018 /* OwnershipBadge.swift */; };
		00000000000000000000001B /* RotatingVinyl.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000001A /* RotatingVinyl.swift */; };
		00000000000000000000001D /* SeekBar.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000001C /* SeekBar.swift */; };
		00000000000000000000001F /* AppContent.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000001E /* AppContent.swift */; };
		000000000000000000000051 /* AppContent+Helpers.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000050 /* AppContent+Helpers.swift */; };
		000000000000000000000021 /* LRCLine.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000020 /* LRCLine.swift */; };
		000000000000000000000023 /* Song.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000022 /* Song.swift */; };
		000000000000000000000025 /* CreditsScreen.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000024 /* CreditsScreen.swift */; };
		000000000000000000000027 /* HomeScreen.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000026 /* HomeScreen.swift */; };
		000000000000000000000029 /* LyricsScreen.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000028 /* LyricsScreen.swift */; };
		00000000000000000000002B /* MainTabView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000002A /* MainTabView.swift */; };
		00000000000000000000002D /* NotesScreen.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000002C /* NotesScreen.swift */; };
		00000000000000000000002F /* PlayerScreen.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000002E /* PlayerScreen.swift */; };
		000000000000000000000031 /* TourScreen.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000030 /* TourScreen.swift */; };
		000000000000000000000033 /* DirectuneTheme.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000032 /* DirectuneTheme.swift */; };
		000000000000000000000035 /* FunkyTheme.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000034 /* FunkyTheme.swift */; };
		000000000000000000000037 /* IndieTheme.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000036 /* IndieTheme.swift */; };
		000000000000000000000039 /* JazzTheme.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000038 /* JazzTheme.swift */; };
		00000000000000000000003B /* PopTheme.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000003A /* PopTheme.swift */; };
		00000000000000000000003D /* RockTheme.swift in Sources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000003C /* RockTheme.swift */; };
		000000000000000000000053 /* TracklistScreen.swift in Sources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000052 /* TracklistScreen.swift */; };
		00000000000000000000003F /* content.json in Resources */ = {isa = PBXBuildFile; fileRef = 00000000000000000000003E /* content.json */; };
		000000000000000000000045 /* Assets.xcassets in Resources */ = {isa = PBXBuildFile; fileRef = 000000000000000000000044 /* Assets.xcassets */; };
		/* ADD MP3 BUILD FILES HERE — one per song, using UUID pattern AA0000000000000000000N02 */
		/* ADD LRC BUILD FILES HERE — one per LRC file, using UUID pattern BB0000000000000000000N02 */
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
		00000000000000000000000D /* Direktune.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = Direktune.app; sourceTree = BUILT_PRODUCTS_DIR; };
		00000000000000000000000E /* ContentLoader.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ContentLoader.swift; sourceTree = "<group>"; };
		000000000000000000000010 /* DirektureApp.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = DirektureApp.swift; sourceTree = "<group>"; };
		000000000000000000000012 /* AudioPlayerManager.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = AudioPlayerManager.swift; sourceTree = "<group>"; };
		000000000000000000000014 /* LyricsSync.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = LyricsSync.swift; sourceTree = "<group>"; };
		000000000000000000000016 /* MiniPlayerBar.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = MiniPlayerBar.swift; sourceTree = "<group>"; };
		000000000000000000000018 /* OwnershipBadge.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = OwnershipBadge.swift; sourceTree = "<group>"; };
		00000000000000000000001A /* RotatingVinyl.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = RotatingVinyl.swift; sourceTree = "<group>"; };
		00000000000000000000001C /* SeekBar.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = SeekBar.swift; sourceTree = "<group>"; };
		00000000000000000000001E /* AppContent.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = AppContent.swift; sourceTree = "<group>"; };
		000000000000000000000050 /* AppContent+Helpers.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "AppContent+Helpers.swift"; sourceTree = "<group>"; };
		000000000000000000000020 /* LRCLine.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = LRCLine.swift; sourceTree = "<group>"; };
		000000000000000000000022 /* Song.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = Song.swift; sourceTree = "<group>"; };
		000000000000000000000024 /* CreditsScreen.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = CreditsScreen.swift; sourceTree = "<group>"; };
		000000000000000000000026 /* HomeScreen.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = HomeScreen.swift; sourceTree = "<group>"; };
		000000000000000000000028 /* LyricsScreen.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = LyricsScreen.swift; sourceTree = "<group>"; };
		00000000000000000000002A /* MainTabView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = MainTabView.swift; sourceTree = "<group>"; };
		00000000000000000000002C /* NotesScreen.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = NotesScreen.swift; sourceTree = "<group>"; };
		00000000000000000000002E /* PlayerScreen.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = PlayerScreen.swift; sourceTree = "<group>"; };
		000000000000000000000030 /* TourScreen.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = TourScreen.swift; sourceTree = "<group>"; };
		000000000000000000000032 /* DirectuneTheme.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = DirectuneTheme.swift; sourceTree = "<group>"; };
		000000000000000000000034 /* FunkyTheme.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = FunkyTheme.swift; sourceTree = "<group>"; };
		000000000000000000000036 /* IndieTheme.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = IndieTheme.swift; sourceTree = "<group>"; };
		000000000000000000000038 /* JazzTheme.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = JazzTheme.swift; sourceTree = "<group>"; };
		00000000000000000000003A /* PopTheme.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = PopTheme.swift; sourceTree = "<group>"; };
		00000000000000000000003C /* RockTheme.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = RockTheme.swift; sourceTree = "<group>"; };
		000000000000000000000052 /* TracklistScreen.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = TracklistScreen.swift; sourceTree = "<group>"; };
		00000000000000000000003E /* content.json */ = {isa = PBXFileReference; lastKnownFileType = text.json; path = content.json; sourceTree = "<group>"; };
		000000000000000000000044 /* Assets.xcassets */ = {isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = Assets.xcassets; sourceTree = "<group>"; };
		CED6F6132F95FC3700072404 /* Info.plist */ = {isa = PBXFileReference; lastKnownFileType = text.plist; path = Info.plist; sourceTree = "<group>"; };
		/* ADD MP3 FILE REFERENCES HERE — one per song, using UUID pattern AA0000000000000000000N01 */
		/* Example: AA000000000000000000000101 = {isa = PBXFileReference; lastKnownFileType = audio.mp3; path = track01.mp3; sourceTree = "<group>"; }; */
		/* ADD LRC FILE REFERENCES HERE — one per LRC file, using UUID pattern BB0000000000000000000N01 */
/* End PBXFileReference section */

/* Begin PBXGroup section */
		00000000000000000000000B /* Direktune */ = {
			isa = PBXGroup;
			children = (
				CED6F6132F95FC3700072404 /* Info.plist */,
				000000000000000000000046 /* App */,
				000000000000000000000047 /* Audio */,
				000000000000000000000048 /* Components */,
				000000000000000000000049 /* Models */,
				00000000000000000000004A /* Screens */,
				00000000000000000000004B /* Theme */,
				00000000000000000000004C /* Resources */,
				000000000000000000000044 /* Assets.xcassets */,
				00000000000000000000000C /* Products */,
			);
			path = Direktune;
			sourceTree = "<group>";
		};
		00000000000000000000000C /* Products */ = {
			isa = PBXGroup;
			children = (00000000000000000000000D /* Direktune.app */,);
			name = Products;
			sourceTree = "<group>";
		};
		000000000000000000000046 /* App */ = {
			isa = PBXGroup;
			children = (
				00000000000000000000000E /* ContentLoader.swift */,
				000000000000000000000010 /* DirektureApp.swift */,
			);
			path = App; sourceTree = "<group>";
		};
		000000000000000000000047 /* Audio */ = {
			isa = PBXGroup;
			children = (
				000000000000000000000012 /* AudioPlayerManager.swift */,
				000000000000000000000014 /* LyricsSync.swift */,
			);
			path = Audio; sourceTree = "<group>";
		};
		000000000000000000000048 /* Components */ = {
			isa = PBXGroup;
			children = (
				000000000000000000000016 /* MiniPlayerBar.swift */,
				000000000000000000000018 /* OwnershipBadge.swift */,
				00000000000000000000001A /* RotatingVinyl.swift */,
				00000000000000000000001C /* SeekBar.swift */,
			);
			path = Components; sourceTree = "<group>";
		};
		000000000000000000000049 /* Models */ = {
			isa = PBXGroup;
			children = (
				00000000000000000000001E /* AppContent.swift */,
				000000000000000000000050 /* AppContent+Helpers.swift */,
				000000000000000000000020 /* LRCLine.swift */,
				000000000000000000000022 /* Song.swift */,
			);
			path = Models; sourceTree = "<group>";
		};
		00000000000000000000004A /* Screens */ = {
			isa = PBXGroup;
			children = (
				000000000000000000000024 /* CreditsScreen.swift */,
				000000000000000000000026 /* HomeScreen.swift */,
				000000000000000000000028 /* LyricsScreen.swift */,
				00000000000000000000002A /* MainTabView.swift */,
				00000000000000000000002C /* NotesScreen.swift */,
				00000000000000000000002E /* PlayerScreen.swift */,
				000000000000000000000030 /* TourScreen.swift */,
				000000000000000000000052 /* TracklistScreen.swift */,
			);
			path = Screens; sourceTree = "<group>";
		};
		00000000000000000000004B /* Theme */ = {
			isa = PBXGroup;
			children = (
				000000000000000000000032 /* DirectuneTheme.swift */,
				000000000000000000000034 /* FunkyTheme.swift */,
				000000000000000000000036 /* IndieTheme.swift */,
				000000000000000000000038 /* JazzTheme.swift */,
				00000000000000000000003A /* PopTheme.swift */,
				00000000000000000000003C /* RockTheme.swift */,
			);
			path = Theme; sourceTree = "<group>";
		};
		00000000000000000000004C /* Resources */ = {
			isa = PBXGroup;
			children = (
				00000000000000000000003E /* content.json */,
				/* ADD MP3 AND LRC FILE REFS HERE */
			);
			path = Resources; sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		000000000000000000000002 /* Direktune */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 000000000000000000000009;
			buildPhases = (000000000000000000000003 /* Sources */, 000000000000000000000004 /* Resources */,);
			buildRules = ();
			dependencies = ();
			name = Direktune;
			productName = Direktune;
			productReference = 00000000000000000000000D /* Direktune.app */;
			productType = "com.apple.product-type.application";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		000000000000000000000001 /* Project object */ = {
			isa = PBXProject;
			attributes = {
				BuildIndependentTargetsInParallel = 1;
				LastSwiftUpdateCheck = 1500;
				LastUpgradeCheck = 2640;
				TargetAttributes = { 000000000000000000000002 = { CreatedOnToolsVersion = 15.0; }; };
			};
			buildConfigurationList = 00000000000000000000000A;
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (en, Base,);
			mainGroup = 00000000000000000000000B /* Direktune */;
			productRefGroup = 00000000000000000000000C /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (000000000000000000000002 /* Direktune */,);
		};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		000000000000000000000004 /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				00000000000000000000003F /* content.json in Resources */,
				000000000000000000000045 /* Assets.xcassets in Resources */,
				/* ADD MP3 AND LRC BUILD FILE REFS HERE */
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		000000000000000000000003 /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				00000000000000000000000F /* ContentLoader.swift in Sources */,
				000000000000000000000011 /* DirektureApp.swift in Sources */,
				000000000000000000000013 /* AudioPlayerManager.swift in Sources */,
				000000000000000000000015 /* LyricsSync.swift in Sources */,
				000000000000000000000017 /* MiniPlayerBar.swift in Sources */,
				000000000000000000000019 /* OwnershipBadge.swift in Sources */,
				00000000000000000000001B /* RotatingVinyl.swift in Sources */,
				00000000000000000000001D /* SeekBar.swift in Sources */,
				00000000000000000000001F /* AppContent.swift in Sources */,
				000000000000000000000051 /* AppContent+Helpers.swift in Sources */,
				000000000000000000000021 /* LRCLine.swift in Sources */,
				000000000000000000000023 /* Song.swift in Sources */,
				000000000000000000000025 /* CreditsScreen.swift in Sources */,
				000000000000000000000027 /* HomeScreen.swift in Sources */,
				000000000000000000000029 /* LyricsScreen.swift in Sources */,
				00000000000000000000002B /* MainTabView.swift in Sources */,
				00000000000000000000002D /* NotesScreen.swift in Sources */,
				00000000000000000000002F /* PlayerScreen.swift in Sources */,
				000000000000000000000031 /* TourScreen.swift in Sources */,
				000000000000000000000033 /* DirectuneTheme.swift in Sources */,
				000000000000000000000035 /* FunkyTheme.swift in Sources */,
				000000000000000000000037 /* IndieTheme.swift in Sources */,
				000000000000000000000039 /* JazzTheme.swift in Sources */,
				00000000000000000000003B /* PopTheme.swift in Sources */,
				00000000000000000000003D /* RockTheme.swift in Sources */,
				000000000000000000000053 /* TracklistScreen.swift in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		000000000000000000000005 /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = Direktune/Info.plist;
				INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UIBackgroundModes = audio;
				INFOPLIST_KEY_UILaunchScreen_Generation = YES;
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPhone = UIInterfaceOrientationPortrait;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				MARKETING_VERSION = 1.0;
				PRODUCT_BUNDLE_IDENTIFIER = USER_BUNDLE_ID;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = 1;
			};
			name = Debug;
		};
		000000000000000000000006 /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = Direktune/Info.plist;
				INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UIBackgroundModes = audio;
				INFOPLIST_KEY_UILaunchScreen_Generation = YES;
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPhone = UIInterfaceOrientationPortrait;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				MARKETING_VERSION = 1.0;
				PRODUCT_BUNDLE_IDENTIFIER = USER_BUNDLE_ID;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = 1;
			};
			name = Release;
		};
		000000000000000000000007 /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_TESTABILITY = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = ("DEBUG=1", "$(inherited)",);
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				MTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;
				MTL_FAST_MATH = YES;
				ONLY_ACTIVE_ARCH = YES;
				SDKROOT = iphoneos;
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG;
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
			};
			name = Debug;
		};
		000000000000000000000008 /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = s;
				GCC_PREPROCESSOR_DEFINITIONS = "$(inherited)";
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				MTL_ENABLE_DEBUG_INFO = NO;
				MTL_FAST_MATH = YES;
				ONLY_ACTIVE_ARCH = NO;
				SDKROOT = iphoneos;
				SWIFT_COMPILATION_MODE = wholemodule;
				SWIFT_OPTIMIZATION_LEVEL = "-Owholemodule";
				VALIDATE_PRODUCT = YES;
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		000000000000000000000009 = {
			isa = XCConfigurationList;
			buildConfigurations = (000000000000000000000005 /* Debug */, 000000000000000000000006 /* Release */,);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		00000000000000000000000A = {
			isa = XCConfigurationList;
			buildConfigurations = (000000000000000000000007 /* Debug */, 000000000000000000000008 /* Release */,);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = 000000000000000000000001 /* Project object */;
}
```

**Example: if the user has 3 songs (track01.mp3, track02.mp3, track03.mp3) and 2 LRC files (track01.lrc, track03.lrc), add:**

In PBXBuildFile:
```
AA000000000000000000000102 /* track01.mp3 in Resources */ = {isa = PBXBuildFile; fileRef = AA000000000000000000000101 /* track01.mp3 */; };
AA000000000000000000000202 /* track02.mp3 in Resources */ = {isa = PBXBuildFile; fileRef = AA000000000000000000000201 /* track02.mp3 */; };
AA000000000000000000000302 /* track03.mp3 in Resources */ = {isa = PBXBuildFile; fileRef = AA000000000000000000000301 /* track03.mp3 */; };
BB000000000000000000000102 /* track01.lrc in Resources */ = {isa = PBXBuildFile; fileRef = BB000000000000000000000101 /* track01.lrc */; };
BB000000000000000000000302 /* track03.lrc in Resources */ = {isa = PBXBuildFile; fileRef = BB000000000000000000000301 /* track03.lrc */; };
```

In PBXFileReference:
```
AA000000000000000000000101 /* track01.mp3 */ = {isa = PBXFileReference; lastKnownFileType = audio.mp3; path = track01.mp3; sourceTree = "<group>"; };
AA000000000000000000000201 /* track02.mp3 */ = {isa = PBXFileReference; lastKnownFileType = audio.mp3; path = track02.mp3; sourceTree = "<group>"; };
AA000000000000000000000301 /* track03.mp3 */ = {isa = PBXFileReference; lastKnownFileType = audio.mp3; path = track03.mp3; sourceTree = "<group>"; };
BB000000000000000000000101 /* track01.lrc */ = {isa = PBXFileReference; lastKnownFileType = text; path = track01.lrc; sourceTree = "<group>"; };
BB000000000000000000000301 /* track03.lrc */ = {isa = PBXFileReference; lastKnownFileType = text; path = track03.lrc; sourceTree = "<group>"; };
```

In the Resources group children and in PBXResourcesBuildPhase files, add the corresponding `AA...01` and `BB...01` references.

---

## 5. Android Project Specification

### 5.1 Directory Tree

```
direktune-android/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── gradle/
│   └── libs.versions.toml
├── gradlew
├── gradlew.bat
└── app/
    ├── build.gradle.kts
    └── src/main/
        ├── AndroidManifest.xml
        ├── assets/
        │   ├── content.json          ← generated from user data
        │   ├── track01.mp3           ← user's audio files go here
        │   └── track01.lrc           ← user's LRC files go here (if any)
        ├── res/
        │   ├── drawable/
        │   │   ├── album_artwork.png ← user's album art (copy here)
        │   │   └── band_photo.png    ← user's band photo (copy here)
        │   ├── mipmap-xxxhdpi/
        │   │   ├── ic_launcher.png        ← user's app icon (copy here, 192×192)
        │   │   └── ic_launcher_round.png  ← same image (copy here)
        │   ├── values/
        │   │   ├── strings.xml
        │   │   └── themes.xml
        │   └── xml/
        │       └── backup_rules.xml
        └── java/com/direktune/app/
            ├── MainActivity.kt
            ├── audio/
            │   ├── PlayerService.kt
            │   └── PlayerViewModel.kt
            ├── model/
            │   ├── AppContent.kt
            │   └── ContentLoader.kt
            ├── theme/
            │   └── DirektunTheme.kt
            └── ui/
                ├── CreditsScreen.kt
                ├── HomeScreen.kt
                ├── LyricsScreen.kt
                ├── NotesScreen.kt
                ├── PlayerScreen.kt
                ├── TourScreen.kt
                └── components/
                    ├── MiniPlayer.kt
                    └── RotatingVinyl.kt
```

**Package name substitution:** Replace every occurrence of `com.direktune.app` with the user's Android Package ID in all Kotlin files and in build.gradle.kts.

---

### 5.2 build.gradle.kts (root)

```kotlin
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
```

### 5.3 settings.gradle.kts

```kotlin
pluginManagement {
    repositories {
        google { content { includeGroupByRegex("com\\.android.*"); includeGroupByRegex("com\\.google.*"); includeGroupByRegex("androidx.*") } }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { google(); mavenCentral() }
}
rootProject.name = "direktune-android"
include(":app")
```

### 5.4 gradle.properties

```
org.gradle.jvmargs=-Xmx1536m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.caching=true
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
```

### 5.5 gradle/libs.versions.toml

```toml
[versions]
agp = "8.7.3"
kotlin = "2.0.21"
coreKtx = "1.13.1"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.12.01"
media3 = "1.4.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-media3-exoplayer = { group = "androidx.media3", name = "media3-exoplayer", version.ref = "media3" }
androidx-media3-session = { group = "androidx.media3", name = "media3-session", version.ref = "media3" }
androidx-media3-ui = { group = "androidx.media3", name = "media3-ui", version.ref = "media3" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
```

### 5.6 app/build.gradle.kts

Replace `USER_PACKAGE_ID` with the user's Android Package ID.

```kotlin
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "USER_PACKAGE_ID"
    compileSdk = 35

    defaultConfig {
        applicationId = "USER_PACKAGE_ID"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures { compose = true }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_11)
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.media3.exoplayer)
    implementation(libs.androidx.media3.session)
    implementation(libs.androidx.media3.ui)
    debugImplementation(libs.androidx.ui.tooling)
}
```

### 5.7 app/src/main/AndroidManifest.xml

Replace `USER_PACKAGE_ID` with the user's Android Package ID.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Direktune">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".audio.PlayerService"
            android:foregroundServiceType="mediaPlayback"
            android:exported="true">
            <intent-filter>
                <action android:name="androidx.media3.session.MediaSessionService" />
            </intent-filter>
        </service>

    </application>
</manifest>
```

### 5.8 app/src/main/res/values/strings.xml

Replace `ALBUM_TITLE` with the user's album title.

```xml
<resources>
    <string name="app_name">ALBUM_TITLE</string>
</resources>
```

### 5.9 app/src/main/res/values/themes.xml

```xml
<resources>
    <style name="Theme.Direktune" parent="android:Theme.Material.Light.NoActionBar" />
</resources>
```

### 5.10 app/src/main/res/xml/backup_rules.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <exclude domain="sharedpref" path="."/>
</full-backup-content>
```

### 5.11 Android Kotlin Sources

Replace `com.direktune.app` with the user's package ID in every file below.

**MainActivity.kt**
```kotlin
package com.direktune.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.viewmodel.compose.viewModel
import com.direktune.app.audio.PlayerViewModel
import com.direktune.app.model.ContentLoader
import com.direktune.app.theme.DirektunTheme
import com.direktune.app.theme.parseAccentColor
import com.direktune.app.ui.*
import com.direktune.app.ui.components.MiniPlayer
import kotlinx.coroutines.launch

private data class NavItem(val label: String, val icon: ImageVector)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 0)
            }
        }
        val content = ContentLoader.load(this)
        setContent {
            val accentColor = remember { parseAccentColor(content.accentColor) }
            DirektunTheme(accentColor = accentColor) {
                val playerViewModel: PlayerViewModel = viewModel()
                val scope = rememberCoroutineScope()
                val pagerState = rememberPagerState(pageCount = { 6 })
                val currentPage = pagerState.currentPage
                LaunchedEffect(Unit) { playerViewModel.connect(content.songs) }
                val navItems = listOf(
                    NavItem("Home",    Icons.Default.Home),
                    NavItem("Player",  Icons.Default.PlayCircle),
                    NavItem("Lyrics",  Icons.Default.LibraryMusic),
                    NavItem("Tour",    Icons.Default.LocationOn),
                    NavItem("Notes",   Icons.Default.Notes),
                    NavItem("Credits", Icons.Default.People),
                )
                val navigateTo: (Int) -> Unit = { page -> scope.launch { pagerState.animateScrollToPage(page) } }
                Scaffold(
                    bottomBar = {
                        if (currentPage != 0) {
                            Column {
                                MiniPlayer(viewModel = playerViewModel, content = content, onTap = { navigateTo(1) })
                                NavigationBar {
                                    navItems.forEachIndexed { index, item ->
                                        NavigationBarItem(
                                            selected = currentPage == index,
                                            onClick = { navigateTo(index) },
                                            icon = { Icon(item.icon, contentDescription = item.label) },
                                            label = { Text(item.label) },
                                        )
                                    }
                                }
                            }
                        }
                    }
                ) { padding ->
                    HorizontalPager(state = pagerState, modifier = Modifier.padding(padding), userScrollEnabled = true) { page ->
                        when (page) {
                            0 -> HomeScreen(onNavigate = navigateTo, content = content, playerViewModel = playerViewModel)
                            1 -> PlayerScreen(playerViewModel, content)
                            2 -> LyricsScreen(playerViewModel, content)
                            3 -> TourScreen(content)
                            4 -> NotesScreen(content)
                            5 -> CreditsScreen(content)
                        }
                    }
                }
            }
        }
    }
}
```

**model/AppContent.kt**
```kotlin
package com.direktune.app.model
import androidx.annotation.Keep

@Keep data class AppContent(
    val artistName: String = "",
    val albumTitle: String = "",
    val genre: String = "",
    val year: Int = 0,
    val bandPhotoFilename: String = "",
    val albumArtworkFilename: String = "",
    val accentColor: String = "#6200EE",
    val theme: String = "dark",
    val notes: String = "",
    val credits: String = "",
    val ownershipBadgeText: String = "",
    val songs: List<Song> = emptyList(),
    val tourDates: List<TourDate>? = null,
)
@Keep data class Song(
    val title: String = "",
    val filename: String = "",
    val artworkFilename: String? = null,
    val lrcFilename: String? = null,
    val lyrics: String? = null,
)
@Keep data class TourDate(
    val date: String = "",
    val place: String = "",
    val details: String = "",
)
```

**model/ContentLoader.kt**
```kotlin
package com.direktune.app.model
import android.content.Context
import android.util.Log
import org.json.JSONObject

object ContentLoader {
    private const val TAG = "ContentLoader"
    private var cached: AppContent? = null

    fun load(context: Context): AppContent {
        cached?.let { return it }
        return try {
            val json = context.assets.open("content.json").bufferedReader().use { it.readText() }
            parseContent(JSONObject(json)).also { cached = it }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to load content.json: ${e.message}", e)
            AppContent()
        }
    }

    private fun parseContent(j: JSONObject): AppContent {
        val songsArray = j.optJSONArray("songs")
        val songs = mutableListOf<Song>()
        if (songsArray != null) {
            for (i in 0 until songsArray.length()) {
                val s = songsArray.getJSONObject(i)
                songs.add(Song(
                    title = s.optString("title"),
                    filename = s.optString("filename"),
                    artworkFilename = s.optString("artworkFilename").takeIf { it.isNotEmpty() },
                    lrcFilename = s.optString("lrcFilename").takeIf { it.isNotEmpty() },
                    lyrics = s.optString("lyrics").takeIf { it.isNotEmpty() },
                ))
            }
        }
        val tourArray = j.optJSONArray("tourDates")
        val tourDates = mutableListOf<TourDate>()
        if (tourArray != null) {
            for (i in 0 until tourArray.length()) {
                val t = tourArray.getJSONObject(i)
                tourDates.add(TourDate(date = t.optString("date"), place = t.optString("place"), details = t.optString("details")))
            }
        }
        return AppContent(
            artistName = j.optString("artistName"),
            albumTitle = j.optString("albumTitle"),
            genre = j.optString("genre"),
            year = j.optInt("year", 0),
            bandPhotoFilename = j.optString("bandPhotoFilename"),
            albumArtworkFilename = j.optString("albumArtworkFilename"),
            accentColor = j.optString("accentColor", "#6200EE"),
            theme = j.optString("theme", "dark"),
            notes = j.optString("notes"),
            credits = j.optString("credits"),
            ownershipBadgeText = j.optString("ownershipBadgeText"),
            songs = songs,
            tourDates = tourDates.takeIf { it.isNotEmpty() },
        )
    }
}
```

**audio/PlayerService.kt**
```kotlin
package com.direktune.app.audio
import android.app.PendingIntent
import android.content.Intent
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import com.direktune.app.MainActivity

class PlayerService : MediaSessionService() {
    private var mediaSession: MediaSession? = null
    override fun onCreate() {
        super.onCreate()
        val player = ExoPlayer.Builder(this)
            .setAudioAttributes(AudioAttributes.Builder().setContentType(C.AUDIO_CONTENT_TYPE_MUSIC).setUsage(C.USAGE_MEDIA).build(), true)
            .setHandleAudioBecomingNoisy(true)
            .build()
        val intent = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        mediaSession = MediaSession.Builder(this, player).setSessionActivity(intent).build()
    }
    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? = mediaSession
    override fun onDestroy() {
        mediaSession?.run { player.release(); release(); mediaSession = null }
        super.onDestroy()
    }
}
```

**audio/PlayerViewModel.kt**
```kotlin
package com.direktune.app.audio
import android.app.Application
import android.content.ComponentName
import androidx.compose.runtime.*
import androidx.lifecycle.AndroidViewModel
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.direktune.app.model.Song

class PlayerViewModel(app: Application) : AndroidViewModel(app) {
    private var controller: MediaController? = null
    var isPlaying by mutableStateOf(false); private set
    var currentIndex by mutableIntStateOf(0); private set
    private val listener = object : Player.Listener {
        override fun onIsPlayingChanged(playing: Boolean) { isPlaying = playing }
        override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) { currentIndex = controller?.currentMediaItemIndex ?: 0 }
    }
    fun connect(songs: List<Song>) {
        if (controller != null) return
        val context = getApplication<Application>()
        val token = SessionToken(context, ComponentName(context, PlayerService::class.java))
        val future = MediaController.Builder(context, token).buildAsync()
        future.addListener({
            val c = runCatching { future.get() }.getOrNull() ?: return@addListener
            controller = c; c.addListener(listener)
            if (c.mediaItemCount == 0) {
                val items = songs.map { MediaItem.Builder().setUri("asset:///${it.filename}").build() }
                c.setMediaItems(items); c.prepare()
            }
            isPlaying = c.isPlaying; currentIndex = c.currentMediaItemIndex.coerceAtLeast(0)
        }, context.mainExecutor)
    }
    fun togglePlayPause() { controller?.let { if (it.isPlaying) it.pause() else it.play() } }
    fun skipTo(index: Int) { controller?.seekToDefaultPosition(index); controller?.play() }
    fun toggleShuffle() { controller?.let { it.shuffleModeEnabled = !it.shuffleModeEnabled } }
    override fun onCleared() { controller?.removeListener(listener); controller?.release(); super.onCleared() }
}
```

**theme/DirektunTheme.kt**
```kotlin
package com.direktune.app.theme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

@Composable
fun DirektunTheme(accentColor: Color, content: @Composable () -> Unit) {
    val colorScheme = darkColorScheme(
        primary = accentColor, onPrimary = Color.White,
        secondary = accentColor.copy(alpha = 0.7f),
        surface = Color(0xFF121212), onSurface = Color.White,
        background = Color(0xFF0A0A0A), onBackground = Color.White,
        surfaceVariant = Color(0xFF1E1E1E), onSurfaceVariant = Color(0xFFB3B3B3),
    )
    MaterialTheme(colorScheme = colorScheme, content = content)
}

fun parseAccentColor(hex: String): Color = runCatching {
    Color(android.graphics.Color.parseColor(hex))
}.getOrDefault(Color(0xFF7F52CF))
```

**ui/HomeScreen.kt**
```kotlin
package com.direktune.app.ui
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.direktune.app.R
import com.direktune.app.audio.PlayerViewModel
import com.direktune.app.model.AppContent
import com.direktune.app.ui.components.MiniPlayer

private data class GridItem(val label: String, val icon: ImageVector, val page: Int)

@Composable
fun HomeScreen(onNavigate: (Int) -> Unit, content: AppContent, playerViewModel: PlayerViewModel) {
    val items = listOf(
        GridItem("Player",  Icons.Default.PlayCircle,   1),
        GridItem("Lyrics",  Icons.Default.LibraryMusic, 2),
        GridItem("Tour",    Icons.Default.LocationOn,   3),
        GridItem("Notes",   Icons.Default.Notes,        4),
        GridItem("Credits", Icons.Default.People,       5),
        GridItem("Random",  Icons.Default.Shuffle,      1),
    )
    val rows = items.chunked(3)
    Column(modifier = Modifier.fillMaxSize()) {
        Box(modifier = Modifier.weight(1f).fillMaxWidth()) {
            Image(painter = painterResource(R.drawable.band_photo), contentDescription = "Band photo", contentScale = ContentScale.Crop, modifier = Modifier.fillMaxSize())
        }
        Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            rows.forEach { rowItems ->
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    rowItems.forEach { item ->
                        ElevatedCard(onClick = { onNavigate(item.page) }, modifier = Modifier.weight(1f)) {
                            Column(modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(imageVector = item.icon, contentDescription = item.label, modifier = Modifier.size(24.dp), tint = MaterialTheme.colorScheme.primary)
                                Spacer(Modifier.height(4.dp))
                                Text(text = item.label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurface)
                            }
                        }
                    }
                }
            }
        }
        MiniPlayer(viewModel = playerViewModel, content = content, onTap = { onNavigate(1) })
    }
}
```

**ui/PlayerScreen.kt**
```kotlin
package com.direktune.app.ui
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PauseCircle
import androidx.compose.material.icons.filled.PlayCircle
import androidx.compose.material.icons.filled.Shuffle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.direktune.app.R
import com.direktune.app.audio.PlayerViewModel
import com.direktune.app.model.AppContent

@Composable
fun PlayerScreen(viewModel: PlayerViewModel, content: AppContent) {
    LazyColumn(modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        item {
            Spacer(Modifier.height(24.dp))
            Image(painter = painterResource(R.drawable.album_artwork), contentDescription = content.albumTitle, modifier = Modifier.size(270.dp).clip(RoundedCornerShape(20.dp)), contentScale = ContentScale.Crop)
            Spacer(Modifier.height(20.dp))
            Text(text = content.albumTitle, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onBackground)
            Text(text = "${content.artistName} · ${content.year}", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { viewModel.togglePlayPause() }) {
                    Icon(imageVector = if (viewModel.isPlaying) Icons.Default.PauseCircle else Icons.Default.PlayCircle, contentDescription = if (viewModel.isPlaying) "Pause" else "Play", modifier = Modifier.size(68.dp), tint = MaterialTheme.colorScheme.primary)
                }
                IconButton(onClick = { viewModel.toggleShuffle() }) {
                    Icon(imageVector = Icons.Default.Shuffle, contentDescription = "Shuffle", modifier = Modifier.size(28.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            Spacer(Modifier.height(8.dp)); HorizontalDivider(); Spacer(Modifier.height(8.dp))
        }
        itemsIndexed(content.songs) { index, song ->
            Row(modifier = Modifier.fillMaxWidth().clickable { viewModel.skipTo(index) }.padding(vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(text = "${index + 1}", style = MaterialTheme.typography.bodySmall, color = if (index == viewModel.currentIndex) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.width(28.dp))
                Text(text = song.title, style = MaterialTheme.typography.bodyMedium, color = if (index == viewModel.currentIndex) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface, modifier = Modifier.weight(1f))
            }
            HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)
        }
        item { Spacer(Modifier.height(32.dp)) }
    }
}
```

**ui/LyricsScreen.kt**
```kotlin
package com.direktune.app.ui
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.direktune.app.audio.PlayerViewModel
import com.direktune.app.model.AppContent
import com.direktune.app.ui.components.RotatingVinyl

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LyricsScreen(viewModel: PlayerViewModel, content: AppContent) {
    var selectedIndex by remember { mutableIntStateOf(viewModel.currentIndex) }
    LaunchedEffect(viewModel.currentIndex) { selectedIndex = viewModel.currentIndex }
    Column(modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Spacer(Modifier.height(24.dp))
        RotatingVinyl(isPlaying = viewModel.isPlaying, size = 160.dp)
        Spacer(Modifier.height(16.dp))
        if (content.songs.size > 1) {
            var expanded by remember { mutableStateOf(false) }
            ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = !expanded }, modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(value = content.songs.getOrNull(selectedIndex)?.title ?: "", onValueChange = {}, readOnly = true,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) }, modifier = Modifier.menuAnchor().fillMaxWidth())
                ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                    content.songs.forEachIndexed { index, song ->
                        DropdownMenuItem(text = { Text(song.title) }, onClick = { selectedIndex = index; expanded = false; viewModel.skipTo(index) })
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
        }
        val lyrics = content.songs.getOrNull(selectedIndex)?.lyrics?.takeIf { it.isNotBlank() } ?: "No lyrics available."
        Text(text = lyrics, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onBackground, modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()))
        Spacer(Modifier.height(32.dp))
    }
}
```

**ui/TourScreen.kt**
```kotlin
package com.direktune.app.ui
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.direktune.app.model.AppContent
import com.direktune.app.model.TourDate

@Composable
fun TourScreen(content: AppContent) {
    val dates: List<TourDate> = content.tourDates?.takeIf { it.isNotEmpty() }
        ?: List(12) { TourDate(date = "", place = "", details = "Coming Soon to your Town") }
    LazyColumn(modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
        item {
            Spacer(Modifier.height(24.dp))
            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
                Text("Date",    modifier = Modifier.weight(0.25f), fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text("Place",   modifier = Modifier.weight(0.35f), fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text("Details", modifier = Modifier.weight(0.40f), fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            HorizontalDivider()
        }
        itemsIndexed(dates) { _, tourDate ->
            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp)) {
                Text(tourDate.date,    modifier = Modifier.weight(0.25f), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onBackground)
                Text(tourDate.place,   modifier = Modifier.weight(0.35f), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onBackground)
                Text(tourDate.details, modifier = Modifier.weight(0.40f), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)
        }
        item { Spacer(Modifier.height(32.dp)) }
    }
}
```

**ui/NotesScreen.kt**
```kotlin
package com.direktune.app.ui
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.direktune.app.model.AppContent

@Composable
fun NotesScreen(content: AppContent) {
    Column(modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp).verticalScroll(rememberScrollState())) {
        Spacer(Modifier.height(24.dp))
        if (content.notes.isNotBlank()) {
            Text("Liner Notes", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.height(8.dp))
            Text(content.notes, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onBackground)
            Spacer(Modifier.height(24.dp))
        }
        if (content.credits.isNotBlank()) {
            Text("Credits", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.height(8.dp))
            Text(content.credits, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onBackground)
        }
        Spacer(Modifier.height(32.dp))
    }
}
```

**ui/CreditsScreen.kt**
```kotlin
package com.direktune.app.ui
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.direktune.app.model.AppContent

@Composable
fun CreditsScreen(content: AppContent) {
    Column(modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp).verticalScroll(rememberScrollState()), horizontalAlignment = Alignment.CenterHorizontally) {
        Spacer(Modifier.height(24.dp))
        Text(content.artistName, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onBackground, textAlign = TextAlign.Center)
        Text(content.albumTitle, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
        Spacer(Modifier.height(24.dp))
        if (content.credits.isNotBlank()) {
            Text(content.credits, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onBackground, textAlign = TextAlign.Center)
            Spacer(Modifier.height(24.dp))
        }
        if (content.ownershipBadgeText.isNotBlank()) {
            HorizontalDivider(); Spacer(Modifier.height(16.dp))
            Text(content.ownershipBadgeText, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
        }
        Spacer(Modifier.height(32.dp))
    }
}
```

**ui/components/MiniPlayer.kt**
```kotlin
package com.direktune.app.ui.components
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.direktune.app.audio.PlayerViewModel
import com.direktune.app.model.AppContent

@Composable
fun MiniPlayer(viewModel: PlayerViewModel, content: AppContent, onTap: () -> Unit) {
    if (content.songs.isEmpty()) return
    val song = content.songs.getOrNull(viewModel.currentIndex) ?: content.songs.first()
    Surface(color = MaterialTheme.colorScheme.primaryContainer, tonalElevation = 8.dp, shadowElevation = 4.dp, modifier = Modifier.fillMaxWidth().clickable { onTap() }) {
        Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(text = song.title, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onPrimaryContainer, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
            IconButton(onClick = { viewModel.togglePlayPause() }, modifier = Modifier.size(32.dp)) {
                Icon(imageVector = if (viewModel.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow, contentDescription = if (viewModel.isPlaying) "Pause" else "Play", tint = MaterialTheme.colorScheme.onPrimaryContainer, modifier = Modifier.size(16.dp))
            }
        }
    }
}
```

**ui/components/RotatingVinyl.kt**
```kotlin
package com.direktune.app.ui.components
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.direktune.app.R

@Composable
fun RotatingVinyl(isPlaying: Boolean, size: Dp = 200.dp, modifier: Modifier = Modifier) {
    val rotation = remember { Animatable(0f) }
    LaunchedEffect(isPlaying) {
        if (isPlaying) {
            while (true) { rotation.animateTo(targetValue = rotation.value + 360f, animationSpec = tween(durationMillis = 8000, easing = LinearEasing)) }
        }
    }
    Image(painter = painterResource(R.drawable.album_artwork), contentDescription = null, contentScale = ContentScale.Crop, modifier = modifier.size(size).rotate(rotation.value).clip(CircleShape))
}
```

---

## 6. Assembly Instructions

Follow these steps in order when building a user's project.

**Step 1 — Validate assets**
Confirm all of the following are present before proceeding:
- 1–12 MP3 files, total estimated size ≤ 100 MB
- Artist/band photo image
- Album artwork image (square)
- App icon image (square, ≥ 1024×1024 px)
- All song titles provided
- Liner notes, credits, and ownership badge text provided

**Step 2 — Generate content.json**
Build the JSON from the user's answers following the schema in Section 3. Use clean filenames for all audio/image references (lowercase, no spaces, e.g. `track01.mp3`, `band_photo.png`).

**Step 3 — Build iOS project**
- Create the full directory tree from Section 4.1
- Write all Swift source files verbatim from Sections 4.4–4.14
- Write Info.plist, all xcassets Contents.json files
- Write the filled-in content.json into `Direktune/Resources/`
- Copy (or instruct user to copy) each MP3 into `Direktune/Resources/`
- Copy (or instruct user to copy) each LRC file into `Direktune/Resources/`
- Copy (or instruct user to copy) album_artwork.png into `Assets.xcassets/album_artwork.imageset/`
- Copy (or instruct user to copy) band_photo.png into `Assets.xcassets/band_photo.imageset/`
- Copy (or instruct user to copy) app_icon.png into `Assets.xcassets/AppIcon.appiconset/`
- Generate project.pbxproj following the template and UUID rules in Section 4.15, with the user's bundle ID replacing `USER_BUNDLE_ID`

**Step 4 — Build Android project**
- Create the full directory tree from Section 5.1
- Write all Kotlin source files verbatim from Section 5.11, replacing `com.direktune.app` with user's package ID
- Write all Gradle/config files from Sections 5.2–5.10, replacing `USER_PACKAGE_ID` and `ALBUM_TITLE`
- Write the filled-in content.json into `app/src/main/assets/`
- Copy (or instruct user to copy) each MP3 into `app/src/main/assets/`
- Copy (or instruct user to copy) each LRC file into `app/src/main/assets/`
- Copy (or instruct user to copy) album_artwork.png into `app/src/main/res/drawable/`
- Copy (or instruct user to copy) band_photo.png into `app/src/main/res/drawable/`
- Copy (or instruct user to copy) app icon (resized to 192×192 px) into `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` and `ic_launcher_round.png`

**Step 5 — Run the audit checklist (Section 7)**

**Step 6 — Report to the user (Section 8)**

---

## 7. Audit Checklist

Run through every item before declaring the project ready.

**content.json**
- [ ] Parses as valid JSON (no trailing commas, all special characters properly escaped)
- [ ] `theme` is one of: `indie`, `rock`, `pop`, `jazz`, `funky`
- [ ] Every MP3 filename in `songs[].filename` matches an actual file in Resources/ (iOS) and assets/ (Android)
- [ ] Every `lrcFilename` matches an actual LRC file
- [ ] `bandPhotoFilename` and `albumArtworkFilename` match actual image resources
- [ ] `ownershipBadgeText` is non-empty
- [ ] Tour dates: if provided, every entry has all 3 fields (date, place, details)

**iOS project**
- [ ] All 26 Swift source files present and complete (no truncated code)
- [ ] `Info.plist` contains `UIBackgroundModes: audio`
- [ ] `PRODUCT_BUNDLE_IDENTIFIER` in pbxproj set to user's bundle ID (not `USER_BUNDLE_ID`)
- [ ] No `DEVELOPMENT_TEAM` key in pbxproj
- [ ] MP3 PBXBuildFile and PBXFileReference entries present for every song
- [ ] LRC PBXBuildFile and PBXFileReference entries present for every LRC file
- [ ] MP3 and LRC UUIDs appear in both the Resources group children and ResourcesBuildPhase files
- [ ] Assets.xcassets contains `album_artwork.imageset`, `band_photo.imageset`, `AppIcon.appiconset` with correct Contents.json

**Android project**
- [ ] `applicationId` in app/build.gradle.kts matches user's package ID (not `USER_PACKAGE_ID`)
- [ ] `namespace` in app/build.gradle.kts matches user's package ID
- [ ] `android:label` in AndroidManifest.xml matches `@string/app_name`
- [ ] `strings.xml` has correct album title
- [ ] `PlayerService` declared in AndroidManifest.xml with `foregroundServiceType="mediaPlayback"`
- [ ] MP3 files present in `app/src/main/assets/`
- [ ] `album_artwork.png` and `band_photo.png` present in `app/src/main/res/drawable/`
- [ ] App icon present in `mipmap-xxxhdpi/`
- [ ] All Kotlin files use the user's package ID, not `com.direktune.app`

**Size**
- [ ] Estimated total size of audio files ≤ 100 MB

---

## 8. Delivery Summary

After completing both projects and passing the audit, tell the user the following:

---

**Your apps are ready.**

**iPhone app — uploading to the App Store:**
1. Open `Direktune/Direktune.xcodeproj` in **Xcode 15 or later** on a Mac.
2. In Xcode, select the Direktune target → **Signing & Capabilities** → set your **Team** (your Apple Developer account).
3. Connect your iPhone or select "Any iOS Device (arm64)" as the build target.
4. Choose **Product → Archive**.
5. When the Archive succeeds, click **Distribute App → App Store Connect → Upload**.
6. Go to [App Store Connect](https://appstoreconnect.apple.com) to complete your app listing and submit for review.

**Android app — uploading to Google Play:**
1. Open `direktune-android/` in **Android Studio** (Hedgehog or later).
2. In `app/build.gradle.kts`, confirm `applicationId` is your chosen package ID.
3. Choose **Build → Generate Signed Bundle/APK → Android App Bundle (.aab)** (preferred) or APK.
4. Create or select your keystore when prompted.
5. Go to [Google Play Console](https://play.google.com/console) → create a new app → upload the `.aab` file and complete your store listing.

---
