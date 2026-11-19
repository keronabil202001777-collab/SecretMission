import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, Trophy } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  roomCode?: string;
  onReset?: () => void;
  playerAvatar?: { color: string; sticker: string; name: string };
  onOpenScoreboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ roomCode, onReset, playerAvatar, onOpenScoreboard }) => {
  const [soundOn, setSoundOn] = useState(sounds.isEnabled());
  const [menuOpen, setMenuOpen] = useState(false);
  const [drinksOn, setDrinksOn] = useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    sounds.setEnabled(next);
    setSoundOn(next);
    sounds.playPop();
  };

  const toggleDrinks = () => {
    setDrinksOn(!drinksOn);
    sounds.playPop();
  };

  return (
    <header className="relative z-40 w-full max-w-md mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
      {/* Left: Drinks/Pepsi Toggle Pill */}
      <button
        onClick={toggleDrinks}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full brutal-border text-xs font-bold transition-all ${
          drinksOn
            ? 'bg-neonYellow text-black shadow-brutal-sm active:scale-95'
            : 'bg-zinc-800 text-zinc-400'
        }`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${drinksOn ? 'bg-black' : 'bg-zinc-500'}`} />
        <span>{drinksOn ? '🥤 بيبسي وأحكام ON' : '🎮 للضحك فقط'}</span>
      </button>

      {/* Right: Sound, Avatar, and Menu */}
      <div className="flex items-center gap-2">
        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          className="w-9 h-9 rounded-full bg-zinc-900 brutal-border border-zinc-700 flex items-center justify-center text-white active:scale-90 transition-transform"
          title="Sound"
        >
          {soundOn ? <Volume2 size={16} className="text-neonLime" /> : <VolumeX size={16} className="text-zinc-500" />}
        </button>

        {/* Leaderboard Trophy Button */}
        {onOpenScoreboard && (
          <button
            onClick={() => {
              sounds.playPop();
              onOpenScoreboard();
            }}
            className="w-9 h-9 rounded-full bg-zinc-900 brutal-border border-zinc-700 flex items-center justify-center text-neonYellow active:scale-90 transition-transform cursor-pointer shadow-brutal-sm hover:bg-zinc-800"
            title="لوحة المتصدرين والنقاط"
          >
            <Trophy size={16} />
          </button>
        )}

        {/* Player Avatar pill if present */}
        {playerAvatar && (
          <div
            className="w-9 h-9 rounded-full brutal-border flex items-center justify-center text-base candy-gloss shadow-brutal-sm"
            style={{ backgroundColor: playerAvatar.color }}
          >
            {playerAvatar.sticker}
          </div>
        )}

        {/* Menu button */}
        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
            sounds.playPop();
          }}
          className="w-9 h-9 rounded-full bg-zinc-900 brutal-border border-zinc-700 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Dropdown Menu Modal */}
      {menuOpen && (
        <div className="absolute top-14 left-4 right-4 bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 shadow-brutal-lg z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-sm font-bold text-zinc-200">الصوت والمؤثرات</span>
              <button
                onClick={toggleSound}
                className="px-3 py-1 bg-neonLime text-black rounded-full font-black text-xs brutal-border shadow-brutal-sm"
              >
                {soundOn ? 'شغال' : 'مكتوم'}
              </button>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-sm font-bold text-zinc-200">نظام اللعب</span>
              <span className="text-xs font-bold text-neonCyan">☕ قعدة كافيه هادية</span>
            </div>

            {roomCode && (
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-sm font-bold text-zinc-200">كود الروم</span>
                <span className="font-mono font-black text-neonLime tracking-widest">{roomCode}</span>
              </div>
            )}

            {onOpenScoreboard && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  sounds.playPop();
                  onOpenScoreboard();
                }}
                className="w-full py-2 bg-neonYellow text-black rounded-xl font-black text-xs brutal-border shadow-brutal-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trophy size={14} />
                <span>عرض لوحة المتصدرين والتحكيم 🏆</span>
              </button>
            )}

            {onReset && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onReset();
                  sounds.playPop();
                }}
                className="w-full mt-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm brutal-border shadow-brutal-sm"
              >
                الخروج للصفحة الرئيسية 🏠
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
