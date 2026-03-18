export type TrackId = 1 | 2 | 3 | 4 | 5 | 6;

export interface Track {
  id: TrackId;
  title: string;
  artist: string;
  file: any;
  duration: number; // seconds
  durationFormatted: string;
  isInstrumental?: boolean;
}

export const ALBUM = {
  title: 'Musica qualunque',
  artist: 'Miskia',
  year: '2026',
  artwork: require('../assets/artwork.png'),
  totalTracks: 6,
  totalDuration: '18:23',
};

export const TRACKS: Track[] = [
  {
    id: 1,
    title: 'E la tristezza',
    artist: 'Miskia',
    file: require('../assets/music/01_e_la_tristezza.mp3'),
    duration: 164,
    durationFormatted: '2:44',
  },
  {
    id: 2,
    title: 'No fèmena',
    artist: 'Miskia',
    file: require('../assets/music/02_no_femena.mp3'),
    duration: 151,
    durationFormatted: '2:31',
  },
  {
    id: 3,
    title: 'Parlami di te',
    artist: 'Miskia',
    file: require('../assets/music/03_parlami_di_te.mp3'),
    duration: 127,
    durationFormatted: '2:07',
  },
  {
    id: 4,
    title: 'Parchè ti va',
    artist: 'Miskia',
    file: require('../assets/music/04_parche_ti_va.mp3'),
    duration: 233,
    durationFormatted: '3:53',
  },
  {
    id: 5,
    title: 'Siamo come navi perse in un fosso',
    artist: 'Miskia',
    file: require('../assets/music/05_siamo_come_navi.mp3'),
    duration: 289,
    durationFormatted: '4:49',
  },
  {
    id: 6,
    title: 'Ti ga visto la luna',
    artist: 'Miskia',
    file: require('../assets/music/06_ti_ga_visto_la_luna.mp3'),
    duration: 139,
    durationFormatted: '2:19',
    isInstrumental: true,
  },
];
