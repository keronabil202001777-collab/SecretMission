import React from 'react';
import { X, Target, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SecretMissionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: {
    id: string;
    targetId: string;
    targetName: string;
    targetColor: string;
    targetSticker: string;
    text: string;
    completed: boolean;
    pendingVerification: boolean;
  };
  onExecute: () => void;
  onReroll?: () => void;
  onGetNewMission?: () => void;
}

export const SecretMissionSheet: React.FC<SecretMissionSheetProps> = ({
  isOpen,
  onClose,
  mission,
  onExecute,
  onReroll,
  onGetNewMission,
}) => {
  if (!isOpen || !mission) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
      
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Bottom Sheet Card (Matching Shotgun af_024!) */}
      <div className="w-full max-w-md mx-auto bg-neonPurple rounded-t-[32px] brutal-border border-b-0 shadow-brutal-lg p-5 text-white animate-in slide-in-from-bottom duration-200">
        
        {/* Sheet Top Handle & Close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕵️</span>
            <div>
              <h3 className="font-display font-black text-xl tracking-tight text-white uppercase leading-none">
                مهمة سرية
              </h3>
              <span className="text-[10px] font-bold text-neonLime">
                مهمات مستمرة طوال الجولات 🔥
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReroll && !mission.completed && !mission.pendingVerification && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onReroll();
                }}
                className="px-3 py-1 rounded-full bg-black/40 text-xs font-bold text-neonYellow flex items-center gap-1 active:scale-95 cursor-pointer border border-black/40"
                title="تغيير المهمة"
              >
                <RefreshCw size={12} />
                <span>تبديل</span>
              </button>
            )}

            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-black/40 brutal-border border-black flex items-center justify-center text-white active:scale-90 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* White Mission Card with Target Avatar (Matching af_024) */}
        <div className="w-full bg-white text-black p-4 rounded-2xl brutal-border shadow-brutal-sm mb-4">
          <div className="flex items-start gap-3">
            {/* Target Avatar with camera/status */}
            <div
              className="w-12 h-12 rounded-full brutal-border flex items-center justify-center text-2xl candy-gloss shrink-0 shadow-brutal-sm"
              style={{ backgroundColor: mission.targetColor }}
            >
              {mission.targetSticker}
            </div>

            {/* Mission Objective Text */}
            <div className="flex-1 text-right">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block mb-0.5">
                هدفك في القعدة: {mission.targetName}
              </span>
              <p className="font-black text-base text-zinc-900 leading-snug">
                {mission.text}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions helper pill */}
        <div className="w-full p-3 rounded-xl bg-black/30 brutal-border border-black/40 text-right mb-4">
          <p className="text-xs font-bold text-zinc-200 leading-relaxed">
            نفّذ المهمة بدون ما يلاحظك في القعدة. أول ما توقع صاحبك فيها، اضغط ع الزرار وهيجيله سؤال تأكيد على موبايله فوراً!
          </p>
        </div>

        {/* Verification Status or Action Button */}
        {mission.pendingVerification ? (
          <div className="w-full py-4 px-3 rounded-2xl bg-black/60 brutal-border border-black flex items-center justify-center gap-2 text-neonYellow font-black text-sm">
            <Clock size={18} className="animate-spin" />
            <span>في انتظار تأكيد {mission.targetName} على موبايله...</span>
          </div>
        ) : mission.completed ? (
          <div className="flex flex-col gap-2.5">
            <div className="w-full py-3 px-3 rounded-2xl bg-neonLime text-black brutal-border shadow-brutal flex items-center justify-center gap-2 font-black text-sm font-display">
              <CheckCircle2 size={18} />
              <span>تمت المهمة بنجاح وخدت النقطة! 🎯</span>
            </div>

            <button
              onClick={() => {
                sounds.playVictory();
                if (onGetNewMission) onGetNewMission();
              }}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-black text-base uppercase font-display brutal-border shadow-brutal active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>استلم مهمتك السرية التالية!</span>
              <span>🕵️‍♂️🚀</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              sounds.playVictory();
              onExecute();
            }}
            className="w-full py-4 rounded-2xl bg-neonLime text-black font-black text-lg uppercase font-display brutal-border shadow-brutal active:scale-98 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>نفذت المهمة بنجاح!</span>
            <span>🎯</span>
          </button>
        )}

      </div>

    </div>
  );
};
