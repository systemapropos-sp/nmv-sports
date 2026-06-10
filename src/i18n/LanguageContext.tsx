import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Lang = 'es' | 'en';

interface TranslationSet {
  liveOdds: string;
  scores: string;
  admin: string;
  search: string;
  today: string;
  tomorrow: string;
  week: string;
  all: string;
  mySports: string;
  share: string;
  qrCode: string;
  shortLink: string;
  generate: string;
  refresh: string;
  lastUpdated: string;
  live: string;
  scheduled: string;
  final: string;
  postponed: string;
  code: string;
  game: string;
  time: string;
  team: string;
  total: string;
  overUnder: string;
  showBestOdds: string;
  hideFinished: string;
  showLiveOnly: string;
  noGamesFound: string;
  installApp: string;
  addToHome: string;
  install: string;
  loginTitle: string;
  loginSubtitle: string;
  username: string;
  password: string;
  signIn: string;
  signingIn: string;
  credentialsHint: string;
  logout: string;
  dashboard: string;
  totalGames: string;
  liveGames: string;
  todaysGames: string;
  addGame: string;
  editGame: string;
  deleteGame: string;
  saveGame: string;
  cancel: string;
  delete: string;
  confirmDelete: string;
  sport: string;
  status: string;
  actions: string;
  searchTeams: string;
  selectSports: string;
  save: string;
  autoSync: string;
  autoSyncOn: string;
  autoSyncOff: string;
  selectLeague: string;
  viewScores: string;
  backToSite: string;
  odds: string;
  rot: string;
  ml: string;
  ou: string;
  rl: string;
  yn: string;
  srl: string;
  solo: string;
}

const translations: Record<Lang, TranslationSet> = {
  es: {
    liveOdds: 'L\u00edneas en Vivo',
    scores: 'Puntuaciones',
    admin: 'Admin',
    search: 'Buscar equipos...',
    today: 'Hoy',
    tomorrow: 'Ma\u00f1ana',
    week: 'Semana',
    all: 'Todos',
    mySports: 'Mis Deportes',
    share: 'Compartir NMV SPORTS',
    qrCode: 'C\u00f3digo QR',
    shortLink: 'Link Corto',
    generate: 'Generar',
    refresh: 'Actualizar',
    lastUpdated: '\u00daltima actualizaci\u00f3n',
    live: 'EN VIVO',
    scheduled: 'Programado',
    final: 'Final',
    postponed: 'Postergado',
    code: 'C\u00d3DIGO',
    game: 'JUEGO',
    time: 'HORA',
    team: 'EQUIPO',
    total: 'TOTAL',
    overUnder: 'O/U',
    showBestOdds: 'Mostrar mejores l\u00edneas',
    hideFinished: 'Ocultar finalizados',
    showLiveOnly: 'Solo en vivo',
    noGamesFound: 'No se encontraron juegos',
    installApp: 'Instalar NMV SPORTS',
    addToHome: 'Agrega a tu pantalla de inicio',
    install: 'Instalar',
    loginTitle: 'Acceso Admin',
    loginSubtitle: 'Ingresa tus credenciales',
    username: 'Usuario',
    password: 'Contrase\u00f1a',
    signIn: 'Iniciar Sesi\u00f3n',
    signingIn: 'Ingresando...',
    credentialsHint: 'Credenciales demo:',
    logout: 'Cerrar Sesi\u00f3n',
    dashboard: 'Panel de Control',
    totalGames: 'Total Juegos',
    liveGames: 'Juegos en Vivo',
    todaysGames: 'Juegos de Hoy',
    addGame: 'Agregar Juego',
    editGame: 'Editar Juego',
    deleteGame: 'Eliminar Juego',
    saveGame: 'Guardar Juego',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    confirmDelete: '\u00bfEst\u00e1s seguro de eliminar este juego?',
    sport: 'Deporte',
    status: 'Estado',
    actions: 'Acciones',
    searchTeams: 'Buscar equipos...',
    selectSports: 'Seleccionar Deportes',
    save: 'Guardar',
    autoSync: 'Sincronizaci\u00f3n Auto',
    autoSyncOn: 'Auto-sync: ON',
    autoSyncOff: 'Auto-sync: OFF',
    selectLeague: 'Seleccionar Liga',
    viewScores: 'Ver Puntuaciones',
    backToSite: 'Volver al sitio',
    odds: 'L\u00cdNEAS',
    rot: 'ROT#',
    ml: 'M.L.',
    ou: 'O/U',
    rl: 'RL',
    yn: 'Y-N',
    srl: 'SRL',
    solo: 'SOLO',
  },
  en: {
    liveOdds: 'Live Odds',
    scores: 'Scores',
    admin: 'Admin',
    search: 'Search teams...',
    today: 'Today',
    tomorrow: 'Tomorrow',
    week: 'Week',
    all: 'All',
    mySports: 'My Sports',
    share: 'Share NMV SPORTS',
    qrCode: 'QR Code',
    shortLink: 'Short Link',
    generate: 'Generate',
    refresh: 'Refresh',
    lastUpdated: 'Last updated',
    live: 'LIVE',
    scheduled: 'Scheduled',
    final: 'Final',
    postponed: 'Postponed',
    code: 'CODE',
    game: 'GAME',
    time: 'TIME',
    team: 'TEAM',
    total: 'TOTAL',
    overUnder: 'O/U',
    showBestOdds: 'Show best odds only',
    hideFinished: 'Hide finished games',
    showLiveOnly: 'Show live only',
    noGamesFound: 'No games found',
    installApp: 'Install NMV SPORTS',
    addToHome: 'Add to your home screen',
    install: 'Install',
    loginTitle: 'Admin Access',
    loginSubtitle: 'Enter your credentials',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    credentialsHint: 'Demo credentials:',
    logout: 'Sign Out',
    dashboard: 'Dashboard',
    totalGames: 'Total Games',
    liveGames: 'Live Games',
    todaysGames: "Today's Games",
    addGame: 'Add Game',
    editGame: 'Edit Game',
    deleteGame: 'Delete Game',
    saveGame: 'Save Game',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this game?',
    sport: 'Sport',
    status: 'Status',
    actions: 'Actions',
    searchTeams: 'Search teams...',
    selectSports: 'Select Sports',
    save: 'Save',
    autoSync: 'Auto Sync',
    autoSyncOn: 'Auto-sync: ON',
    autoSyncOff: 'Auto-sync: OFF',
    selectLeague: 'Select League',
    viewScores: 'View Scores',
    backToSite: 'Back to Site',
    odds: 'ODDS',
    rot: 'ROT#',
    ml: 'M.L.',
    ou: 'O/U',
    rl: 'RL',
    yn: 'Y-N',
    srl: 'SRL',
    solo: 'SOLO',
  },
};

export type Translations = TranslationSet;

interface LanguageContextValue {
  lang: Lang;
  t: TranslationSet;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  t: translations.es,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('nmv-lang');
    return (stored as Lang) || 'es';
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'es' ? 'en' : 'es';
      localStorage.setItem('nmv-lang', next);
      return next;
    });
  }, []);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
