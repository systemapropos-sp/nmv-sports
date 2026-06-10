import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Sport key to scores URL mapping
const SCORES_URLS: Record<string, string> = {
  MLB: 'https://www.mlb.com/scores',
  NBA: 'https://www.nba.com/games',
  NFL: '', // Will add later
  NHL: '', // Will add later
  Soccer: '', // Will add later
  Tennis: '', // Will add later
};

const SPORTS_LIST = ['MLB', 'NBA', 'NFL', 'NHL', 'Soccer', 'Tennis'] as const;

export default function Scores() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // If a sport with a URL is selected, show iframe
  if (selectedSport && SCORES_URLS[selectedSport]) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-gray-50">
        {/* Header */}
        <header className="h-14 flex items-center px-4" style={{ background: 'linear-gradient(180deg, #0C1B2E 0%, #0F2340 100%)' }}>
          <button onClick={() => setSelectedSport(null)} className="flex items-center gap-2 text-white hover:text-blue transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">{t.scores}</span>
          </button>
          <span className="ml-4 text-white font-semibold text-sm">{selectedSport}</span>
        </header>
        {/* Iframe */}
        <div className="flex-1">
          <iframe
            src={SCORES_URLS[selectedSport]}
            className="w-full h-full min-h-[calc(100dvh-56px)]"
            title={`${selectedSport} Scores`}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    );
  }

  // Show sports list
  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <header className="h-14 flex items-center px-4" style={{ background: 'linear-gradient(180deg, #0C1B2E 0%, #0F2340 100%)' }}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-blue transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">NMV SPORTS</span>
        </button>
        <span className="ml-4 text-white font-semibold text-sm">{t.selectLeague}</span>
      </header>
      <div className="max-w-[1440px] mx-auto w-full p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">{t.viewScores}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SPORTS_LIST.map((sport) => {
            const hasUrl = !!SCORES_URLS[sport];
            return (
              <button
                key={sport}
                onClick={() => hasUrl && setSelectedSport(sport)}
                disabled={!hasUrl}
                className={`p-6 rounded-xl border text-left transition-all ${
                  hasUrl
                    ? 'bg-white border-gray-200 hover:border-blue hover:shadow-md cursor-pointer'
                    : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl font-bold text-gray-800">{sport}</span>
                {!hasUrl && <span className="block text-xs text-gray-400 mt-1">Próximamente / Coming soon</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
