import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Ticket, Sparkles, ChevronDown, Coffee, Menu, Volume2, VolumeX, Eye } from 'lucide-react';
import { sounds } from '../utils/audio';
import { GameSelectorModal } from './GameSelectorModal';
import { MINI_GAMES } from '../data/games';

interface LandingViewProps {
  onJoinClick: () => void;
  onHostClick: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onJoinClick, onHostClick }) => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [drinksOn, setDrinksOn] = useState(true);
  const [soundOn, setSoundOn] = useState(sounds.isEnabled());
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [activeCatalogGames, setActiveCatalogGames] = useState<string[]>(MINI_GAMES.map(g => g.id));

  const toggleSound = () => {
    const next = !soundOn;
    sounds.setEnabled(next);
    setSoundOn(next);
    sounds.playPop();
  };

  const toggleDrinks = () => {
    setDrinksOn(!drinksOn);
    sounds.playPop();
  };

  const toggleLang = () => {
    sounds.playPop();
    setLang(l => (l === 'ar' ? 'en' : 'ar'));
  };

  const isAr = lang === 'ar';

  return (
    <div 
      className={`relative w-full max-w-md mx-auto min-h-screen px-4 pb-44 flex flex-col items-center overflow-x-hidden ${isAr ? 'font-arabic' : 'font-sans'}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      
      {/* Background ambient radial glow orbs matching Shotgun */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-neonPurple/25 blur-[100px]" />
        <div className="absolute top-44 -right-12 w-80 h-80 rounded-full bg-neonPink/30 blur-[100px]" />
        <div className="absolute bottom-28 left-6 w-72 h-72 rounded-full bg-neonCyan/20 blur-[90px]" />
      </div>

      {/* TOP HEADER BAR (Matching Shotgun Mobile Screenshot) */}
      <div className="w-full pt-3 pb-2 flex items-center justify-between z-30 px-1">
        {/* Left / Secondary Action */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center text-white active:scale-90 transition-transform shadow-brutal-sm cursor-pointer"
            title="الصوت"
          >
            {soundOn ? <Volume2 size={14} className="text-neonLime" /> : <VolumeX size={14} className="text-zinc-500" />}
          </button>

          {/* Language Toggle Pill */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleLang}
            className="px-2.5 py-1 rounded-full border-2 border-black bg-neonYellow text-black font-black text-[11px] shadow-brutal-sm cursor-pointer flex items-center gap-1 active:scale-95"
            title="تبديل اللغة"
          >
            <span>🌍</span>
            <span>{isAr ? 'مصري' : 'EN'}</span>
          </motion.button>
        </div>

        {/* Right: Drinks Switch + User Avatar + Menu */}
        <div className="flex items-center gap-1.5">
          {/* Drinks Toggle Pill: exact match of Shotgun top-right switch */}
          <button
            onClick={toggleDrinks}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border-2 border-black text-[11px] font-black transition-all cursor-pointer ${
              drinksOn
                ? 'bg-neonYellow text-black shadow-brutal-sm'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${drinksOn ? 'bg-black' : 'bg-zinc-500'}`} />
            <span>{drinksOn ? (isAr ? 'بيبسي' : 'Drinks on') : (isAr ? 'مسالم' : 'Drinks off')}</span>
          </button>

          {/* User Profile Avatar Circle */}
          <div className="w-8 h-8 rounded-full border-2 border-black bg-neonLime flex items-center justify-center text-base font-black candy-gloss shadow-brutal-sm">
            🕵️
          </div>

          {/* Menu Button */}
          <button
            onClick={() => {
              sounds.playPop();
              setShowCatalogModal(true);
            }}
            className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center text-white active:scale-90 transition-transform shadow-brutal-sm cursor-pointer"
            title="كتالوج الألعاب"
          >
            <Menu size={15} />
          </button>
        </div>
      </div>

      {/* FLOATING TOP STICKER: 30 mini-games (Clickable to open catalog) */}
      <motion.div 
        initial={{ y: -20, opacity: 0, rotate: 12 }}
        animate={{ y: 0, opacity: 1, rotate: 4 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className="w-full flex justify-end mt-2 mb-1"
      >
        <motion.button 
          whileHover={{ scale: 1.08, rotate: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sounds.playPop();
            setShowCatalogModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-neonLime text-black font-black text-xs rounded-full border-2 border-black shadow-brutal-sm cursor-pointer"
        >
          <span>🎮</span>
          <span>{isAr ? '٣٠ لعبة وتحدي (تصفح)' : '30 mini-games'}</span>
        </motion.button>
      </motion.div>

      {/* HERO SECTION: SHOT GUN BOLD NEO-BRUTALIST LOGO */}
      <motion.div 
        initial={{ scale: 0.85, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.08 }}
        className="w-full text-center my-2 select-none"
      >
        <div className="inline-block relative">
          <motion.h1 
            whileHover={{ scale: 1.03 }}
            className="text-7xl sm:text-8xl font-black uppercase tracking-tight text-[#CCFF00] drop-shadow-[5px_5px_0px_#000000] leading-[0.88] font-display"
          >
            SHOT
          </motion.h1>
          <motion.h1 
            whileHover={{ scale: 1.03 }}
            className="text-7xl sm:text-8xl font-black uppercase tracking-tight text-[#FF2A85] drop-shadow-[5px_5px_0px_#000000] leading-[0.88] font-display -mt-1"
          >
            GUN
          </motion.h1>

          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1 bg-black text-neonLime border-2 border-black rounded-full font-black text-xs shadow-brutal-sm">
            <span>🕵️‍♂️</span>
            <span>{isAr ? 'مهمة سرية · قعدة كافيه' : 'Secret Mission · Café Edition'}</span>
          </div>
        </div>
      </motion.div>

      {/* SCATTERED TILTED STICKER BADGES (Matching screenshot) */}
      <div className="w-full flex flex-wrap justify-center items-center gap-2 my-2.5">
        <motion.div 
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -3 }}
          transition={{ type: "spring", stiffness: 450, damping: 15, delay: 0.12 }}
          whileHover={{ scale: 1.1, rotate: 0 }}
          className="px-3 py-1 bg-neonCyan text-black font-black text-xs rounded-full border-2 border-black shadow-brutal-sm"
        >
          📱 {isAr ? 'بدون تحميل' : 'No install'}
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 2 }}
          transition={{ type: "spring", stiffness: 450, damping: 15, delay: 0.16 }}
          whileHover={{ scale: 1.1, rotate: 0 }}
          className="px-3 py-1 bg-[#FF88CC] text-black font-black text-xs rounded-full border-2 border-black shadow-brutal-sm"
        >
          ☕ {isAr ? 'رايقة للكافيه' : 'The Café'}
        </motion.div>

        <motion.div 
          initial={{ scale: 0, rotate: -8 }}
          animate={{ scale: 1, rotate: -2 }}
          transition={{ type: "spring", stiffness: 450, damping: 15, delay: 0.2 }}
          whileHover={{ scale: 1.1, rotate: 0 }}
          className="px-3 py-1 bg-rose-500 text-white font-black text-xs rounded-full border-2 border-black shadow-brutal-sm"
        >
          🥤 {isAr ? 'بيبسي وأحكام' : 'Soda & Dares'}
        </motion.div>
      </div>

      {/* COMIC SPEECH BUBBLE (Exact match of Shotgun screenshot) */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 20, delay: 0.24 }}
        className="relative mt-3 mb-4 w-full max-w-xs"
      >
        <div className="relative bg-white text-black p-4 rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_#000000]">
          <p className="font-extrabold text-center text-sm sm:text-base leading-snug">
            {isAr
              ? '“من غير أي أبلكيشن تحمله. صوّر الـ QR بكاميرا موبايلك والعبوا سوا!”'
              : '“No app to install. Scan the QR and play.”'}
          </p>
          {/* Comic Pointer Tail */}
          <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-black" />
          <div className="absolute -bottom-2 left-[42px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
        </div>
      </motion.div>

      {/* SCROLL INDICATOR & STYLIZED GLASS GRAPHIC (Matching screenshot) */}
      <div className="w-full flex items-center justify-between px-6 my-1">
        <div className="w-8" /> {/* spacer */}

        {/* Center Scroll Prompt */}
        <div className="flex flex-col items-center opacity-70">
          <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-zinc-400">
            SCROLL
          </span>
          <ChevronDown size={14} className="animate-bounce mt-0.5 text-zinc-400" />
        </div>

        {/* Stylized Glass Tumbler Graphic (Right side of screenshot) */}
        <motion.div 
          whileHover={{ scale: 1.15 }}
          className="relative w-7 h-11 border-2 border-white/50 rounded-b-lg overflow-hidden bg-white/10 backdrop-blur-xs flex flex-col justify-end p-0.5"
          title="Cold Drink Glass"
        >
          {/* Liquid level */}
          <div className="w-full h-2/5 bg-white/80 rounded-b-sm relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/40 animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* HOW IT WORKS 1-2-3 CARDS */}
      <div className="w-full mt-5 space-y-2.5">
        <div className="text-center mb-3">
          <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-black">
            NO APP · NO ACCOUNTS · 60+ FPS
          </span>
          <h2 className="text-2xl font-black text-white mt-0.5">
            {isAr ? 'إزاي بتتلعب على القهوة؟' : 'How does it work?'}
          </h2>
        </div>

        {/* Step 1 */}
        <motion.div 
          initial={{ x: -25, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 p-3 bg-zinc-900/90 rounded-2xl border-2 border-black shadow-brutal-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-neonCyan text-black font-black flex items-center justify-center text-lg shrink-0 border-2 border-black">
            ١
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm text-white">
              {isAr ? 'واحد يفتح الروم ع الموبايل' : 'Host a room on any phone'}
            </h4>
            <p className="text-xs text-zinc-400">
              {isAr ? 'أي حد ينشئ اللعبة وهيظهرله كود الروم والـ QR.' : 'Create a room to get a 4-letter code and instant QR.'}
            </p>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div 
          initial={{ x: 25, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 p-3 bg-zinc-900/90 rounded-2xl border-2 border-black shadow-brutal-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-neonYellow text-black font-black flex items-center justify-center text-lg shrink-0 border-2 border-black">
            ٢
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm text-white">
              {isAr ? 'الصحاب يعملوا سكان للـ QR' : 'Friends scan to join instantly'}
            </h4>
            <p className="text-xs text-zinc-400">
              {isAr ? 'بكاميرا الموبايل في ثانية واحدة بدون تسجيل أو تحميل.' : 'No app install or sign-up needed. Scan and enter name.'}
            </p>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div 
          initial={{ x: -25, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 p-3 bg-zinc-900/90 rounded-2xl border-2 border-black shadow-brutal-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-neonPink text-black font-black flex items-center justify-center text-lg shrink-0 border-2 border-black">
            ٣
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm text-white">
              {isAr ? 'ميني جيمز سريعة + مهمة سرية خبيثة' : 'Fast mini-games + Secret missions'}
            </h4>
            <p className="text-xs text-zinc-400">
              {isAr ? 'بتلعبوا ميني جيمز في العلن، ومعاك مهمة سرية بتوقع صاحبك فيها!' : 'Everyone plays mini-games openly while pulling off secret café missions!'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick Catalog Showcase Banner */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          sounds.playPop();
          setShowCatalogModal(true);
        }}
        className="w-full mt-4 p-3.5 bg-gradient-to-r from-neonLime to-emerald-400 text-black rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000000] cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⚡</span>
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight font-display">
              {isAr ? 'استعرض كتالوج الـ ٣٠ لعبة وتحدي' : 'Explore All 30 Mini-Games'}
            </h4>
            <p className="text-xs font-bold text-black/80">
              {isAr ? 'سرعة، ذكاء، قصف جبهات، حظ وتريفيا مصرية' : 'Reflex, Brain, Social, Chaos & Trivia'}
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-black text-neonLime flex items-center justify-center font-black">
          <Eye size={16} />
        </div>
      </motion.div>

      {/* House Rules Note for Cafés */}
      <div className="w-full mt-3 p-3.5 rounded-2xl bg-amber-400 text-black border-2 border-black shadow-brutal-sm">
        <div className="flex items-center gap-2 font-black text-xs uppercase">
          <Coffee size={16} />
          <span>{isAr ? 'قوانين قعدة الكافيه ☕' : 'Café Safe Rules ☕'}</span>
        </div>
        <p className="text-xs font-bold mt-1 text-zinc-900 leading-relaxed">
          {isAr
            ? 'اللعبة مصممة للقعدة: بدون صوت عالي، بدون ما تقوم من مكانك، والخسران بيشرب بؤ بيبسي أو ينفذ حكم ضحك!'
            : 'Seated & respectful: no shouting, no standing up, penalties are harmless soda sips or hilarious sitting dares!'}
        </p>
      </div>

      {/* FIXED BOTTOM TICKET-STUB CTA BUTTONS (Exact match of Shotgun Mobile Screenshot) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-darkBg via-darkBg/95 to-transparent z-40 max-w-md mx-auto flex flex-col gap-2.5">
        
        {/* TICKET 1: JOIN A PARTY (Cyan Ticket with Perforated Stub) */}
        <motion.button
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95, y: 2 }}
          transition={{ type: "spring", stiffness: 450, damping: 15 }}
          onClick={() => {
            sounds.playPop();
            onJoinClick();
          }}
          className="group relative w-full h-16 rounded-2xl bg-gradient-to-r from-neonCyan to-cyan-400 text-black border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center overflow-hidden cursor-pointer"
        >
          {/* Left Ticket Stub */}
          <div className="w-20 h-full border-r-[2.5px] border-black border-dashed flex flex-col items-center justify-center bg-black/10 shrink-0">
            <Ticket size={20} className="text-black" />
            <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">
              {isAr ? 'كود ١' : 'ADMIT 1'}
            </span>
          </div>

          {/* Ticket Body */}
          <div className="flex-1 px-4 text-left">
            <div className="font-black text-base uppercase tracking-tight font-display text-black">
              {isAr ? 'دخول اللعبة' : 'JOIN A PARTY'}
            </div>
            <div className="text-xs font-bold text-black/75">
              {isAr ? 'معايا كود الروم' : 'I have a code'}
            </div>
          </div>

          {/* Right Arrow Circle Button */}
          <div className="w-9 h-9 rounded-full bg-black text-neonCyan flex items-center justify-center mr-4 shrink-0 border-2 border-black group-hover:scale-110 transition-transform">
            <ArrowRight size={18} />
          </div>
        </motion.button>

        {/* TICKET 2: HOST A PARTY (Purple / Magenta VIP Ticket) */}
        <motion.button
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95, y: 2 }}
          transition={{ type: "spring", stiffness: 450, damping: 15, delay: 0.06 }}
          onClick={() => {
            sounds.playPop();
            onHostClick();
          }}
          className="group relative w-full h-16 rounded-2xl bg-gradient-to-r from-neonPurple to-neonPink text-white border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center overflow-hidden cursor-pointer"
        >
          {/* Left Ticket Stub */}
          <div className="w-20 h-full border-r-[2.5px] border-black border-dashed flex flex-col items-center justify-center bg-black/20 shrink-0">
            <Sparkles size={20} className="text-neonYellow" />
            <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">
              VIP
            </span>
          </div>

          {/* Ticket Body */}
          <div className="flex-1 px-4 text-left">
            <div className="font-black text-base uppercase tracking-tight font-display text-white">
              {isAr ? 'فتح لِمة جديدة' : 'HOST A PARTY'}
            </div>
            <div className="text-xs font-bold text-white/85">
              {isAr ? 'أنشئ الروم ووزع المهمات' : 'Start a party'}
            </div>
          </div>

          {/* Right Arrow Circle Button */}
          <div className="w-9 h-9 rounded-full bg-black text-neonLime flex items-center justify-center mr-4 shrink-0 border-2 border-black group-hover:scale-110 transition-transform">
            <ArrowRight size={18} />
          </div>
        </motion.button>

      </div>

      {/* CATALOG MODAL */}
      <GameSelectorModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        selectedGameIds={activeCatalogGames}
        onToggleGame={id => {
          if (activeCatalogGames.includes(id)) {
            if (activeCatalogGames.length > 1) {
              setActiveCatalogGames(activeCatalogGames.filter(g => g !== id));
            }
          } else {
            setActiveCatalogGames([...activeCatalogGames, id]);
          }
        }}
        onSelectAll={() => setActiveCatalogGames(MINI_GAMES.map(g => g.id))}
        onDeselectAll={() => setActiveCatalogGames([MINI_GAMES[0].id])}
      />

    </div>
  );
};
