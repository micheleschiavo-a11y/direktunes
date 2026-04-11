import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from './service';
import App from './App';

// MUST be called before registerRootComponent
TrackPlayer.registerPlaybackService(() => PlaybackService);

registerRootComponent(App);
