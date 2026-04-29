import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayerStore } from '../store/playerStore';
import { TRACKS } from '../data/tracks';

const ARTIST_PHOTO = require('../assets/miskia.jpg');

const ACCENT = '#C8A951';
const BG = '#0A0A0A';
// Only mini-player is visible on this screen (no nav bar)
const MINI_PLAYER_HEIGHT = 57;

export default function ArtistScreen() {
  const { navigate, loadAndPlayTrack } = usePlayerStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Image is square — display at full width so nothing is cropped
  const imageSize = width;

  const handleRandom = async () => {
    const randomIndex = Math.floor(Math.random() * TRACKS.length);
    await loadAndPlayTrack(randomIndex);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Full-width square photo — no crop */}
      <Image
        source={ARTIST_PHOTO}
        style={{ width: imageSize, height: imageSize }}
        resizeMode="contain"
      />

      {/* Info + buttons */}
      <View style={[styles.bottom, { paddingBottom: MINI_PLAYER_HEIGHT + insets.bottom }]}>
        <Text style={styles.artistName}>Miskia</Text>
        <Text style={styles.albumName}>Musica qualunque · 2026</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigate('home')}
            activeOpacity={0.75}
          >
            <Text style={styles.btnText}>Album</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnAccent]}
            onPress={handleRandom}
            activeOpacity={0.75}
          >
            <Text style={[styles.btnText, styles.btnTextAccent]}>Random ▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  albumName: {
    color: '#666666',
    fontSize: 13,
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  btnAccent: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  btnText: {
    color: '#CCCCCC',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  btnTextAccent: {
    color: '#0A0A0A',
  },
});
