import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MiniGameMeta } from '../data/games';
import { sounds } from '../utils/audio';
import { Check, Sparkles } from 'lucide-react';

interface GameTransitionViewProps {
  game: MiniGameMeta;
  roundNumber: number;
  totalRounds: number;
  roomCode: string;
  totalPlayersCount?: number;
  onReady: () => void;
}

export const GameTransitionView: React.FC<GameTransitionViewProps> = ({
  game,
  roundNumber,
  totalRounds,
  roomCode,
  totalPlayersCount = 3,
  onReady,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [readyCount, setReadyCount] = useState(1);

  const handleReadyClick = () => {
    if (isReady) return;
    sounds.playVictory();
    setIsReady(true);

    // Simulate other connected players hitting ready within 1-2 seconds
    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      setReadyCount(current);
      sounds.playPop();

      if (current >= totalPlayersCount) {
        clearInterval(interval);
        setTimeout(() => {
          onReady();
        }, 500);
      }
    }, 600);
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen px-4 pb-28 flex flex-col items-center">
      
      {/* Top HUD Pill */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-full flex items-center justify-between py-3"
      >
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 brutal-border border-zinc-700 rounded-full text-xs font-mono font-bold text-zinc-300 shadow-brutal-sm">
          <span>{roomCode}</span>
          <span className="text-zinc-500">|</span>
          <span className="text-neonCyan">جولة {roundNumber}/{totalRounds}</span>
        </div>

        <span className="text-xs font-mono font-black text-neonLime animate-pulse">
          NEXT UP ⚡
        </span>
      </motion.div>

      {/* Main Instruction Card with 3D Card Flip & Spring Entrance */}
      <motion.div 
        initial={{ rotateX: 30, scale: 0.85, opacity: 0, y: 30 }}
        animate={{ rotateX: 0, scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        style={{ perspective: 1000 }}
        className="w-full bg-white text-black rounded-3xl brutal-border shadow-brutal-lg overflow-hidden my-4"
      >
        
        {/* Top Game Colored Banner */}
        <div
          className="p-5 border-b-2 border-black flex items-center gap-3 candy-gloss"
          style={{ backgroundColor: game.color }}
        >
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.15 }}
            className="w-14 h-14 rounded-2xl bg-black text-white text-3xl flex items-center justify-center brutal-border shadow-brutal-sm shrink-0"
          >
            {game.emoji}
          </motion.div>
          <div>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black">
              {game.arabicName}
            </h2>
            <p className="text-xs font-extrabold text-black/85 mt-0.5">
              {game.arabicTagline}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-right">
          <div>
            <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block mb-1">
              إزاي تلعب (HOW TO PLAY)
            </span>
            <p className="text-sm font-extrabold text-zinc-900 leading-snug">
              {game.howToPlay}
            </p>
          </div>

          <div className="border-t border-dashed border-zinc-300 pt-3">
            <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block mb-1">
              مين اللي هيشرب؟ (WHO DRINKS)
            </span>
            <p className="text-xs font-extrabold text-zinc-800">
              أبطأ لاعب أو اللي يغلط في اللعبة دي.
            </p>
          </div>

          {/* Penalty Pill */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-neonLime text-xs font-black brutal-border">
              <span>🥤</span>
              <span>العقاب: {game.penaltySips} رشفات بيبسي / كرت حكم</span>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Ready Status Pill if user clicked Ready */}
      {isReady && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full text-center my-2 text-xs font-black text-neonYellow flex items-center justify-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-neonLime animate-ping" />
          <span>في انتظار باقي الصحاب... ({readyCount}/{totalPlayersCount} جاهزين)</span>
        </motion.div>
      )}

      {/* Fixed Bottom Action Button (NO COUNTDOWN - STARTS WHEN TAPPED & ALL READY) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-darkBg via-darkBg/95 to-transparent z-40 max-w-md mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.94, y: 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          onClick={handleReadyClick}
          disabled={isReady}
          className={`w-full h-15 py-3.5 rounded-2xl font-black text-lg uppercase font-display brutal-border transition-all flex items-center justify-center gap-2 shadow-brutal ${
            isReady
              ? 'bg-zinc-900 text-neonLime border-neonLime cursor-default'
              : 'bg-neonLime text-black active:translate-y-1'
          }`}
        >
          {isReady ? (
            <>
              <Check size={22} className="stroke-[3]" />
              <span>أنا جاهز! ({readyCount}/{totalPlayersCount})</span>
            </>
          ) : (
            <>
              <span>أنا جاهز للعب</span>
              <span>🚀</span>
            </>
          )}
        </motion.button>
      </div>

    </div>
  );
};
