import React from 'react';
import { X, Trophy, Plus, Minus, UserX, Crown, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../types';
import { sounds } from '../utils/audio';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  currentPlayer: Player;
  isHost: boolean;
  onUpdateScore: (playerId: string, delta: number) => void;
  onAddDrink: (playerId: string) => void;
  onKickPlayer: (playerId: string) => void;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  isOpen,
  onClose,
  players,
  currentPlayer,
  isHost,
  onUpdateScore,
  onAddDrink,
  onKickPlayer,
}) => {
  if (!isOpen) return null;

  // Sort players descending by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in">
        
        {/* Modal Container */}
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-full max-w-md bg-[#0B0E17] border-t-[3px] sm:border-[3px] border-black rounded-t-3xl sm:rounded-3xl shadow-brutal-lg max-h-[90vh] flex flex-col overflow-hidden text-right"
          dir="rtl"
        >
          
          {/* Header */}
          <div className="p-4 border-b-2 border-black flex items-center justify-between bg-zinc-900/90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <h2 className="text-lg font-black text-white font-display uppercase tracking-tight">
                  لوحة المتصدرين والتحكيم
                </h2>
                <span className="text-xs font-bold text-neonLime">
                  {isHost ? 'أنت صاحب الروم (تحكم كامل)' : 'نتائج ومهمات السهرة'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-white active:scale-95 cursor-pointer shadow-brutal-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Host Instructions Banner */}
          {isHost && (
            <div className="px-4 py-2 bg-amber-400/10 border-b border-amber-400/20 flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldAlert size={14} className="shrink-0 text-amber-400" />
              <span>تقدر كـ Host تعدل النقاط يدوي أو تطرد أي لاعب بيغش من الروم.</span>
            </div>
          )}

          {/* Players Scoreboard List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedPlayers.map((player, idx) => {
              const isFirst = idx === 0 && player.score > 0;
              const isSelf = player.id === currentPlayer.id;

              return (
                <div
                  key={player.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isSelf
                      ? 'bg-zinc-900 border-neonLime shadow-brutal-sm'
                      : 'bg-zinc-950/80 border-zinc-800'
                  }`}
                >
                  {/* Left: Rank & Player Identity */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 font-mono font-black text-sm text-center">
                      {isFirst ? (
                        <Crown size={18} className="text-neonYellow inline" />
                      ) : (
                        <span className="text-zinc-500">#{idx + 1}</span>
                      )}
                    </div>

                    <div
                      className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center text-xl candy-gloss shrink-0 shadow-brutal-sm"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.sticker}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sm text-white truncate">
                          {player.name}
                        </span>
                        {player.isHost && (
                          <span className="px-1.5 py-0.2 bg-neonYellow text-black text-[9px] font-black rounded-full">
                            👑 Host
                          </span>
                        )}
                        {isSelf && (
                          <span className="px-1.5 py-0.2 bg-neonCyan text-black text-[9px] font-black rounded-full">
                            أنت
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold text-zinc-400">
                        <span className="text-neonLime">{player.score} مهمة 🎯</span>
                        <span>·</span>
                        <span className="text-zinc-400">{player.drinksTaken} بؤ 🥤</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score Controls & Kick Button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Score Controls (Visible to Host) */}
                    {isHost ? (
                      <>
                        <div className="flex items-center bg-black/60 rounded-xl border border-zinc-700 p-0.5">
                          <button
                            onClick={() => {
                              sounds.playPop();
                              onUpdateScore(player.id, -1);
                            }}
                            className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-black active:scale-90 cursor-pointer"
                            title="خصم نقطة"
                          >
                            <Minus size={12} />
                          </button>

                          <span className="w-7 text-center font-mono font-black text-xs text-white">
                            {player.score}
                          </span>

                          <button
                            onClick={() => {
                              sounds.playVictory();
                              onUpdateScore(player.id, 1);
                            }}
                            className="w-7 h-7 rounded-lg bg-neonLime text-black flex items-center justify-center text-xs font-black active:scale-90 cursor-pointer"
                            title="إضافة نقطة"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Kick Player Button (Except for the Host himself) */}
                        {!player.isHost && (
                          <button
                            onClick={() => {
                              sounds.playBuzzer();
                              if (confirm(`هل أنت متأكد من طرد "${player.name}" من الروم؟`)) {
                                onKickPlayer(player.id);
                              }
                            }}
                            className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/40 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                            title="طرد اللاعب من الروم"
                          >
                            <UserX size={15} />
                          </button>
                        )}
                      </>
                    ) : (
                      /* Non-host viewer badge */
                      <div className="px-3 py-1 bg-black/60 rounded-xl border border-zinc-800 font-mono font-black text-sm text-neonLime">
                        {player.score} 🎯
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-black bg-zinc-900/90">
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-white text-black font-black text-sm uppercase font-display border-2 border-black shadow-brutal active:scale-98 cursor-pointer"
            >
              إغلاق اللوحة ✕
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
