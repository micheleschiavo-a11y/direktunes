import React, { useEffect, useRef, Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, PanResponder } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackPlayer, { useTrackPlayerEvents, useProgress, Event, State } from 'react-native-track-player';
import * as StoreReview from 'expo-store-review';
import { usePlayerStore, getAdjacentScreen } from './store/playerStore';
import ArtistScreen from './screens/ArtistScreen';
import HomeScreen from './screens/HomeScreen';
import LyricsScreen from './screens/LyricsScreen';
import NotesScreen from './screens/NotesScreen';
import CreditsScreen from './screens/CreditsScreen';
import BottomBanners from './components/BottomBanners';

class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[AppErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>Errore imprevisto</Text>
          <Text style={errorStyles.subtitle}>
            L'app ha incontrato un errore. Premi Riprova per continuare.
          </Text>
          <ScrollView style={errorStyles.detailBox}>
            <Text style={errorStyles.detail}>
              {this.state.error?.toString() ?? 'Errore sconosciuto'}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={errorStyles.button}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={errorStyles.buttonText}>Riprova</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  detailBox: {
    maxHeight: 200,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  detail: {
    color: '#FF6B6B',
    fontSize: 11,
  },
  button: {
    backgroundColor: '#333333',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default function App() {
  const { activeScreen, navigate, initAudio, songsPlayedCount } = usePlayerStore();
  const progress = useProgress(250);
  const ratingShown = useRef(false);

  useEffect(() => {
    initAudio();
  }, []);

  // Sync position and duration from RNTP into the store (used by LyricsScreen)
  useEffect(() => {
    usePlayerStore.setState({
      position: progress.position,
      duration: progress.duration,
    });
  }, [progress.position, progress.duration]);

  // Trigger in-app review after the user has played 3 songs (once per session)
  useEffect(() => {
    if (songsPlayedCount >= 3 && !ratingShown.current) {
      ratingShown.current = true;
      StoreReview.isAvailableAsync().then((available) => {
        if (available) StoreReview.requestReview();
      });
    }
  }, [songsPlayedCount]);

  // Sync play state and handle auto-advance when queue ends
  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackQueueEnded],
    async (event) => {
      if (event.type === Event.PlaybackState) {
        usePlayerStore.setState({ isPlaying: event.state === State.Playing });
      }
      if (event.type === Event.PlaybackQueueEnded) {
        const { isReady, skipNext } = usePlayerStore.getState();
        if (isReady) {
          usePlayerStore.setState({ isPlaying: false });
          await skipNext();
        }
      }
    }
  );

  // Horizontal swipe: finger left → next screen, finger right → previous screen
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dy) > 80) return;
        const { activeScreen: current, navigate: nav } = usePlayerStore.getState();
        if (gs.dx < -50) nav(getAdjacentScreen(current, 'right'));
        else if (gs.dx > 50) nav(getAdjacentScreen(current, 'left'));
      },
    })
  ).current;

  const renderScreen = () => {
    switch (activeScreen) {
      case 'artist':
        return <ArtistScreen />;
      case 'home':
        return <HomeScreen />;
      case 'lyrics':
        return <LyricsScreen />;
      case 'notes':
        return <NotesScreen />;
      case 'credits':
        return <CreditsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View style={styles.container} {...panResponder.panHandlers}>
          {renderScreen()}
          <BottomBanners />
        </View>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});
