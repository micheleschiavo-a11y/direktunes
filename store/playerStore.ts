import { create } from 'zustand';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { TRACKS } from '../data/tracks';

export type Screen = 'home' | 'lyrics' | 'notes' | 'credits';

interface PlayerStore {
  // Navigation
  activeScreen: Screen;
  navigate: (screen: Screen) => void;

  // Player state
  currentTrackIndex: number;
  isPlaying: boolean;
  isShuffled: boolean;
  position: number;  // seconds
  duration: number;  // seconds
  sound: AudioPlayer | null;
  shuffleOrder: number[];

  // Actions
  initAudio: () => Promise<void>;
  loadAndPlayTrack: (index: number) => Promise<void>;
  togglePlay: () => Promise<void>;
  skipNext: () => Promise<void>;
  skipPrev: () => Promise<void>;
  toggleShuffle: () => void;
  seek: (seconds: number) => void;
  _getNextIndex: () => number;
  _getPrevIndex: () => number;
}

function generateShuffleOrder(length: number, current: number): number[] {
  const arr = Array.from({ length }, (_, i) => i).filter(i => i !== current);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return [current, ...arr];
}

// Track the current status subscription outside the store
let currentSubscription: { remove: () => void } | null = null;

function clearSubscription() {
  if (currentSubscription) {
    currentSubscription.remove();
    currentSubscription = null;
  }
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  activeScreen: 'home',
  navigate: (screen) => set({ activeScreen: screen }),

  currentTrackIndex: 0,
  isPlaying: false,
  isShuffled: false,
  position: 0,
  duration: 0,
  sound: null,
  shuffleOrder: Array.from({ length: TRACKS.length }, (_, i) => i),

  initAudio: async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  },

  loadAndPlayTrack: async (index: number) => {
    const { sound: prevSound } = get();
    clearSubscription();
    if (prevSound) {
      prevSound.pause();
      prevSound.remove();
    }

    const track = TRACKS[index];
    const player = createAudioPlayer(track.file, 100);

    set({
      sound: player,
      currentTrackIndex: index,
      isPlaying: true,
      position: 0,
    });

    let playStarted = false;

    currentSubscription = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      // Start playback once the audio is loaded
      if (status.isLoaded && !playStarted) {
        playStarted = true;
        player.play();
      }

      // Keep UI in sync
      usePlayerStore.setState({
        position: status.currentTime,
        duration: status.duration,
        isPlaying: status.playing,
      });

      // Auto-advance to next track
      if (status.didJustFinish) {
        clearSubscription();
        usePlayerStore.setState({ isPlaying: false });
        usePlayerStore.getState().skipNext();
      }
    });
  },

  togglePlay: async () => {
    const { sound, isPlaying, currentTrackIndex } = get();
    if (!sound) {
      await get().loadAndPlayTrack(currentTrackIndex);
      return;
    }
    if (isPlaying) {
      sound.pause();
      set({ isPlaying: false });
    } else {
      sound.play();
      set({ isPlaying: true });
    }
  },

  _getNextIndex: () => {
    const { currentTrackIndex, isShuffled, shuffleOrder } = get();
    if (!isShuffled) {
      return (currentTrackIndex + 1) % TRACKS.length;
    }
    const pos = shuffleOrder.indexOf(currentTrackIndex);
    return shuffleOrder[(pos + 1) % shuffleOrder.length];
  },

  _getPrevIndex: () => {
    const { currentTrackIndex, isShuffled, shuffleOrder } = get();
    if (!isShuffled) {
      return (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    }
    const pos = shuffleOrder.indexOf(currentTrackIndex);
    return shuffleOrder[(pos - 1 + shuffleOrder.length) % shuffleOrder.length];
  },

  skipNext: async () => {
    const nextIndex = get()._getNextIndex();
    await get().loadAndPlayTrack(nextIndex);
  },

  skipPrev: async () => {
    const { position } = get();
    if (position > 3) {
      const { sound } = get();
      if (sound) {
        sound.seekTo(0);
        set({ position: 0 });
      }
    } else {
      const prevIndex = get()._getPrevIndex();
      await get().loadAndPlayTrack(prevIndex);
    }
  },

  toggleShuffle: () => {
    const { isShuffled, currentTrackIndex } = get();
    if (!isShuffled) {
      const order = generateShuffleOrder(TRACKS.length, currentTrackIndex);
      set({ isShuffled: true, shuffleOrder: order });
    } else {
      set({ isShuffled: false });
    }
  },

  seek: (seconds: number) => {
    const { sound } = get();
    if (sound) {
      sound.seekTo(seconds);
      set({ position: seconds });
    }
  },
}));
