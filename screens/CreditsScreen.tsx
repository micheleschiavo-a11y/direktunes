import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT = '#C8A951';
const BG = '#0A0A0A';
const BANNER_HEIGHT = 110;

const CREDITS_TEXT = `"Todo lo que no es tradición es plagio" è un aforisma attribuito allo scrittore spagnolo Eugenio d'Ors.

Per ogni canzone, per ogni riff, per ogni singola nota musicale la lista dei credits dovrebbe essere lunghissima. Le note sono solo dodici, è inevitabile che ogni armonia, ogni melodia sia in qualche modo simile a qualcosa che è già stato suonato ed ascoltato.

Queste canzoni sono inevitabilmente ben piantate nella tradizione musicale della musica pop italiana e spagnola, e più in generale della musica latino-americana.

Se talvolta la tradizione diventa plagio, me ne scuso con tutti i musicisti da cui ho rubato delle idee. Ma si sa (e qui cito un altro aforisma): imitation is the highest form of flattery.`;

export default function CreditsScreen() {
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
      <Text style={styles.heading}>Credits</Text>
      <View style={styles.accentBar} />
      <Text style={styles.albumLabel}>Musica qualunque</Text>
      <Text style={styles.artistLabel}>Miskia · 2026</Text>
      <Text style={styles.body}>{CREDITS_TEXT}</Text>

      {/* Ownership Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>🎵</Text>
        <Text style={styles.badgeTitle}>Album di tua proprietà</Text>
        <Text style={styles.badgeSubtitle}>
          Acquistato una volta per sempre.{'\n'}Nessuno streaming, nessun abbonamento.
        </Text>
        <View style={styles.badgeSeal}>
          <Text style={styles.badgeSealText}>Direktunes · Owned Outright</Text>
        </View>
      </View>
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
    marginBottom: 40,
  },
  badge: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ACCENT,
    padding: 24,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  badgeTitle: {
    color: ACCENT,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  badgeSubtitle: {
    color: '#888888',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  badgeSeal: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  badgeSealText: {
    color: '#555555',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
