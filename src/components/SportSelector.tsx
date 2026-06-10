import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Sport } from '@/types/game';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  MlbIcon,
  NbaIcon,
  NflIcon,
  NhlIcon,
  SoccerIcon,
  TennisIcon,
} from '@/components/icons/SportIcons';

const FAVORITE_SPORTS_KEY = 'nmv-favorite-sports';

const ALL_SPORTS: { key: Sport; label: string; Icon: React.FC<{ className?: string; size?: number }> }[] = [
  { key: 'MLB', label: 'MLB', Icon: MlbIcon },
  { key: 'NBA', label: 'NBA', Icon: NbaIcon },
  { key: 'NFL', label: 'NFL', Icon: NflIcon },
  { key: 'NHL', label: 'NHL', Icon: NhlIcon },
  { key: 'Soccer', label: 'Soccer', Icon: SoccerIcon },
  { key: 'Tennis', label: 'Tennis', Icon: TennisIcon },
];

export function getFavoriteSports(): Sport[] {
  try {
    const stored = localStorage.getItem(FAVORITE_SPORTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as Sport[];
    }
  } catch {
    // ignore
  }
  // Default: all sports
  return ['MLB', 'NBA', 'NFL', 'NHL', 'Soccer', 'Tennis'];
}

export function saveFavoriteSports(sports: Sport[]) {
  localStorage.setItem(FAVORITE_SPORTS_KEY, JSON.stringify(sports));
}

interface SportSelectorProps {
  open: boolean;
  onClose: () => void;
  selected: Sport[];
  onChange: (sports: Sport[]) => void;
}

export default function SportSelector({ open, onClose, selected, onChange }: SportSelectorProps) {
  const { t } = useLanguage();
  const [local, setLocal] = useState<Sport[]>(selected);

  useEffect(() => {
    setLocal(selected);
  }, [selected, open]);

  if (!open) return null;

  const toggleSport = (sport: Sport) => {
    if (local.includes(sport)) {
      setLocal(local.filter((s) => s !== sport));
    } else {
      setLocal([...local, sport]);
    }
  };

  const handleSave = () => {
    onChange(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{t.selectSports}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sport Chips */}
        <div className="px-5 py-5">
          <p className="text-sm text-gray-500 mb-4">{t.mySports}:</p>
          <div className="flex flex-wrap gap-2.5">
            {ALL_SPORTS.map((sport) => {
              const isSelected = local.includes(sport.key);
              return (
                <button
                  key={sport.key}
                  onClick={() => toggleSport(sport.key)}
                  className={
                    `inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border ` +
                    (isSelected
                      ? 'bg-[#0C1B2E] text-white border-[#0C1B2E] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50')
                  }
                >
                  <sport.Icon size={16} />
                  <span>{sport.label}</span>
                  {isSelected && <Check size={14} className="ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-[#0C1B2E] hover:bg-[#1A56DB] text-white">
            {t.save}
          </Button>
        </div>
      </div>
    </div>
  );
}
