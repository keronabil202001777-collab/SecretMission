import React, { useState } from 'react';
import { ArrowRight, Signal, Skull, Sparkles, Coffee, Clock } from 'lucide-react';
import { IntensityLevel } from '../types';
import { sounds } from '../utils/audio';

interface IntensityViewProps {
  onBack: () => void;
  onSelect: (level: IntensityLevel, totalRounds: number) => void;
}

export const IntensityView: React.FC<IntensityViewProps> = ({ onBack, onSelect }) => {
  const [selected, setSelected] = useState<IntensityLevel>('lite');
  const [rounds, setRounds] = useState<number>(15);

  const levels: {
    id: IntensityLevel;
    title: string;
    subtitle: string;
    emoji: string;
    color: string;
    lose: string;
    roulette: string;
    signalBars: number;
  }[] = [
    {
      id: 'lite',
      title: 'خفيف (روقان)',
      subtitle: 'رشفة بيبسي ساقعة أو حكم مسالم',
      emoji: '🥤',
      color: '#00FF88',
      lose: 'خسارة جولة: رشفة واحدة',
      roulette: 'مهمة سرية: بؤين بيبسي',
      signalBars: 1,
    },
    {
      id: 'medium',
      title: 'متوسط (حماسي)',
      subtitle: 'شُفطة بيبسي محترمة + أحكام ضحك',
      emoji: '⚖️',
      color: '#FFE600',
      lose: 'خسارة جولة: بؤين كبار',
      roulette: 'مهمة سرية: ٣ رشفات + حكم كافيه',
      signalBars: 2,
    },
    {
      id: 'hardcore',
      title: 'حريقة (بدون رحمة)',
      subtitle: 'كانز بيبسي على بؤ واحد وأحكام مجنونة',
      emoji: '💀',
      color: '#FF2A85',
      lose: 'خسارة جولة: ٣ بؤات كبار',
      roulette: 'مهمة سرية: كنز ع بؤ واحد أو حكم قاسي!',
      signalBars: 3,
    },
  ];

  const roundOptions = [
    { count: 15, label: '١٥ جولة', subtitle: 'سريعة (~١٥ دقيقة)', emoji: '⚡' },
    { count: 30, label: '٣٠ جولة', subtitle: 'سهرة رايقة (~٣٠ دقيقة)', emoji: '🌙' },
    { count: 45, label: '٤٥ جولة', subtitle: 'حريقة للصبح (~٤٥ دقيقة)', emoji: '🔥' },
  ];

  const handleSelect = (id: IntensityLevel) => {
    setSelected(id);
    sounds.playPop();
  };

  const handleSelectRounds = (c: number) => {
    setRounds(c);
    sounds.playPop();
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen px-4 pb-32 flex flex-col items-center">
      
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between py-3">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="px-4 py-1.5 rounded-full bg-zinc-900 brutal-border border-zinc-700 text-sm font-bold text-white flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowRight size={16} />
          <span>رجوع</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-right w-full mt-2 mb-4">
        <h1 className="text-3xl font-black text-white font-display">إعدادات اللعبة</h1>
        <p className="text-xs font-bold text-zinc-400 mt-1">
          حدد شدة العقاب وطول السهرة مع الصحاب.
        </p>
      </div>

      {/* SECTION 1: ROUNDS SELECTOR (15 or 30 or 45) */}
      <div className="w-full mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-neonCyan" />
          <span className="text-xs font-mono font-black uppercase text-zinc-300 tracking-wider">
            عدد الجولات في السهرة:
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {roundOptions.map(opt => {
            const isChosen = rounds === opt.count;
            return (
              <button
                key={opt.count}
                type="button"
                onClick={() => handleSelectRounds(opt.count)}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                  isChosen
                    ? 'bg-neonCyan text-black border-black shadow-brutal-sm scale-[1.02]'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="font-black text-sm uppercase mt-0.5">{opt.label}</span>
                <span className={`text-[10px] font-bold ${isChosen ? 'text-black/80' : 'text-zinc-500'}`}>
                  {opt.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: INTENSITY LEVEL */}
      <div className="w-full mb-2">
        <span className="text-xs font-mono font-black uppercase text-zinc-300 tracking-wider block mb-2">
          شدة العقاب على القهوة:
        </span>
      </div>

      {/* 3 Selectable Intensity Cards */}
      <div className="w-full flex flex-col gap-3">
        {levels.map(lvl => {
          const isCurrent = selected === lvl.id;
          return (
            <div
              key={lvl.id}
              onClick={() => handleSelect(lvl.id)}
              className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-zinc-900 border-white shadow-brutal translate-x-[-2px]'
                  : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
              }`}
              style={{
                borderColor: isCurrent ? lvl.color : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl candy-gloss border-2 border-black shadow-brutal-sm shrink-0"
                    style={{ backgroundColor: lvl.color }}
                  >
                    {lvl.emoji}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white uppercase font-display">
                      {lvl.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-bold">{lvl.subtitle}</p>
                  </div>
                </div>

                {/* Signal Bars Indicator */}
                <div className="flex items-end gap-1">
                  <div className={`w-1.5 h-3 rounded-full ${lvl.signalBars >= 1 ? 'bg-neonLime' : 'bg-zinc-800'}`} />
                  <div className={`w-1.5 h-4.5 rounded-full ${lvl.signalBars >= 2 ? 'bg-neonYellow' : 'bg-zinc-800'}`} />
                  <div className={`w-1.5 h-6 rounded-full ${lvl.signalBars >= 3 ? 'bg-neonPink' : 'bg-zinc-800'}`} />
                </div>
              </div>

              {/* Sub-pills for penalties */}
              <div className="flex gap-2 text-[10px] font-black">
                <div className="flex-1 py-1 px-2 rounded-xl bg-black/60 text-zinc-300 border border-zinc-800 text-center">
                  {lvl.lose}
                </div>
                <div className="flex-1 py-1 px-2 rounded-xl bg-black/60 text-neonLime border border-zinc-800 text-center">
                  {lvl.roulette}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Next Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-darkBg via-darkBg/95 to-transparent z-40 max-w-md mx-auto">
        <button
          onClick={() => {
            sounds.playPop();
            onSelect(selected, rounds);
          }}
          className="w-full h-15 py-3.5 rounded-2xl bg-neonLime text-black font-black text-lg uppercase font-display brutal-border shadow-brutal active:scale-98 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>التالي ({rounds} جولة)</span>
          <span>←</span>
        </button>
      </div>

    </div>
  );
};
