import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Game, Sport, GameStatus } from '@/types/game';

const SPORTS: Sport[] = ['MLB', 'NBA', 'NFL', 'NHL', 'Soccer', 'Tennis'];

const STATUS_OPTIONS: { value: GameStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'live', label: 'Live' },
  { value: 'final', label: 'Final' },
  { value: 'postponed', label: 'Postponed' },
];

interface GameModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (game: Game) => void;
  editGame?: Game | null;
}

const initialFormData = {
  sport: 'MLB' as Sport,
  league: '',
  gameDate: '',
  gameTime: '',
  status: 'scheduled' as GameStatus,
  awayTeamName: '',
  awayTeamLogo: '',
  awayRot: '',
  homeTeamName: '',
  homeTeamLogo: '',
  homeRot: '',
  mlAway: '',
  mlHome: '',
  total: '',
  ouOver: '',
  ouUnder: '',
  rlAway: '',
  rlHome: '',
  ynYes: '',
  ynNo: '',
  srlAway: '',
  srlHome: '',
  soloAway: '',
  soloHome: '',
};

export default function GameModal({ open, onClose, onSave, editGame }: GameModalProps) {
  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const populateEdit = useCallback(() => {
    if (editGame) {
      const dt = new Date(editGame.gameTime);
      const dateStr = dt.toISOString().split('T')[0];
      const timeStr = dt.toTimeString().slice(0, 5);
      setForm({
        sport: editGame.sport,
        league: editGame.league || '',
        gameDate: dateStr,
        gameTime: timeStr,
        status: editGame.status,
        awayTeamName: editGame.awayTeam.name,
        awayTeamLogo: editGame.awayTeam.logo || '',
        awayRot: String(editGame.awayTeam.rotationNumber),
        homeTeamName: editGame.homeTeam.name,
        homeTeamLogo: editGame.homeTeam.logo || '',
        homeRot: String(editGame.homeTeam.rotationNumber),
        mlAway: String(editGame.odds.moneyLine.away),
        mlHome: String(editGame.odds.moneyLine.home),
        total: String(editGame.odds.total),
        ouOver: String(editGame.odds.overUnder.over),
        ouUnder: String(editGame.odds.overUnder.under),
        rlAway: editGame.odds.runLine.away,
        rlHome: editGame.odds.runLine.home,
        ynYes: String(editGame.odds.yesNo.yes),
        ynNo: String(editGame.odds.yesNo.no),
        srlAway: String(editGame.odds.srl.away),
        srlHome: String(editGame.odds.srl.home),
        soloAway: String(editGame.odds.solo.away),
        soloHome: String(editGame.odds.solo.home),
      });
    } else {
      setForm(initialFormData);
    }
    setErrors({});
  }, [editGame]);

  useEffect(() => {
    if (open) {
      populateEdit();
    }
  }, [open, populateEdit]);

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.sport) e.sport = 'Required';
    if (!form.gameDate) e.gameDate = 'Required';
    if (!form.gameTime) e.gameTime = 'Required';
    if (!form.awayTeamName.trim()) e.awayTeamName = 'Required';
    if (!form.awayRot.trim()) e.awayRot = 'Required';
    if (!form.homeTeamName.trim()) e.homeTeamName = 'Required';
    if (!form.homeRot.trim()) e.homeRot = 'Required';
    if (!form.status) e.status = 'Required';
    if (isNaN(Number(form.awayRot))) e.awayRot = 'Must be a number';
    if (isNaN(Number(form.homeRot))) e.homeRot = 'Must be a number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const gameTime = new Date(`${form.gameDate}T${form.gameTime}`).toISOString();
    const game: Game = {
      id: editGame?.id || crypto.randomUUID(),
      sport: form.sport,
      league: form.league || undefined,
      gameTime,
      status: form.status,
      awayTeam: {
        name: form.awayTeamName.trim(),
        logo: form.awayTeamLogo.trim() || undefined,
        rotationNumber: Number(form.awayRot),
      },
      homeTeam: {
        name: form.homeTeamName.trim(),
        logo: form.homeTeamLogo.trim() || undefined,
        rotationNumber: Number(form.homeRot),
      },
      odds: {
        moneyLine: {
          away: form.mlAway === '' ? 0 : Number(form.mlAway),
          home: form.mlHome === '' ? 0 : Number(form.mlHome),
        },
        total: form.total === '' ? 0 : Number(form.total),
        overUnder: {
          over: form.ouOver === '' ? -110 : Number(form.ouOver),
          under: form.ouUnder === '' ? -110 : Number(form.ouUnder),
        },
        runLine: {
          away: form.rlAway || '+1.5 -130',
          home: form.rlHome || '-1.5 +110',
        },
        yesNo: {
          yes: form.ynYes === '' ? 0 : Number(form.ynYes),
          no: form.ynNo === '' ? 0 : Number(form.ynNo),
        },
        srl: {
          away: form.srlAway || '+0.5 -150',
          home: form.srlHome || '-0.5 +130',
        },
        solo: {
          away: form.soloAway || '3.5',
          home: form.soloHome || '3.5',
        },
      },
    };
    onSave(game);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  const sectionHeader = (label: string) => (
    <div className="col-span-2 mt-2 mb-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500" style={{ letterSpacing: '0.05em' }}>
        {label}
      </h3>
      <div className="h-px bg-gray-200 mt-2" />
    </div>
  );

  const inputField = (
    field: string,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
    colSpan = 1,
  ) => (
    <div className={colSpan === 2 ? 'col-span-2' : 'col-span-1'}>
      <Label className="text-xs text-gray-600 mb-1.5 block">{label}</Label>
      <Input
        value={form[field as keyof typeof form]}
        onChange={e => update(field, e.target.value)}
        onKeyDown={handleKeyDown}
        className={`h-10 ${errors[field] ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
        {...props}
      />
      {errors[field] && (
        <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="relative z-50 bg-white rounded-xl shadow-2xl w-full max-w-[700px] max-h-[85vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {editGame ? (
                  <Pencil size={20} className="text-[#1A56DB]" />
                ) : (
                  <PlusCircle size={20} className="text-[#1A56DB]" />
                )}
                <h2 className="text-lg font-semibold">
                  {editGame ? 'Edit Game' : 'Add New Game'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                {sectionHeader('Game Info')}

                {/* Sport */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Sport *</Label>
                  <Select value={form.sport} onValueChange={v => update('sport', v)}>
                    <SelectTrigger className={`h-10 w-full ${errors.sport ? 'border-red-500' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORTS.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sport && <p className="text-xs text-red-500 mt-1">{errors.sport}</p>}
                </div>

                {/* League */}
                {inputField('league', 'League', { placeholder: 'e.g. AL East' })}

                {/* Game Date */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Game Date *</Label>
                  <Input
                    type="date"
                    value={form.gameDate}
                    onChange={e => update('gameDate', e.target.value)}
                    className={`h-10 ${errors.gameDate ? 'border-red-500' : ''}`}
                  />
                  {errors.gameDate && <p className="text-xs text-red-500 mt-1">{errors.gameDate}</p>}
                </div>

                {/* Game Time */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Game Time *</Label>
                  <Input
                    type="time"
                    value={form.gameTime}
                    onChange={e => update('gameTime', e.target.value)}
                    className={`h-10 ${errors.gameTime ? 'border-red-500' : ''}`}
                  />
                  {errors.gameTime && <p className="text-xs text-red-500 mt-1">{errors.gameTime}</p>}
                </div>

                {/* Status */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Status *</Label>
                  <Select value={form.status} onValueChange={v => update('status', v as GameStatus)}>
                    <SelectTrigger className={`h-10 w-full ${errors.status ? 'border-red-500' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
                </div>

                {sectionHeader('Teams')}

                {/* Away Team */}
                {inputField('awayTeamName', 'Away Team Name *', { placeholder: 'e.g. New York Yankees' })}
                {inputField('awayTeamLogo', 'Away Team Logo URL', { placeholder: 'https://...' })}
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Away Rotation # *</Label>
                  <Input
                    type="number"
                    value={form.awayRot}
                    onChange={e => update('awayRot', e.target.value)}
                    className={`h-10 ${errors.awayRot ? 'border-red-500' : ''}`}
                    placeholder="101"
                  />
                  {errors.awayRot && <p className="text-xs text-red-500 mt-1">{errors.awayRot}</p>}
                </div>

                {/* Home Team */}
                {inputField('homeTeamName', 'Home Team Name *', { placeholder: 'e.g. Boston Red Sox' })}
                {inputField('homeTeamLogo', 'Home Team Logo URL', { placeholder: 'https://...' })}
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Home Rotation # *</Label>
                  <Input
                    type="number"
                    value={form.homeRot}
                    onChange={e => update('homeRot', e.target.value)}
                    className={`h-10 ${errors.homeRot ? 'border-red-500' : ''}`}
                    placeholder="102"
                  />
                  {errors.homeRot && <p className="text-xs text-red-500 mt-1">{errors.homeRot}</p>}
                </div>

                {sectionHeader('Odds')}

                {/* Odds grid - 3 columns */}
                <div className="col-span-2">
                  <div className="grid grid-cols-3 gap-3">
                    {/* M.L. Away */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">M.L. Away</Label>
                      <Input
                        type="number"
                        value={form.mlAway}
                        onChange={e => update('mlAway', e.target.value)}
                        className="h-10"
                        placeholder="-180"
                      />
                    </div>
                    {/* M.L. Home */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">M.L. Home</Label>
                      <Input
                        type="number"
                        value={form.mlHome}
                        onChange={e => update('mlHome', e.target.value)}
                        className="h-10"
                        placeholder="+155"
                      />
                    </div>
                    {/* Total */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">Total</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={form.total}
                        onChange={e => update('total', e.target.value)}
                        className="h-10"
                        placeholder="8.5"
                      />
                    </div>
                    {/* O/U Over */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">O/U Over</Label>
                      <Input
                        type="number"
                        value={form.ouOver}
                        onChange={e => update('ouOver', e.target.value)}
                        className="h-10"
                        placeholder="-110"
                      />
                    </div>
                    {/* O/U Under */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">O/U Under</Label>
                      <Input
                        type="number"
                        value={form.ouUnder}
                        onChange={e => update('ouUnder', e.target.value)}
                        className="h-10"
                        placeholder="-110"
                      />
                    </div>
                    {/* RL Away */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">RL Away</Label>
                      <Input
                        value={form.rlAway}
                        onChange={e => update('rlAway', e.target.value)}
                        className="h-10"
                        placeholder="+1.5 -130"
                      />
                    </div>
                    {/* RL Home */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">RL Home</Label>
                      <Input
                        value={form.rlHome}
                        onChange={e => update('rlHome', e.target.value)}
                        className="h-10"
                        placeholder="-1.5 +110"
                      />
                    </div>
                    {/* Y-N Yes */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">Y-N Yes</Label>
                      <Input
                        type="number"
                        value={form.ynYes}
                        onChange={e => update('ynYes', e.target.value)}
                        className="h-10"
                        placeholder="-140"
                      />
                    </div>
                    {/* Y-N No */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">Y-N No</Label>
                      <Input
                        type="number"
                        value={form.ynNo}
                        onChange={e => update('ynNo', e.target.value)}
                        className="h-10"
                        placeholder="+120"
                      />
                    </div>
                    {/* SRL Away */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">SRL Away</Label>
                      <Input
                        value={form.srlAway}
                        onChange={e => update('srlAway', e.target.value)}
                        className="h-10"
                        placeholder="+0.5 -150"
                      />
                    </div>
                    {/* SRL Home */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">SRL Home</Label>
                      <Input
                        value={form.srlHome}
                        onChange={e => update('srlHome', e.target.value)}
                        className="h-10"
                        placeholder="-0.5 +130"
                      />
                    </div>
                    {/* Solo Away */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">Solo Away</Label>
                      <Input
                        value={form.soloAway}
                        onChange={e => update('soloAway', e.target.value)}
                        className="h-10"
                        placeholder="3.5"
                      />
                    </div>
                    {/* Solo Home */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">Solo Home</Label>
                      <Input
                        value={form.soloHome}
                        onChange={e => update('soloHome', e.target.value)}
                        className="h-10"
                        placeholder="3.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-gray-200 mt-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                style={{ backgroundColor: '#1A56DB' }}
                className="text-white hover:opacity-90"
              >
                {editGame ? 'Update Game' : 'Save Game'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
