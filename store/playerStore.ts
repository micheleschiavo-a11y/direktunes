import { create } from 'zustand';
import { Audio, AVPlaybackStatus } from 'expo-av';
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
  sound: Audio.Sound | null;
  shuffleOrder: number[];

  // Actions
  initAudio: () => Promise<void>;
  loadAndPlayTrack: (index: number) => Promise<void>;
  togglePlay: () => Promise<void>;
  skipNext: () => Promise<void>;
  skipPrev: () => Promise<void>;
  toggleShuffle: () => void;
  seek: (seconds: number) => Promise<void>;
  _onPlaybackStatus: (status: AVPlaybackStatus) => void;
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
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
  },

  _onPlaybackStatus: (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    const pos = (status.positionMillis ?? 0) / 1000;
    const dur = (status.durationMillis ?? 0) / 1000;
    set({ position: pos, duration: dur, isPlaying: status.isPlaying });

    if (status.didJustFinish) {
      set({ isPlaying: false });
      get().skipNext();
    }
  },

  loadAndPlayTrack: async (index: number) => {
    const { sound: prevSound, _onPlaybackStatus } = get();
    if (prevSound) {
      await prevSound.stopAsync();
      await prevSound.unloadAsync();
    }

    const track = TRACKS[index];
    const { sound } = await Audio.Sound.createAsync(
      track.file,
      { shouldPlay: true, progressUpdateIntervalMillis: 500 },
      _onPlaybackStatus
    );

    set({
      sound,
      currentTrackIndex: index,
      isPlaying: true,
      position: 0,
    });
  },

  togglePlay: async () => {
    const { sound, isPlaying, currentTrackIndex } = get();
    if (!sound) {
      await get().loadAndPlayTrack(currentTrackIndex);
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    } else {
      await sound.playAsync();
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
      // restart current track
      const { sound } = get();
      if (sound) {
        await sound.setPositionAsync(0);
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

  seek: async (seconds: number) => {
    const { sound } = get();
    if (sound) {
      await sound.setPositionAsync(seconds * 1000);
      set({ position: seconds });
    }
  },
}));
