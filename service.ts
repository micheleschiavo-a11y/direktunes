import TrackPlayer, { Event } from 'react-native-track-player';

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    // Lazy require avoids circular imports (service loads before the store module)
    require('./store/playerStore').usePlayerStore.getState().skipNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    require('./store/playerStore').usePlayerStore.getState().skipPrev();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (event: { position: number }) => {
    TrackPlayer.seekTo(event.position);
  });
}
