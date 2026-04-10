import { create } from 'zustand';
import TrackPlayer, { Capability } from 'react-native-track-player';
import type { Track as RNTPTrack } from 'react-native-track-player';
import { TRACKS, ALBUM } from '../data/tracks';

export type Screen = 'home' | 'lyrics' | 'notes' | 'credits';

interface PlayerStore {
  // Navigation
  activeScreen: Screen;
  navigate: (screen: Screen) => void;

  // Player state
  currentTrackIndex: number;
  isPlaying: boolean;
  isShuffled: boolean;
  position: number;   // seconds
  duration: number;   // seconds
  isReady: boolean;   // true after first loadAndPlayTrack
  shuffleOrder: number[];
  playerSetupError: string | null;

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

function buildRntpTracks(indices: number[]): RNTPTrack[] {
  return indices.map(i => ({
    id: String(TRACKS[i].id),
    url: TRACKS[i].file,
    title: TRACKS[i].title,
    artist: TRACKS[i].artist,
    album: ALBUM.title,
    artwork: ALBUM.artwork,
    duration: TRACKS[i].duration,
  }));
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  activeScreen: 'home',
  navigate: (screen) => set({ activeScreen: screen }),

  currentTrackIndex: 0,
  isPlaying: false,
  isShuffled: false,
  position: 0,
  duration: 0,
  isReady: false,
  shuffleOrder: Array.from({ length: TRACKS.length }, (_, i) => i),
  playerSetupError: null,

  initAudio: async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (e: unknown) {
      // setupPlayer() throws if the player is already initialized (hot reload).
      // That is safe to ignore. Any other error is a real failure — surface it.
      const message = e instanceof Error ? e.message : String(e);
      const isAlreadyInitialized =
        message.includes('already been initialized') ||
        message.includes('already initialized');
      if (!isAlreadyInitialized) {
        console.error('[initAudio] TrackPlayer.setupPlayer() failed:', e);
        set({ playerSetupError: message });
        return; // do NOT call updateOptions on a broken player
      }
    }
    try {
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
      });
      // Pre-load queue so the OS media session is ready
      const queue = await TrackPlayer.getQueue();
      if (queue.length === 0) {
        await TrackPlayer.add(
          buildRntpTracks(Array.from({ length: TRACKS.length }, (_, i) => i))
        );
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('[initAudio] post-setup configuration failed:', e);
      set({ playerSetupError: message });
    }
  },

  loadAndPlayTrack: async (index: number) => {
    const { isShuffled } = get();
    let orderedIndices: number[];

    if (isShuffled) {
      const newOrder = generateShuffleOrder(TRACKS.length, index);
      set({ shuffleOrder: newOrder });
      orderedIndices = newOrder;
    } else {
      // Linear order starting at index, wrapping around
      orderedIndices = Array.from(
        { length: TRACKS.length },
        (_, i) => (index + i) % TRACKS.length
      );
    }

    await TrackPlayer.reset();
    await TrackPlayer.add(buildRntpTracks(orderedIndices));
    await TrackPlayer.play();

    set({ currentTrackIndex: index, isPlaying: true, isReady: true, position: 0 });
  },

  togglePlay: async () => {
    const { isReady, isPlaying, currentTrackIndex } = get();
    if (!isReady) {
      await get().loadAndPlayTrack(currentTrackIndex);
      return;
    }
    if (isPlaying) {
      await TrackPlayer.pause();
      set({ isPlaying: false });
    } else {
      await TrackPlayer.play();
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
      await TrackPlayer.seekTo(0);
      set({ position: 0 });
    } else {
      const prevIndex = get()._getPrevIndex();
      await get().loadAndPlayTrack(prevIndex);
    }
  },

  toggleShuffle: () => {
    const { isShuffled, currentTrackIndex, isReady } = get();
    if (!isShuffled) {
      const order = generateShuffleOrder(TRACKS.length, currentTrackIndex);
      set({ isShuffled: true, shuffleOrder: order });
      if (isReady) {
        TrackPlayer.reset()
          .then(() => TrackPlayer.add(buildRntpTracks(order)))
          .then(() => TrackPlayer.play());
      }
    } else {
      set({ isShuffled: false });
      if (isReady) {
        const linearOrder = Array.from(
          { length: TRACKS.length },
          (_, i) => (currentTrackIndex + i) % TRACKS.length
        );
        TrackPlayer.reset()
          .then(() => TrackPlayer.add(buildRntpTracks(linearOrder)))
          .then(() => TrackPlayer.play());
      }
    }
  },

  seek: (seconds: number) => {
    TrackPlayer.seekTo(seconds);
    set({ position: seconds });
  },
}));
