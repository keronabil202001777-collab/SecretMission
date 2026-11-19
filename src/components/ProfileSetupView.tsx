import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Sparkles, Check } from 'lucide-react';
import { CANDY_COLORS, STICKER_AVATARS, Player } from '../types';
import { sounds } from '../utils/audio';

interface ProfileSetupViewProps {
  isHost: boolean;
  onBack: () => void;
  onComplete: (profile: { name: string; color: string; sticker: string; isDrinking: boolean }) => void;
}

export const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ isHost, onBack, onComplete }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(CANDY_COLORS[0]);
  const [sticker, setSticker] = useState(STICKER_AVATARS[0]);
  const [tab, setTab] = useState<'color' | 'sticker'>('color');
  const [isDrinking, setIsDrinking] = useState(true);

  const handleShuffle = () => {
    sounds.playPop();
    const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
    const randomSticker = STICKER_AVATARS[Math.floor(Math.random() * STICKER_AVATARS.length)];
    setColor(randomColor);
    setSticker(randomSticker);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    sounds.playVictory();
    onComplete({
      name: name.trim(),
      color,
      sticker,
      isDrinking,
    });
  };

  const isReady = name.trim().length > 0;

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen px-4 pb-28 flex flex-col items-center">
      
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between py-3">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="px-4 py-1.5 rounded-full bg-zinc-900 brutal-border border-zinc-700 text-sm font-bold text-white flex items-center gap-1 active:scale-95 transition-transform"
        >
          <ArrowRight size={16} />
          <span>رجوع</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-right w-full mt-2 mb-4">
        <h1 className="text-3xl font-black text-white font-display">
          {isHost ? 'مين اللي هيدير اللعبة؟' : 'اسمك وشكلك إيه؟'}
        </h1>
      </div>

      {/* THE CLASSIC "HELLO MY NAME IS" NAME TAG BADGE */}
      <div className="w-full bg-white rounded-3xl brutal-border shadow-brutal-lg overflow-hidden my-2">
        {/* Top Header Strip with chosen color */}
        <div
          className="w-full py-3 px-4 text-center border-b-2 border-black flex flex-col items-center transition-colors candy-gloss"
          style={{ backgroundColor: color }}
        >
          <span className="font-display font-black text-xl tracking-widest text-black uppercase">
            HELLO
          </span>
          <span className="text-[10px] font-black tracking-widest text-black/80 uppercase -mt-0.5">
            MY NAME IS
          </span>
        </div>

        {/* Body of Name Tag */}
        <div className="p-4 flex items-center justify-between gap-3 overflow-visible">
          <input
            type="text"
            placeholder="اكتب اسمك هنا..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={18}
            className="flex-1 text-black font-black text-xl sm:text-2xl placeholder:text-zinc-400 focus:outline-none bg-transparent min-w-0"
          />

          {/* Avatar Circle Preview */}
          <div
            className="w-14 h-14 rounded-full brutal-border flex items-center justify-center text-3xl candy-gloss shrink-0 shadow-brutal-sm mx-1"
            style={{ backgroundColor: color }}
          >
            {sticker}
          </div>
        </div>

        {/* Status Sub-Strip */}
        <div className="px-4 pb-3 flex items-center gap-2 border-t border-dashed border-zinc-300 pt-2">
          <span className="px-2.5 py-0.5 rounded-full bg-neonYellow text-black font-extrabold text-[10px] brutal-border">
            {isDrinking ? '🥤 بيبسي وأحكام' : '🎮 لعب مسالم'}
          </span>
          {isHost && (
            <span className="px-2 py-0.5 rounded-full bg-neonLime text-black font-extrabold text-[10px] brutal-border">
              👑 صاحب الروم
            </span>
          )}
        </div>
      </div>

      {/* Quick Shuffle button */}
      <div className="w-full flex justify-end mt-2 mb-3">
        <button
          type="button"
          onClick={handleShuffle}
          className="px-3.5 py-1.5 rounded-full bg-zinc-900 brutal-border border-zinc-700 text-xs font-bold text-zinc-300 flex items-center gap-1.5 active:scale-95"
        >
          <RefreshCw size={13} />
          <span>شكل عشوائي</span>
        </button>
      </div>

      {/* Tabs: Colour / Sticker */}
      <div className="w-full bg-zinc-950 p-1 rounded-2xl brutal-border border-zinc-800 flex gap-1 mb-3">
        <button
          type="button"
          onClick={() => {
            setTab('color');
            sounds.playPop();
          }}
          className={`flex-1 py-2 rounded-xl font-black text-xs uppercase transition-all ${
            tab === 'color' ? 'bg-white text-black shadow-brutal-sm' : 'text-zinc-400'
          }`}
        >
          اللون (Colour)
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('sticker');
            sounds.playPop();
          }}
          className={`flex-1 py-2 rounded-xl font-black text-xs uppercase transition-all ${
            tab === 'sticker' ? 'bg-white text-black shadow-brutal-sm' : 'text-zinc-400'
          }`}
        >
          الإيموجي (Sticker)
        </button>
      </div>

      {/* Color Palette Grid */}
      {tab === 'color' && (
        <div className="w-full grid grid-cols-5 gap-2.5 p-3 bg-zinc-950/80 rounded-2xl brutal-border border-zinc-800 animate-in fade-in">
          {CANDY_COLORS.map(c => {
            const isSelected = color === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  sounds.playPop();
                }}
                className={`w-full h-11 rounded-xl brutal-border candy-gloss flex items-center justify-center transition-all ${
                  isSelected ? 'scale-105 ring-2 ring-white shadow-brutal' : 'opacity-85 hover:opacity-100'
                }`}
                style={{ backgroundColor: c }}
              >
                {isSelected && <Check size={18} className="text-black drop-shadow" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Sticker Avatars Grid */}
      {tab === 'sticker' && (
        <div className="w-full grid grid-cols-8 gap-2 p-3 bg-zinc-950/80 rounded-2xl brutal-border border-zinc-800 animate-in fade-in">
          {STICKER_AVATARS.map(s => {
            const isSelected = sticker === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSticker(s);
                  sounds.playPop();
                }}
                className={`w-full h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                  isSelected ? 'bg-zinc-800 brutal-border scale-110 shadow-brutal-sm' : 'hover:bg-zinc-900'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}

      {/* Drinking / Penalty Toggle */}
      <div className="w-full mt-4 p-3.5 rounded-2xl bg-zinc-950 brutal-border border-zinc-800 flex items-center justify-between gap-3">
        <div className="flex-1 pr-1">
          <h4 className="font-black text-xs text-white">مش هتلعب بالأحكام النهاردة؟</h4>
          <p className="text-[11px] text-zinc-400 font-bold leading-tight mt-0.5">العب للضحك وجمع النقط بس بدون شرب صودا أو أحكام.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsDrinking(!isDrinking);
            sounds.playPop();
          }}
          className={`shrink-0 w-12 h-6 rounded-full p-0.5 transition-colors brutal-border flex items-center ${
            !isDrinking ? 'bg-neonLime justify-start' : 'bg-zinc-700 justify-end'
          }`}
        >
          <div className="w-4.5 h-4.5 rounded-full bg-black shadow-sm" />
        </button>
      </div>

      {/* Fixed Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-darkBg via-darkBg/95 to-transparent z-40 max-w-md mx-auto">
        <button
          onClick={handleSubmit}
          disabled={!isReady}
          className={`w-full h-15 py-3.5 rounded-2xl font-black text-lg uppercase font-display brutal-border transition-all flex items-center justify-center gap-2 ${
            isReady
              ? 'bg-neonLime text-black shadow-brutal active:scale-98 active:translate-y-1'
              : 'bg-zinc-900 border-dashed border-zinc-700 text-zinc-600 cursor-not-allowed'
          }`}
        >
          <span>{isHost ? 'افتح اللعبة 🚀' : 'ادخل الروم 🚀'}</span>
        </button>
      </div>

    </div>
  );
};
