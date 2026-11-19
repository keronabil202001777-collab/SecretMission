import React from 'react';
import { VerificationRequest } from '../types';
import { sounds } from '../utils/audio';

interface TargetVerificationModalProps {
  request: VerificationRequest;
  onRespond: (accepted: boolean) => void;
}

export const TargetVerificationModal: React.FC<TargetVerificationModalProps> = ({
  request,
  onRespond,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      
      {/* Modal Card (Matching Frame 8 from video) */}
      <div className="w-full max-w-sm bg-neonPurple rounded-3xl brutal-border shadow-brutal-lg p-6 text-white text-center animate-in zoom-in-95">
        
        {/* Attempter Avatar */}
        <div className="relative mx-auto w-16 h-16 mb-3">
          <div
            className="w-full h-full rounded-full brutal-border flex items-center justify-center text-3xl candy-gloss shadow-brutal-sm"
            style={{ backgroundColor: request.fromPlayerColor }}
          >
            {request.fromPlayerSticker}
          </div>
          <div className="absolute -bottom-1 -right-1 text-lg">
            🕵️
          </div>
        </div>

        {/* Message */}
        <h3 className="font-display font-black text-lg text-white mb-1">
          {request.fromPlayerName} بيقول إنه نفذ عليك مهمة سرية!
        </h3>

        {/* The Mission Target Claim */}
        <div className="w-full bg-white text-black p-4 rounded-2xl brutal-border shadow-brutal-sm my-4 text-center">
          <p className="font-black text-base leading-snug">
            "{request.missionText}"
          </p>
        </div>

        <p className="text-xs font-bold text-zinc-200 mb-5">
          حصل فعلاً ووقعت في الفخ؟ كن صريح! 😉
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              sounds.playBuzzer();
              onRespond(true);
            }}
            className="w-full py-3.5 bg-neonLime text-black font-black text-base uppercase font-display rounded-2xl brutal-border shadow-brutal active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>أيوه حصل ووقعت في الفخ 🥤</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onRespond(false);
            }}
            className="w-full py-2.5 bg-zinc-900 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-700 active:scale-98 transition-all"
          >
            لأ محصلش ومضحكش عليا ❌
          </button>
        </div>

      </div>

    </div>
  );
};
