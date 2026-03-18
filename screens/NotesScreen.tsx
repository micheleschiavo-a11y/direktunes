import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT = '#C8A951';
const BG = '#0A0A0A';
const BANNER_HEIGHT = 110;

const NOTES_TEXT = `Musica Qualunque è il primo Direktunes album dell'artista Miskia.

Il titolo dell'album vuole sottolineare come le barriere tra generi musicali diversi siano spesso un ostacolo sia per i musicisti che per gli ascoltatori.

In realtà, quando la musica è bella di solito piace a tutti, ed il genere musicale di appartenenza, ammesso che si possa definire, diventa irrilevante.

Ma questo non è quello che vogliono le majors musicali, impegnate a vendere prodotti commerciali e quindi sempre intente a segmentare il mercato e classificare i consumatori di musica in modo da affinare le loro campagne di marketing e massimizzare il profitto.

Quindi musica qualunque non vuol dire musica a caso, ma musica che piace a chi l'ha pensata e spero, anche a chi la ascolterà.

Queste canzoni sono il risultato di anni di ascolto di musica pop spagnola e più in generale della musica latina. La scelta di cantare alcuni pezzi in dialetto è per cercare un comunicare più diretto visto che il veneto è la lingua che conosco meglio.

Miskia lo conoscete, non serve che vi dica altro.`;

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 30, paddingBottom: BANNER_HEIGHT + insets.bottom + 30 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Note</Text>
      <View style={styles.accentBar} />
      <Text style={styles.albumLabel}>Musica qualunque</Text>
      <Text style={styles.artistLabel}>Miskia · 2026</Text>
      <Text style={styles.body}>{NOTES_TEXT}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: 28,
    alignItems: 'flex-start',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  accentBar: {
    width: 40,
    height: 3,
    backgroundColor: ACCENT,
    borderRadius: 2,
    marginBottom: 16,
  },
  albumLabel: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  artistLabel: {
    color: '#555555',
    fontSize: 13,
    marginBottom: 28,
  },
  body: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
  },
});
