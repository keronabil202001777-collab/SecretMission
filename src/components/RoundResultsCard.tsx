import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../types';
import { sounds } from '../utils/audio';

interface RoundResultsCardProps {
  roundNumber: number;
  totalRounds: number;
  loserPlayer?: Player;
  currentPlayer: Player;
  penaltySips: number;
  loserReason?: string;
  onNextRound: () => void;
}

export const RoundResultsCard: React.FC<RoundResultsCardProps> = ({
  roundNumber,
  totalRounds,
  loserPlayer,
  currentPlayer,
  penaltySips,
  loserReason,
  onNextRound,
}) => {
  useEffect(() => {
    sounds.playVictory();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  }, []);

  const isCurrentPlayerLoser = loserPlayer?.id === currentPlayer.id;

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen px-4 pb-28 flex flex-col items-center justify-center">
      
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs font-mono font-black text-neonLime uppercase tracking-widest block mb-1">
          ROUND RESULTS · جولة {roundNumber}/{totalRounds}
        </span>
        <h2 className="text-3xl font-black text-white font-display">
          نتيجة الجولة!
        </h2>
      </div>

      {/* Cards container matching af_026 */}
      <div className="w-full space-y-4">
        
        {/* Pink Penalty Card if current player lost, or Yellow check card */}
        {isCurrentPlayerLoser ? (
          <div className="w-full bg-neonPink text-white p-6 rounded-3xl brutal-border shadow-brutal-lg text-center animate-in zoom-in-95">
            <span className="text-xs font-mono font-black uppercase text-black/80 block mb-1">
              YOU DRINK!
            </span>
            <div className="text-4xl font-black font-display text-white mb-2">
              اشرب {penaltySips} بؤات بيبسي! 🥤
            </div>
            <p className="text-xs font-bold text-white/90 mb-1">
              {loserReason || 'كنت أبطأ لاعب في الإجابة على الترابيزة!'}
            </p>
            <p className="text-[11px] font-bold text-white/70">
              أو نفذ حكم كافيه خفيف.. الترابيزة كلها مراقباك! 👀
            </p>
          </div>
        ) : (
          <div className="w-full bg-neonYellow text-black p-6 rounded-3xl brutal-border shadow-brutal-lg text-center animate-in zoom-in-95">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-full brutal-border flex items-center justify-center text-2xl candy-gloss shadow-brutal-sm"
                style={{ backgroundColor: loserPlayer?.color || '#00E5FF' }}
              >
                {loserPlayer?.sticker || '🥤'}
              </div>
              <h3 className="text-xl font-black font-display">
                {loserPlayer?.name || 'صاحبك'} يشرب بيبسي!
              </h3>
            </div>
            
            <p className="text-xs font-black text-rose-600 mb-1">
              {loserReason || `${loserPlayer?.name || 'صاحبك'} كان أبطأ لاعب في الإجابة!`}
            </p>
            <p className="text-xs font-bold text-black/80 mb-4">
              العقاب: {penaltySips} رشفات صودا ساقعة 🥤
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => sounds.playVictory()}
                className="flex-1 py-2.5 rounded-xl bg-neonLime text-black font-black text-xs brutal-border shadow-brutal-sm"
              >
                شرب خلاص ✓
              </button>
              <button
                onClick={() => sounds.playBuzzer()}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-black text-xs brutal-border shadow-brutal-sm"
              >
                لسه ماشربش ✕
              </button>
            </div>
          </div>
        )}

        {/* Live Score Strip */}
        <div className="w-full p-3 rounded-2xl bg-zinc-900 border-2 border-black flex items-center justify-between shadow-brutal-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bold text-xs text-zinc-300">نقاط مهماتك السرية:</span>
          </div>
          <span className="px-3 py-1 bg-neonLime text-black font-black text-xs rounded-full border border-black shadow-sm">
            {currentPlayer.score} نقطة
          </span>
        </div>

        {/* Secret Mission Reminder */}
        <div className="w-full p-4 rounded-2xl bg-zinc-950 brutal-border border-zinc-800 text-right">
          <div className="flex items-center gap-2 text-neonPurple font-black text-xs uppercase mb-1">
            <span>🕵️</span>
            <span>تذكير مهمتك السرية:</span>
          </div>
          <p className="text-xs font-bold text-zinc-300">
            المهمات السرية شغالة طول الوقت.. ركز مع هدفك في الكلام وناولات الترابيزة!
          </p>
        </div>

      </div>

      {/* Fixed Bottom Next Round Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-darkBg via-darkBg/95 to-transparent z-40 max-w-md mx-auto">
        <button
          onClick={() => {
            sounds.playPop();
            onNextRound();
          }}
          className="w-full h-15 py-3.5 rounded-2xl bg-neonLime text-black font-black text-lg uppercase font-display brutal-border shadow-brutal active:scale-98 active:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          <span>الجولة الجاية</span>
          <span>←</span>
        </button>
      </div>

    </div>
  );
};
