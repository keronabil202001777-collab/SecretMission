import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MINI_GAMES, MiniGameMeta } from '../data/games';
import { sounds } from '../utils/audio';

interface GameSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGameIds: string[];
  onToggleGame: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const GameSelectorModal: React.FC<GameSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedGameIds,
  onToggleGame,
  onSelectAll,
  onDeselectAll,
}) => {
  if (!isOpen) return null;

  const categories: { key: MiniGameMeta['category']; englishName: string; arabicName: string }[] = [
    { key: 'reflex', englishName: 'REFLEX', arabicName: 'رد فعل وسرعة' },
    { key: 'brain', englishName: 'BRAIN', arabicName: 'تركيز وذكاء' },
    { key: 'social', englishName: 'SOCIAL', arabicName: 'تفاعل وقصف جبهات' },
    { key: 'chaos', englishName: 'CHAOS', arabicName: 'حظ وعشوائية' },
    { key: 'trivia', englishName: 'TRIVIA & CULTURE', arabicName: 'تريفيا مصرية وكورة' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in">
        
        {/* Modal Container */}
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-full max-w-2xl bg-[#0B0E17] border-t-[3px] sm:border-[3px] border-black rounded-t-3xl sm:rounded-3xl shadow-brutal-lg max-h-[92vh] flex flex-col overflow-hidden text-right"
          dir="rtl"
        >
          
          {/* Modal Header */}
          <div className="p-4 border-b-2 border-black flex items-center justify-between bg-zinc-900/90">
            <div>
              <h2 className="text-xl font-black text-white font-display tracking-tight flex items-center gap-2">
                <span>🎮</span>
                <span>MINI-GAMES CATALOG · كتالوج الألعاب</span>
              </h2>
              <p className="text-xs font-bold text-neonLime mt-0.5">
                {selectedGameIds.length} من {MINI_GAMES.length} لعبة مفعلة في الجولات
              </p>
            </div>
            
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-zinc-800 brutal-border flex items-center justify-center text-white active:scale-95 cursor-pointer shadow-brutal-sm hover:bg-zinc-700"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Select/Deselect Bar */}
          <div className="px-4 py-2.5 bg-black/60 flex items-center justify-between border-b border-zinc-800">
            <span className="text-xs font-mono font-bold text-zinc-400">
              اختر الألعاب اللي حابب تلعبوها:
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sounds.playPop();
                  onSelectAll();
                }}
                className="text-xs font-black text-neonLime hover:underline cursor-pointer"
              >
                تحديد الكل ({MINI_GAMES.length})
              </button>
              <span className="text-zinc-600">|</span>
              <button
                onClick={() => {
                  sounds.playPop();
                  onDeselectAll();
                }}
                className="text-xs font-black text-zinc-400 hover:text-white cursor-pointer"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>

          {/* Scrollable Games Catalog */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {categories.map(cat => {
              const catGames = MINI_GAMES.filter(g => g.category === cat.key);
              if (catGames.length === 0) return null;

              return (
                <div key={cat.key} className="space-y-3">
                  {/* Category Header matching screenshots */}
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
                    <span className="font-mono font-black text-xs tracking-[0.25em] text-zinc-400 uppercase">
                      {cat.englishName}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {cat.arabicName}
                    </span>
                  </div>

                  {/* Grid of Cards matching exact user screenshots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" dir="ltr">
                    {catGames.map(game => {
                      const isSelected = selectedGameIds.includes(game.id);
                      return (
                        <motion.div
                          key={game.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 450, damping: 20 }}
                          onClick={() => {
                            sounds.playPop();
                            onToggleGame(game.id);
                          }}
                          className={`relative p-4 rounded-2xl border-[3px] border-black cursor-pointer select-none flex flex-col justify-between min-h-[115px] transition-shadow ${
                            isSelected
                              ? 'shadow-[4px_4px_0px_#000000]'
                              : 'opacity-40 grayscale-[0.7] hover:opacity-75 shadow-none'
                          }`}
                          style={{
                            backgroundColor: game.color,
                            color: '#000000',
                          }}
                        >
                          {/* Top Row: Emoji on Left, Checkmark on Right (Matching Shotgun Screenshots) */}
                          <div className="flex items-start justify-between w-full">
                            <span className="text-2xl select-none leading-none">
                              {game.emoji}
                            </span>

                            {/* White Round Checkmark Badge */}
                            <div
                              className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center transition-all ${
                                isSelected ? 'bg-white text-black shadow-sm' : 'bg-black/20 text-black/30'
                              }`}
                            >
                              {isSelected ? (
                                <Check size={14} className="stroke-[3.5]" />
                              ) : null}
                            </div>
                          </div>

                          {/* Middle: Title & Taglines */}
                          <div className="my-1.5 text-left">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <h3 className="font-black text-base uppercase tracking-tight font-display text-black leading-none">
                                {game.name}
                              </h3>
                              <span className="text-xs font-bold text-black/70">
                                · {game.arabicName}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-black/95 leading-tight mt-1">
                              {game.tagline}
                            </p>
                            <p className="text-[11px] font-semibold text-black/80 leading-tight mt-0.5" dir="rtl">
                              {game.arabicTagline}
                            </p>
                          </div>

                          {/* Bottom Row: 3+ players pill if needed */}
                          {game.minPlayers >= 3 && (
                            <div className="mt-1 flex justify-start">
                              <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                                3+ players
                              </span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t-2 border-black bg-zinc-900/90 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sounds.playVictory();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-neonLime text-black font-black text-base uppercase font-display border-[3px] border-black shadow-[4px_4px_0px_#000000] cursor-pointer"
            >
              تأكيد الاختيار ({selectedGameIds.length}) ✓
            </motion.button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
