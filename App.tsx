import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { usePlayerStore } from './store/playerStore';
import HomeScreen from './screens/HomeScreen';
import LyricsScreen from './screens/LyricsScreen';
import NotesScreen from './screens/NotesScreen';
import CreditsScreen from './screens/CreditsScreen';
import BottomBanners from './components/BottomBanners';

export default function App() {
  const { activeScreen, initAudio } = usePlayerStore();

  useEffect(() => {
    initAudio();
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
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
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <View style={styles.container}>
        {renderScreen()}
        <BottomBanners />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});
