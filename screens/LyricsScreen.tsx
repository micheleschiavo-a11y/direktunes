import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VinylRecord from '../components/VinylRecord';
import { usePlayerStore } from '../store/playerStore';
import { SYNCED_LYRICS } from '../data/lyrics';
import { TRACKS } from '../data/tracks';

const { width } = Dimensions.get('window');
const ACCENT = '#C8A951';
const BG = '#0A0A0A';
const BANNER_HEIGHT = 110;

export default function LyricsScreen() {
  const insets = useSafeAreaInsets();
  const { currentTrackIndex, isPlaying, position } = usePlayerStore();
  const scrollRef = useRef<ScrollView>(null);
  const lineRefs = useRef<number[]>([]);

  const track = TRACKS[currentTrackIndex];
  const lyrics = SYNCED_LYRICS[track.id] ?? [];

  // Find active lyric line index
  const activeLine = (() => {
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (position >= lyrics[i].time) idx = i;
      else break;
    }
    return idx;
  })();

  // Auto-scroll to active line
  useEffect(() => {
    if (lineRefs.current[activeLine] !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: Math.max(0, lineRefs.current[activeLine] - 120),
        animated: true,
      });
    }
  }, [activeLine]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Vinyl */}
      <View style={styles.vinylContainer}>
        <VinylRecord isPlaying={isPlaying} size={width * 0.55} />
      </View>

      {/* Track name */}
      <Text style={styles.trackName} numberOfLines={1}>
        {track.title}
      </Text>

      {/* Lyrics */}
      <ScrollView
        ref={scrollRef}
        style={styles.lyricsScroll}
        contentContainerStyle={[
          styles.lyricsContent,
          { paddingBottom: BANNER_HEIGHT + insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {lyrics.map((line, index) => {
          const isActive = index === activeLine;
          const isPast = index < activeLine;
          return (
            <Text
              key={index}
              onLayout={(e) => {
                lineRefs.current[index] = e.nativeEvent.layout.y;
              }}
              style={[
                styles.lyricLine,
                isPast && styles.lyricPast,
                isActive && styles.lyricActive,
              ]}
            >
              {line.text}
            </Text>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
  },
  vinylContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  trackName: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  lyricsScroll: {
    flex: 1,
    width: '100%',
  },
  lyricsContent: {
    paddingHorizontal: 28,
    paddingTop: 10,
    alignItems: 'center',
  },
  lyricLine: {
    color: '#444444',
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 28,
    marginVertical: 6,
    fontWeight: '400',
  },
  lyricPast: {
    color: '#333333',
  },
  lyricActive: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
