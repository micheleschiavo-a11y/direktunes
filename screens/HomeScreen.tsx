import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALBUM, TRACKS } from '../data/tracks';
import { usePlayerStore } from '../store/playerStore';

const { width } = Dimensions.get('window');
const ACCENT = '#C8A951';
const BG = '#0A0A0A';

// Height of the two bottom banners (mini player ~56px + nav ~52px + border ~1px)
const BANNER_HEIGHT = 110;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { currentTrackIndex, isPlaying, togglePlay, toggleShuffle, isShuffled, loadAndPlayTrack } = usePlayerStore();

  const artSize = width * 0.72;

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: BANNER_HEIGHT + insets.bottom + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <Image source={ALBUM.artwork} style={[styles.artwork, { width: artSize, height: artSize }]} resizeMode="cover" />
      </View>

      {/* Album info */}
      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle}>{ALBUM.title}</Text>
        <Text style={styles.albumArtist}>{ALBUM.artist}</Text>
        <Text style={styles.albumYear}>{ALBUM.year}</Text>
      </View>

      {/* Playback controls */}
      <View style={styles.mainControls}>
        <TouchableOpacity
          style={[styles.mainBtn, styles.playBtn]}
          onPress={async () => {
            if (!usePlayerStore.getState().isReady) {
              await loadAndPlayTrack(currentTrackIndex);
            } else {
              await togglePlay();
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.mainBtnIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          <Text style={styles.mainBtnLabel}>{isPlaying ? 'Pausa' : 'Play'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainBtn, isShuffled && styles.shuffleActive]}
          onPress={toggleShuffle}
          activeOpacity={0.8}
        >
          <Text style={[styles.shuffleBtnIcon, isShuffled && { color: ACCENT }]}>⇌</Text>
          <Text style={[styles.shuffleBtnLabel, isShuffled && { color: ACCENT }]}>
            {isShuffled ? 'Shuffle On' : 'Shuffle'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Track list */}
      <View style={styles.trackList}>
        {TRACKS.map((track, index) => {
          const isActive = currentTrackIndex === index;
          return (
            <TouchableOpacity
              key={track.id}
              style={[styles.trackRow, isActive && styles.trackRowActive]}
              onPress={() => loadAndPlayTrack(index)}
              activeOpacity={0.7}
            >
              <View style={styles.trackNum}>
                {isActive && isPlaying ? (
                  <Text style={styles.trackNumText}>♪</Text>
                ) : (
                  <Text style={[styles.trackNumText, isActive && { color: ACCENT }]}>{index + 1}</Text>
                )}
              </View>
              <View style={styles.trackInfo}>
                <Text style={[styles.trackTitle, isActive && styles.trackTitleActive]} numberOfLines={1}>
                  {track.title}
                </Text>
                {track.isInstrumental && (
                  <Text style={styles.trackSubtitle}>Strumentale</Text>
                )}
              </View>
              <Text style={styles.trackDuration}>{track.durationFormatted}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {ALBUM.totalTracks} canzoni · {ALBUM.totalDuration}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  artworkContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  artwork: {
    borderRadius: 12,
  },
  albumInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  albumArtist: {
    color: ACCENT,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  albumYear: {
    color: '#666666',
    fontSize: 13,
  },
  mainControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  mainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1A1A',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  playBtn: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  shuffleActive: {
    borderColor: ACCENT,
  },
  mainBtnIcon: {
    fontSize: 18,
    color: '#000000', // black on gold play button
  },
  mainBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000', // black on gold play button
  },
  shuffleBtnIcon: {
    fontSize: 18,
    color: '#AAAAAA', // light on dark shuffle button
  },
  shuffleBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#AAAAAA', // light on dark shuffle button
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#2A2A2A',
    marginBottom: 8,
  },
  trackList: {
    width: '100%',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  trackRowActive: {
    backgroundColor: '#161616',
    borderRadius: 8,
  },
  trackNum: {
    width: 30,
    alignItems: 'center',
  },
  trackNumText: {
    color: '#555555',
    fontSize: 14,
    fontWeight: '600',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
  },
  trackTitle: {
    color: '#CCCCCC',
    fontSize: 15,
    fontWeight: '500',
  },
  trackTitleActive: {
    color: ACCENT,
    fontWeight: '700',
  },
  trackSubtitle: {
    color: '#555555',
    fontSize: 11,
    marginTop: 2,
  },
  trackDuration: {
    color: '#555555',
    fontSize: 13,
    marginLeft: 10,
  },
  summary: {
    marginTop: 20,
    paddingTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  summaryText: {
    color: '#444444',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
