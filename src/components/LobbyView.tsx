import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Maximize2, Crown, Sparkles, UserPlus, Eye, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { GameRoom, Player } from '../types';
import { MINI_GAMES } from '../data/games';
import { sounds } from '../utils/audio';
import { GameSelectorModal } from './GameSelectorModal';

interface LobbyViewProps {
  room: GameRoom;
  currentPlayer: Player;
  onStartGame: () => void;
  onToggleSecretMissions: () => void;
  onUpdateActiveGames: (gameIds: string[]) => void;
  onChangeLook: () => void;
  onCycleRounds?: () => void;
  onKickPlayer?: (playerId: string) => void;
  onOpenScoreboard?: () => void;
  onAddBotPlayer?: () => void; // for quick testing with friends or simulated players
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  room,
  currentPlayer,
  onStartGame,
  onToggleSecretMissions,
  onUpdateActiveGames,
  onChangeLook,
  onCycleRounds,
  onKickPlayer,
  onOpenScoreboard,
  onAddBotPlayer,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLargeQR, setShowLargeQR] = useState(false);

  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}?code=${room.code}` : `https://secretmission.app/?code=${room.code}`;

  const handleCopyLink = () => {
    sounds.playPop();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleGame = (id: string) => {
    let next: string[];
    if (room.activeGames.includes(id)) {
      if (room.activeGames.length <= 1) return; // Keep at least one
      next = room.activeGames.filter(g => g !== id);
    } else {
      next = [...room.activeGames, id];
    }
    onUpdateActiveGames(next);
  };

  const handleSelectAll = () => {
    onUpdateActiveGames(MINI_GAMES.map(g => g.id));
  };

  const handleDeselectAll = () => {
    onUpdateActiveGames([MINI_GAMES[0].id]);
  };

  const isHost = currentPlayer.isHost;
  const canStart = room.players.length >= 2;

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen px-4 pb-32 flex flex-col items-center">
      
      {/* MASTER QR & ROOM CODE CARD (Matching wf_031) */}
      <div className="w-full bg-white text-black p-4 rounded-3xl brutal-border shadow-brutal-lg my-3 flex items-center gap-4">
        {/* Left: Big QR Code */}
        <div 
          onClick={() => {
            sounds.playPop();
            setShowLargeQR(true);
          }}
          className="p-2 bg-white rounded-2xl brutal-border shadow-brutal-sm cursor-pointer active:scale-95 transition-transform shrink-0"
        >
          <QRCodeSVG value={joinUrl} size={92} level="M" />
        </div>

        {/* Right: Room Code & Action buttons */}
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500">
            كود الروم
          </span>
          <span className="text-4xl font-mono font-black tracking-wider uppercase text-black font-display -mt-1">
            {room.code}
          </span>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-1.5 px-2 bg-neonLime text-black font-black text-xs rounded-xl brutal-border shadow-brutal-sm flex items-center justify-center gap-1 active:scale-95"
            >
              <Share2 size={12} />
              <span>{copied ? 'تم النسخ!' : 'مشاركة'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setShowLargeQR(true);
              }}
              className="py-1.5 px-2.5 bg-neonYellow text-black font-black text-xs rounded-xl brutal-border shadow-brutal-sm flex items-center justify-center active:scale-95"
              title="تكبير الـ QR"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Large QR Modal if opened */}
      {showLargeQR && (
        <div 
          onClick={() => setShowLargeQR(false)} 
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 animate-in fade-in"
        >
          <div className="bg-white p-6 rounded-3xl brutal-border shadow-brutal-lg flex flex-col items-center max-w-xs text-black">
            <QRCodeSVG value={joinUrl} size={220} level="H" />
            <span className="mt-4 text-3xl font-mono font-black tracking-widest">{room.code}</span>
            <p className="text-xs font-bold text-zinc-600 mt-1">امسح الكود بكاميرا الموبايل للدخول فوراً</p>
            <button
              onClick={() => setShowLargeQR(false)}
              className="mt-4 px-6 py-2 bg-black text-white font-black text-xs rounded-full brutal-border"
            >
              إغلاق ✕
            </button>
          </div>
        </div>
      )}

      {/* Players Section Header */}
      <div className="w-full flex items-center justify-between mt-3 mb-3">
        <h3 className="text-xl font-black text-white font-display">اللاعيبة</h3>
        
        <div className="flex items-center gap-2">
          {onOpenScoreboard && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenScoreboard();
              }}
              className="px-3 py-1 rounded-full bg-neonLime text-black brutal-border text-xs font-black shadow-brutal-sm flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>🏆</span>
              <span>النقاط</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playPop();
              onChangeLook();
            }}
            className="px-3 py-1 rounded-full bg-zinc-900 brutal-border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white active:scale-95 cursor-pointer"
          >
            غيّر شكلك
          </button>
          <span className="px-3 py-1 rounded-full bg-neonCyan text-black font-mono font-black text-xs brutal-border shadow-brutal-sm">
            {room.players.length}/20
          </span>
        </div>
      </div>

      {/* Player Circles Grid (Matching wf_031) */}
      <div className="w-full grid grid-cols-4 gap-3 p-3 bg-zinc-950/70 rounded-3xl brutal-border border-zinc-800 mb-4">
        {room.players.map((p, idx) => (
          <div key={p.id} className="flex flex-col items-center text-center">
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full brutal-border flex items-center justify-center text-2xl candy-gloss shadow-brutal-sm"
                style={{ backgroundColor: p.color }}
              >
                {p.sticker}
              </div>
              {p.isHost ? (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neonYellow brutal-border flex items-center justify-center text-[10px] shadow-sm">
                  👑
                </div>
              ) : (
                isHost && onKickPlayer && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playBuzzer();
                      if (confirm(`هل أنت متأكد من طرد "${p.name}"؟`)) {
                        onKickPlayer(p.id);
                      }
                    }}
                    className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-rose-600 text-white border border-black flex items-center justify-center text-[10px] font-black cursor-pointer hover:scale-110 active:scale-90 shadow-sm"
                    title={`طرد ${p.name}`}
                  >
                    ✕
                  </button>
                )
              )}
            </div>
            <span className="text-xs font-black text-white mt-1.5 truncate max-w-[70px]">
              {p.name}
            </span>
          </div>
        ))}

        {/* Dashed placeholder slots for waiting players */}
        {Array.from({ length: Math.max(0, 4 - room.players.length) }).map((_, i) => (
          <div key={i} className="flex flex-col items-center text-center opacity-40">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-zinc-600 flex items-center justify-center text-zinc-500 font-black text-lg">
              ?
            </div>
            <span className="text-[10px] font-bold text-zinc-500 mt-1.5">في الانتظار</span>
          </div>
        ))}
      </div>

      {/* Quick Add Simulated Player Button (Great for testing solo or in small groups) */}
      {isHost && onAddBotPlayer && (
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => {
              sounds.playPop();
              onAddBotPlayer();
            }}
            className="px-3.5 py-1.5 bg-zinc-900 border border-dashed border-zinc-700 text-neonCyan rounded-full text-xs font-bold flex items-center gap-1 active:scale-95"
          >
            <UserPlus size={13} />
            <span>+ ضيف صاحب وهمي (للتجربة)</span>
          </button>
        </div>
      )}

      {/* Game Settings Pills Bar: "النهاردة · اضغط للتعديل" */}
      <div className="w-full">
        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-400 block mb-2">
          النهاردة · اضغط للتعديل
        </span>

        <div className="flex flex-wrap gap-2">
          {/* Party Mix Pill */}
          <div className="px-3.5 py-1.5 rounded-full bg-neonPink text-black font-extrabold text-xs brutal-border shadow-brutal-sm flex items-center gap-1">
            <span>🎉</span>
            <span>كولكشن الحفلة</span>
          </div>

          {/* Intensity Pill */}
          <div className="px-3 py-1.5 rounded-full bg-neonCyan text-black font-extrabold text-xs brutal-border shadow-brutal-sm flex items-center gap-1">
            <span>🥤</span>
            <span>{room.intensity === 'lite' ? 'روقان (خفيف)' : room.intensity === 'medium' ? 'حماسي (وسط)' : 'حريقة'}</span>
          </div>

          {/* Total Rounds Pill: 15 / 30 / 45 */}
          {onCycleRounds && isHost ? (
            <button
              onClick={() => {
                sounds.playPop();
                onCycleRounds();
              }}
              className="px-3.5 py-1.5 rounded-full bg-neonYellow text-black font-extrabold text-xs brutal-border shadow-brutal-sm flex items-center gap-1 active:scale-95 cursor-pointer"
              title="اضغط لتغيير عدد الجولات (15 / 30 / 45)"
            >
              <span>⏱️</span>
              <span>{room.totalRounds} جولة (غيّر)</span>
            </button>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full bg-neonYellow text-black font-extrabold text-xs brutal-border shadow-brutal-sm flex items-center gap-1">
              <span>⏱️</span>
              <span>{room.totalRounds} جولة</span>
            </div>
          )}

          {/* Mini-Games Count Pill (Opens Modal!) */}
          <button
            onClick={() => {
              sounds.playPop();
              setModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-white text-black font-extrabold text-xs brutal-border shadow-brutal-sm flex items-center gap-1 active:scale-95"
          >
            <span>🎮</span>
            <span>{room.activeGames.length}/{MINI_GAMES.length} لعبة</span>
          </button>

          {/* Secret Missions Toggle Pill (Matching wf_031!) */}
          <button
            onClick={() => {
              sounds.playPop();
              onToggleSecretMissions();
            }}
            className={`px-3.5 py-1.5 rounded-full font-extrabold text-xs brutal-border shadow-brutal-sm flex items-center gap-1.5 active:scale-95 transition-all ${
              room.secretMissionsEnabled
                ? 'bg-neonLime text-black'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            <span>🕵️</span>
            <span>{room.secretMissionsEnabled ? 'مهمات سرية: شغال ✓' : 'مهمات سرية: مقفول ✕'}</span>
          </button>
        </div>
      </div>

      {/* FIXED BOTTOM START BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-darkBg via-darkBg/95 to-transparent z-40 max-w-md mx-auto">
        {canStart ? (
          <button
            onClick={() => {
              sounds.playVictory();
              onStartGame();
            }}
            className="w-full h-15 py-3.5 rounded-2xl bg-neonLime text-black font-black text-lg uppercase font-display brutal-border shadow-brutal active:scale-98 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span>ابدأ اللعبة</span>
            <span>🚀</span>
          </button>
        ) : (
          <div className="w-full py-4 rounded-2xl bg-zinc-950 border-2 border-dashed border-zinc-700 text-zinc-500 font-black text-center text-sm font-display">
            محتاجين على الأقل ٢ لاعيبة عشان تبدأوا 👥
          </div>
        )}

        <p className="text-[11px] text-center font-bold text-zinc-500 mt-2">
          شارك الكود أو وريهم الـ QR: الكل هيدخل من موبايله في ثواني
        </p>
      </div>

      {/* Mini-Games Selector Modal */}
      <GameSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedGameIds={room.activeGames}
        onToggleGame={handleToggleGame}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

    </div>
  );
};
