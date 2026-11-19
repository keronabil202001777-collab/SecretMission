import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Ticket, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface JoinViewProps {
  onBack: () => void;
  onJoin: (code: string) => void;
  onGoToHost: () => void;
}

export const JoinView: React.FC<JoinViewProps> = ({ onBack, onJoin, onGoToHost }) => {
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first box
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    const char = val.toUpperCase().slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    sounds.playPop();

    if (char && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newDigits.every(d => d.trim().length > 0)) {
      sounds.playVictory();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const code = digits.join('');
  const isComplete = code.length === 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      sounds.playVictory();
      onJoin(code);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen px-4 pb-12 flex flex-col items-center">
      
      {/* Top Bar: Back Button */}
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

      {/* Hero Icon */}
      <div className="mt-8 mb-3">
        <div className="w-16 h-16 rounded-2xl bg-neonPink text-black flex items-center justify-center brutal-border shadow-brutal rotate-[-4deg]">
          <Ticket size={32} />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white font-display">معاك الكود؟</h1>
        <p className="text-sm font-bold text-zinc-400 mt-1">
          ٤ حروف كبار ظاهرين على شاشة صاحب الروم
        </p>
      </div>

      {/* 4 OTP Digit Boxes */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <div className="flex gap-3 justify-center mb-8" dir="ltr">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={el => { inputsRef.current[idx] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              className="w-16 h-20 sm:w-18 sm:h-22 bg-white text-black text-center font-mono font-black text-3xl uppercase rounded-2xl brutal-border shadow-brutal focus:outline-none focus:ring-4 focus:ring-neonCyan transition-all"
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full mt-4">
          <button
            type="submit"
            disabled={!isComplete}
            className={`w-full h-16 rounded-2xl font-black text-lg uppercase font-display brutal-border transition-all flex items-center justify-center gap-2 ${
              isComplete
                ? 'bg-neonCyan text-black shadow-brutal active:scale-98 active:translate-y-1'
                : 'bg-zinc-900 border-dashed border-zinc-700 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span>ادخل اللعبة</span>
            <span>🚀</span>
          </button>
        </div>

        {/* Switch to Host link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onGoToHost();
            }}
            className="text-xs font-extrabold text-zinc-400 hover:text-neonLime transition-colors underline decoration-2 underline-offset-4"
          >
            لسه معملتوش لِمة؟ أنشئ روم جديدة ←
          </button>
        </div>
      </form>

    </div>
  );
};
