import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayerStore, Screen } from '../store/playerStore';
import { TRACKS } from '../data/tracks';

const ACCENT = '#C8A951';
const BG = '#111111';
const BORDER = '#2A2A2A';

export default function BottomBanners() {
  const insets = useSafeAreaInsets();
  const {
    currentTrackIndex,
    isPlaying,
    sound,
    activeScreen,
    navigate,
    togglePlay,
    skipNext,
    loadAndPlayTrack,
  } = usePlayerStore();

  const track = TRACKS[currentTrackIndex];

  const NAV_ITEMS: { label: string; screen: Screen }[] = [
    { label: 'Home', screen: 'home' },
    { label: 'Lyrics', screen: 'lyrics' },
    { label: 'Notes', screen: 'notes' },
    { label: 'Credits', screen: 'credits' },
  ];

  const handleSongNamePress = () => navigate('lyrics');

  const handlePlayPress = async () => {
    if (!sound) {
      await loadAndPlayTrack(currentTrackIndex);
    } else {
      await togglePlay();
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      {/* Banner 1 — Mini Player */}
      <View style={styles.miniPlayer}>
        <TouchableOpacity style={styles.songNameBtn} onPress={handleSongNamePress} activeOpacity={0.7}>
          <Text style={styles.songName} numberOfLines={1}>
            {track.title}
          </Text>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn} onPress={handlePlayPress} activeOpacity={0.7}>
            <Text style={styles.controlIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={skipNext} activeOpacity={0.7}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner 2 — Navigation */}
      <View style={styles.navBar}>
        {NAV_ITEMS.map(({ label, screen }) => {
          const isActive = activeScreen === screen;
          return (
            <TouchableOpacity
              key={screen}
              style={styles.navItem}
              onPress={() => navigate(screen)}
              activeOpacity={0.7}
            >
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  songNameBtn: {
    flex: 1,
    marginRight: 12,
  },
  songName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 19,
  },
  controlIcon: {
    fontSize: 16,
    color: ACCENT,
  },
  navBar: {
    flexDirection: 'row',
    height: 52,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    color: '#666666',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: ACCENT,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
  },
});
