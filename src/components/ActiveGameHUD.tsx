import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniGameMeta } from '../data/games';
import { Player } from '../types';
import { QUESTION_BANK, QuestionItem } from '../data/trivia';
import { sounds } from '../utils/audio';

interface ActiveGameHUDProps {
  game: MiniGameMeta;
  roundNumber: number;
  totalRounds: number;
  roomCode: string;
  players: Player[];
  currentPlayer: Player;
  onOpenSecretMission: () => void;
  onFinishGameRound: (loserId?: string, reason?: string) => void;
}

// Only games that naturally require a fuse / timer
const GAMES_WITH_TIMER = ['hot-potato', 'tap-frenzy', 'dont-let-go', 'whack-a-mole'];

export const ActiveGameHUD: React.FC<ActiveGameHUDProps> = ({
  game,
  roundNumber,
  totalRounds,
  roomCode,
  players,
  currentPlayer,
  onOpenSecretMission,
  onFinishGameRound,
}) => {
  const hasTimer = GAMES_WITH_TIMER.includes(game.id);
  const [timeLeft, setTimeLeft] = useState(game.durationSec);
  const [gameState, setGameState] = useState<any>({});
  
  // Multi-question state
  const [questionList, setQuestionList] = useState<QuestionItem[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionResults, setQuestionResults] = useState<(boolean | null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Speed and player answers tracking
  const questionStartTimeRef = useRef<number>(Date.now());
  const [playerAnswers, setPlayerAnswers] = useState<
    Record<string, { answered: boolean; isCorrect: boolean; timeSec: number }>
  >({});
  const [allAnswered, setAllAnswered] = useState(false);
  const [slowestThisQuestion, setSlowestThisQuestion] = useState<{ name: string; timeSec: number } | null>(null);

  // Canvas for drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');

  // COUNTDOWN TIMER LOOP (ONLY FOR GAMES THAT NATURALLY REQUIRE A TIMER!)
  useEffect(() => {
    if (!hasTimer) return;

    if (timeLeft <= 0) {
      sounds.playBuzzer();
      onFinishGameRound();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 4 && prev > 1) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onFinishGameRound, hasTimer]);

  // INITIALIZE LOGIC FOR EACH SPECIFIC MINI-GAME
  useEffect(() => {
    // 1. Question-based Games
    let poolKey: string | null = null;
    if (game.id === 'trivia-football') poolKey = 'football';
    else if (game.id === 'trivia-egyptian-media') poolKey = 'media';
    else if (game.id === 'trivia-general') poolKey = 'general';
    else if (game.id === 'true-or-false') poolKey = 'true-false';
    else if (game.id === 'quick-math') poolKey = 'math';
    else if (game.id === 'emoji-riddles') poolKey = 'emoji';
    else if (game.id === 'odd-one-out') poolKey = 'odd-one-out';
    else if (game.id === 'big-fat-lie') poolKey = 'big-fat-lie';
    else if (game.id === 'close-call') poolKey = 'close-call';

    if (poolKey && QUESTION_BANK[poolKey]) {
      const shuffled = [...QUESTION_BANK[poolKey]].sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuestionList(shuffled);
      setQuestionIndex(0);
      setQuestionResults(new Array(shuffled.length).fill(null));
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setAllAnswered(false);
      setSlowestThisQuestion(null);

      // Initialize answers tracking
      const initialMap: Record<string, any> = {};
      players.forEach(p => {
        initialMap[p.id] = { answered: false, isCorrect: false, timeSec: 0 };
      });
      setPlayerAnswers(initialMap);
      questionStartTimeRef.current = Date.now();
    } 
    // 2. Stop at 10
    else if (game.id === 'stop-at-10') {
      setGameState({ running: false, startTime: 0, elapsed: 0, stoppedAt: null });
    } 
    // 3. Tap Frenzy
    else if (game.id === 'tap-frenzy') {
      setGameState({ count: 0 });
    } 
    // 4. Tap Race
    else if (game.id === 'tap-race') {
      const waitMs = 2000 + Math.random() * 3000;
      setGameState({ ready: false, green: false, tapped: false, reactionTime: null, greenTime: 0 });
      const greenTimeout = setTimeout(() => {
        setGameState((s: any) => ({ ...s, green: true, greenTime: Date.now() }));
        sounds.playPop();
      }, waitMs);
      return () => clearTimeout(greenTimeout);
    } 
    // 5. Don't Let Go
    else if (game.id === 'dont-let-go') {
      setGameState({ holding: false, heldDuration: 0, failed: false, succeeded: false });
    }
    // 6. Whack a Mole
    else if (game.id === 'whack-a-mole') {
      setGameState({ holes: [false, false, false, false, false, false], isBomb: [false, false, false, false, false, false], score: 0 });
      const interval = setInterval(() => {
        const randIdx = Math.floor(Math.random() * 6);
        const isBomb = Math.random() > 0.75;
        setGameState((s: any) => {
          const nextHoles = [false, false, false, false, false, false];
          const nextBombs = [false, false, false, false, false, false];
          nextHoles[randIdx] = true;
          nextBombs[randIdx] = isBomb;
          return { ...s, holes: nextHoles, isBomb: nextBombs };
        });
      }, 850);
      return () => clearInterval(interval);
    }
    // 7. Snap!
    else if (game.id === 'snap') {
      const emojis = ['🍕', '⚽', '🚀', '💎', '👑', '🍔'];
      setGameState({ currentEmoji: emojis[0], prevEmoji: '', isMatch: false, slapped: false, won: false });
      const interval = setInterval(() => {
        setGameState((s: any) => {
          const nextEmoji = Math.random() > 0.65 && s.currentEmoji ? s.currentEmoji : emojis[Math.floor(Math.random() * emojis.length)];
          const match = nextEmoji === s.currentEmoji;
          sounds.playPop();
          return { ...s, prevEmoji: s.currentEmoji, currentEmoji: nextEmoji, isMatch: match };
        });
      }, 900);
      return () => clearInterval(interval);
    }
    // 8. Quick Draw
    else if (game.id === 'quick-draw') {
      const waitMs = 2500 + Math.random() * 3000;
      setGameState({ steady: true, draw: false, shot: false, reactionTime: 0 });
      const drawTimer = setTimeout(() => {
        setGameState((s: any) => ({ ...s, steady: false, draw: true, drawTime: Date.now() }));
        sounds.playPop();
      }, waitMs);
      return () => clearTimeout(drawTimer);
    }
    // 9. Colour Clash
    else if (game.id === 'colour-clash') {
      const colors = [
        { name: 'أحمر', hex: '#FF2A85' },
        { name: 'أزرق', hex: '#00E5FF' },
        { name: 'أخضر', hex: '#CCFF00' },
        { name: 'أصفر', hex: '#FFE600' },
      ];
      const wordIdx = Math.floor(Math.random() * colors.length);
      const inkIdx = (wordIdx + 1 + Math.floor(Math.random() * 3)) % colors.length;
      setGameState({
        colors,
        word: colors[wordIdx].name,
        inkColor: colors[inkIdx].hex,
        correctColor: colors[inkIdx].name,
        score: 0,
        answered: false,
      });
    }
    // 10. Simon Says
    else if (game.id === 'simon-says') {
      const pattern = [0, 1, 2].map(() => Math.floor(Math.random() * 4));
      setGameState({ pattern, playerInput: [], activePad: null, phase: 'show', success: false });
    }
    // 11. Count It
    else if (game.id === 'count-it') {
      const targetCount = 6 + Math.floor(Math.random() * 6);
      const icons = new Array(targetCount).fill('🍕');
      setGameState({ icons, count: targetCount, visible: true, chosen: null });
      const timer = setTimeout(() => {
        setGameState((s: any) => ({ ...s, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
    // 12. Most Likely To
    else if (game.id === 'most-likely-to') {
      const prompts = [
        'مين أكتر واحد لو الحساب جه هيعمل نفسه بيتكلم في التليفون؟ 📱',
        'مين أكتر واحد هيضيع باسبوره ومحفظته في المطار؟ ✈️',
        'مين أكتر واحد هينام في نص الفيلم في السينما؟ 🍿',
        'مين أكتر واحد هيعمل مصيبة ويفضل بارد ولا كأنه عمل حاجة؟ 🕶️',
        'مين أكتر واحد ممكن يتجوز في السر من غير ما يقول للصحاب؟ 💍',
      ];
      setGameState({ prompt: prompts[Math.floor(Math.random() * prompts.length)], votedFor: null });
    } 
    // 13. Would You Rather
    else if (game.id === 'would-you-rather') {
      const pairs = [
        { a: 'تاكل كشري بسكر طول حياتك 🥣', b: 'تشرب شاي عليه ملح كل يوم ☕' },
        { a: 'تفضل لابس شتوي في عز الصيف ☀️', b: 'تفضل لابس مايوه في عز الشتا ❄️' },
        { a: 'موبايلك يفضل على 1% شحن دايماً 🪫', b: 'النت يفضل بطيء زي زمان 🐢' },
      ];
      setGameState({ pair: pairs[Math.floor(Math.random() * pairs.length)], votedSide: null });
    }
    // 14. Hot Take
    else if (game.id === 'hot-take') {
      const takes = [
        'البيتزا الباردة تاني يوم الصبح أحلى من البيتزا السخنة الطازة! 🍕',
        'الصيف بكل حرّه أحسن مليون مرة من كآبة وبرد الشتا! ☀️',
        'الأهلي والزمالك بيخسروا متعة الماتش بسبب التعصب! ⚽',
      ];
      setGameState({ take: takes[Math.floor(Math.random() * takes.length)], rating: 5, voted: false });
    }
    // 15. Herd Mentality
    else if (game.id === 'herd-mentality') {
      setGameState({
        prompt: 'أكتر أكلة شعبية بتتاكل بالعيش عند كل المصريين؟ 🥖',
        options: ['طعمية وسلطة', 'فول مدمس بالزيت الحار', 'جبنة قديمة وبطيخ', 'شكشوكة وبيض'],
        chosen: null,
      });
    }
    // 16. Imposter
    else if (game.id === 'imposter') {
      const words = ['كشري مصري', 'أهرامات الجيزة', 'شيشة تفاح', 'ساندوتش كبدة', 'برج القاهرة'];
      const secretWord = words[Math.floor(Math.random() * words.length)];
      const isImposter = Math.random() > 0.6;
      setGameState({ secretWord, isImposter, voted: null });
    }
    // 17. Quip Clash
    else if (game.id === 'quip-clash') {
      setGameState({
        prompt: 'إفيه تقوله لما الويتر يجيب الحساب ويطلع أغلى مما اتفقتوا؟ 🧾',
        options: [
          'هو أنتوا حاسبين إيجار المحل في الشيك ولا إيه؟ 😂',
          'طب سيبوا غسيل المواعين عليا وأنا مسامح في الباقي!',
          'معلش هو الحساب ده بالجنيه المصري ولا الاسترليني؟',
          'طب هاتولي رقم صاحب الكافيه أباركله ع الثروة دي!',
        ],
        chosen: null,
      });
    }
    // 18. Hot Potato
    else if (game.id === 'hot-potato') {
      setGameState({ hasBomb: true, exploded: false, passes: 0 });
    }
    // 19. Shell Shock
    else if (game.id === 'shell-shock') {
      setGameState({ prizeCup: Math.floor(Math.random() * 3), shuffling: true, pickedCup: null });
      setTimeout(() => {
        setGameState((s: any) => ({ ...s, shuffling: false }));
      }, 2500);
    }
    // 20. Musical Chairs
    else if (game.id === 'musical-chairs') {
      const waitMs = 2000 + Math.random() * 3500;
      setGameState({ musicPlaying: true, chairAvailable: false, satDown: false });
      const chairTimer = setTimeout(() => {
        setGameState((s: any) => ({ ...s, musicPlaying: false, chairAvailable: true }));
        sounds.playPop();
      }, waitMs);
      return () => clearTimeout(chairTimer);
    }
    // 21. Lone Wolf
    else if (game.id === 'lone-wolf') {
      setGameState({ chosenNumber: null, revealed: false });
    }
    // 22. Rock Paper Royale
    else if (game.id === 'rock-paper-royale') {
      setGameState({ playerChoice: null, opponentChoice: null, result: null });
    }
    // 23. Roulette
    else if (game.id === 'roulette') {
      setGameState({ spinning: false, victim: null });
    }
  }, [game.id, players]);

  // RESET TIMER & ANSWER TRACKING ON QUESTION INDEX CHANGE
  useEffect(() => {
    if (questionList.length > 0) {
      questionStartTimeRef.current = Date.now();
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setAllAnswered(false);
      setSlowestThisQuestion(null);

      const map: Record<string, any> = {};
      players.forEach(p => {
        map[p.id] = { answered: false, isCorrect: false, timeSec: 0 };
      });
      setPlayerAnswers(map);
    }
  }, [questionIndex, questionList.length]);

  // HANDLE CURRENT PLAYER'S ANSWER & COLLECT ALL PLAYERS' ANSWERS TO DETERMINE WHO WAS FASTER
  const handleSelectAnswer = (option: string) => {
    if (isAnswerRevealed || questionIndex >= questionList.length) return;

    const myResponseSec = (Date.now() - questionStartTimeRef.current) / 1000;
    const currentQ = questionList[questionIndex];
    const isCorrect = option === currentQ.correctAnswer;
    
    setSelectedOption(option);
    setIsAnswerRevealed(true);

    if (isCorrect) sounds.playVictory();
    else sounds.playBuzzer();

    // Mark current player's response
    setPlayerAnswers(prev => ({
      ...prev,
      [currentPlayer.id]: { answered: true, isCorrect, timeSec: myResponseSec },
    }));

    setQuestionResults(prev => {
      const next = [...prev];
      next[questionIndex] = isCorrect;
      return next;
    });

    // Simulate other players submitting their answers
    const otherPlayers = players.filter(p => p.id !== currentPlayer.id);
    let completedCount = 1;

    if (otherPlayers.length === 0) {
      // Solo player
      setTimeout(() => advanceToNextQuestion(), 1400);
      return;
    }

    otherPlayers.forEach((other, idx) => {
      const extraDelay = 500 + Math.random() * 1200 + idx * 300;
      const otherTimeSec = myResponseSec + extraDelay / 1000;
      const otherIsCorrect = Math.random() > 0.35; // realistic 65% correct

      setTimeout(() => {
        setPlayerAnswers(prev => {
          const updated = {
            ...prev,
            [other.id]: { answered: true, isCorrect: otherIsCorrect, timeSec: otherTimeSec },
          };
          return updated;
        });

        completedCount += 1;
        sounds.playPop();

        // When all players have answered this question
        if (completedCount >= players.length) {
          setAllAnswered(true);

          // Find the slowest player for this question
          setTimeout(() => {
            setPlayerAnswers(finalAnswers => {
              const answersArray = Object.entries(finalAnswers).map(([pid, a]) => {
                const pObj = players.find(p => p.id === pid);
                return { id: pid, name: pObj?.name || 'لاعب', ...a };
              });

              // Slowest answerer
              const sorted = [...answersArray].sort((a, b) => b.timeSec - a.timeSec);
              const slowest = sorted[0];
              if (slowest) {
                setSlowestThisQuestion({ name: slowest.name, timeSec: slowest.timeSec });
              }

              return finalAnswers;
            });

            // Advance to next question or finalize round
            setTimeout(() => {
              advanceToNextQuestion();
            }, 1800);
          }, 300);
        }
      }, extraDelay);
    });
  };

  const advanceToNextQuestion = () => {
    if (questionIndex + 1 < questionList.length) {
      setQuestionIndex(i => i + 1);
    } else {
      // Question set complete! Calculate overall round loser
      const otherPlayers = players.filter(p => p.id !== currentPlayer.id);
      const candidates = otherPlayers.length > 0 ? otherPlayers : [currentPlayer];
      const loser = candidates[Math.floor(Math.random() * candidates.length)];
      onFinishGameRound(loser.id, `${loser.name} كان أبطأ لاعب في الإجابات!`);
    }
  };

  // Specific Game Handlers
  const handleStopAt10Start = () => {
    sounds.playPop();
    setGameState({ running: true, startTime: Date.now(), stoppedAt: null });
  };

  const handleStopAt10Stop = () => {
    const elapsedSec = (Date.now() - gameState.startTime) / 1000;
    const diff = Math.abs(10.0 - elapsedSec);
    sounds.playVictory();
    setGameState({ running: false, stoppedAt: elapsedSec, diff });
    const loser = diff > 0.8 ? currentPlayer : (players.find(p => p.id !== currentPlayer.id) || currentPlayer);
    setTimeout(() => onFinishGameRound(loser.id, `${loser.name} كان الأبعد عن ١٠ ثواني بالظبط!`), 2000);
  };

  const handleTapFrenzy = () => {
    sounds.playPop();
    setGameState((s: any) => ({ ...s, count: (s.count || 0) + 1 }));
  };

  const handleTapRace = () => {
    if (!gameState.green) {
      sounds.playBuzzer();
      setGameState((s: any) => ({ ...s, falseStart: true }));
      setTimeout(() => onFinishGameRound(currentPlayer.id, `${currentPlayer.name} استعجل وداس قبل اللون الأخضر!`), 1500);
    } else if (!gameState.tapped) {
      const reactionTime = Date.now() - gameState.greenTime;
      sounds.playVictory();
      setGameState((s: any) => ({ ...s, tapped: true, reactionTime }));
      const otherPlayer = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
      setTimeout(() => onFinishGameRound(otherPlayer.id, `${otherPlayer.name} كان أبطأ لمسة على الشاشة!`), 1800);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sounds.playPop();
  };

  const isQuestionMode = questionList.length > 0;
  const currentQuestion = questionList[questionIndex];

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen px-4 pb-28 flex flex-col items-center">
      
      {/* Top HUD Pill */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex items-center justify-between py-2 z-20"
      >
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border-2 border-black rounded-full text-xs font-mono font-bold text-zinc-300 shadow-brutal-sm">
          <span>{roomCode}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-neonCyan">جولة {roundNumber}/{totalRounds}</span>
        </div>

        {/* Live Score Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black text-neonLime border-2 border-black rounded-full text-xs font-black shadow-brutal-sm">
          <span>🎯</span>
          <span>{currentPlayer.score} نقطة</span>
        </div>

        {/* Header Right: Timer Ring (ONLY IF GAME REQUIRES TIMER) OR Speed Mode Pill */}
        {hasTimer ? (
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-11 h-11 transform -rotate-90">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#27272a"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke={timeLeft <= 4 ? '#FF2A85' : '#CCFF00'}
                strokeWidth="4"
                fill="none"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * timeLeft) / game.durationSec}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="absolute font-mono font-black text-xs text-white">
              {timeLeft}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-neonCyan/20 text-neonCyan border border-neonCyan/50 rounded-full text-xs font-black shadow-sm">
            <span>⚡ أسرع إجابة</span>
          </div>
        )}
      </motion.div>

      {/* Mini-Game Name Header */}
      <div className="w-full flex items-center justify-between my-1">
        {/* Multi-Question Dots Indicator */}
        {isQuestionMode ? (
          <div className="flex items-center gap-1.5" dir="ltr">
            {questionList.map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === questionIndex ? 1.3 : 1 }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  questionResults[i] === true
                    ? 'bg-neonLime'
                    : questionResults[i] === false
                    ? 'bg-rose-500'
                    : i === questionIndex
                    ? 'bg-white ring-2 ring-neonCyan'
                    : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        ) : <div />}

        <span className="text-xs font-mono font-black uppercase tracking-wider text-neonLime flex items-center gap-1">
          <span>{game.emoji}</span>
          <span>{game.arabicName}</span>
        </span>
      </div>

      {/* DYNAMIC MINI-GAME INTERACTION CONTAINER */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-2">
        
        {/* 1. MULTI-QUESTION TRIVIA / TRUE-FALSE / MATH / EMOJI / ODD-ONE-OUT / BIG-FAT-LIE (NO TIMER - EVERYONE ANSWERS & FASTEST CALCULATED!) */}
        {isQuestionMode && currentQuestion && (
          <div className="w-full flex flex-col items-center" style={{ perspective: 1000 }}>
            
            {/* 3D Flipping Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={questionIndex}
                initial={{ rotateY: 90, scale: 0.85, opacity: 0 }}
                animate={{ 
                  rotateY: 0, 
                  scale: 1, 
                  opacity: 1,
                  x: isAnswerRevealed && selectedOption !== currentQuestion.correctAnswer ? [-6, 6, -4, 4, 0] : 0
                }}
                exit={{ rotateY: -90, scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className={`w-full bg-white text-black p-5 rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_#000000] mb-3 text-center transition-colors ${
                  isAnswerRevealed
                    ? selectedOption === currentQuestion.correctAnswer
                      ? 'border-neonLime'
                      : 'border-rose-500'
                    : ''
                }`}
              >
                <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block mb-1">
                  سؤال {questionIndex + 1} من {questionList.length} · الكل يجاوب ⚡
                </span>
                <h3 className="font-black text-xl sm:text-2xl text-zinc-900 leading-snug">
                  {currentQuestion.question}
                </h3>
              </motion.div>
            </AnimatePresence>

            {/* Answer Options */}
            <div className="w-full grid grid-cols-2 gap-2.5">
              {(currentQuestion.options || ['صح', 'هبد']).map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQuestion.correctAnswer;

                return (
                  <motion.button
                    key={opt}
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 450, damping: 15, delay: idx * 0.04 }}
                    onClick={() => handleSelectAnswer(opt)}
                    disabled={isAnswerRevealed}
                    className={`p-3.5 rounded-2xl font-black text-sm text-center border-[2.5px] border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAnswerRevealed
                        ? isCorrect
                          ? 'bg-neonLime text-black shadow-brutal scale-102 ring-2 ring-white'
                          : isSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 opacity-60'
                        : 'bg-white text-black shadow-brutal-sm hover:bg-zinc-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {isAnswerRevealed && isCorrect && <span>✓</span>}
                    {isAnswerRevealed && isSelected && !isCorrect && <span>✕</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* LIVE PLAYER SPEED STATUS STRIP (CALCULATES WHO ANSWERED FASTER!) */}
            <div className="w-full bg-zinc-900/90 p-3 rounded-2xl border-2 border-black mt-3 shadow-brutal-sm">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-400 mb-2">
                <span className="flex items-center gap-1">
                  <span>⚡</span>
                  <span>سرعة الإجابة بين الصحاب:</span>
                </span>
                <span className="text-neonCyan font-black">
                  {Object.values(playerAnswers).filter(a => a.answered).length}/{players.length} جاوبوا
                </span>
              </div>

              {/* Player Badges with Reaction Times */}
              <div className="flex flex-wrap items-center gap-1.5">
                {players.map(p => {
                  const ans = playerAnswers[p.id];
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-black transition-all ${
                        ans?.answered
                          ? ans.isCorrect
                            ? 'bg-neonLime text-black border-black'
                            : 'bg-rose-500 text-white border-black'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                    >
                      <span>{p.sticker}</span>
                      <span className="truncate max-w-[65px]">{p.name}</span>
                      {ans?.answered ? (
                        <span className="font-mono text-[10px]">
                          ({ans.timeSec.toFixed(2)}s)
                        </span>
                      ) : (
                        <span className="text-[10px] animate-pulse">بيفكر...</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Slowest Player Callout */}
              {slowestThisQuestion && (
                <div className="mt-2 pt-2 border-t border-zinc-800 text-center text-xs font-black text-rose-400 flex items-center justify-center gap-1 animate-pulse">
                  <span>🐢</span>
                  <span>أبطأ إجابة: {slowestThisQuestion.name} ({slowestThisQuestion.timeSec.toFixed(2)} ثانية)</span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. STOP AT 10 (NO TIMER - PLAYERS STOP WHEN READY) */}
        {game.id === 'stop-at-10' && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-full bg-white text-black p-6 rounded-3xl border-[3px] border-black shadow-brutal-lg mb-6">
              <span className="text-xs font-mono font-black uppercase text-zinc-500">
                العداد الأعمى
              </span>
              <div className="text-5xl font-mono font-black tracking-widest my-3">
                {gameState.stoppedAt !== null
                  ? `${gameState.stoppedAt.toFixed(2)}s`
                  : gameState.running
                  ? '??.??s'
                  : '00.00s'}
              </div>
              <p className="text-xs font-bold text-zinc-600">
                {gameState.stoppedAt !== null
                  ? `الفرق: ${gameState.diff.toFixed(2)} ثانية! 🔥`
                  : 'دوس ابدأ وعد لعشرة في سرك.. الأرقام هتختفي بعد ثواني!'}
              </p>
            </div>

            {!gameState.running && gameState.stoppedAt === null ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleStopAt10Start}
                className="w-full py-4 rounded-2xl bg-neonLime text-black font-black text-xl border-[3px] border-black shadow-brutal cursor-pointer"
              >
                ابدأ العد ⏱️
              </motion.button>
            ) : gameState.running ? (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleStopAt10Stop}
                className="w-full py-5 rounded-2xl bg-rose-500 text-white font-black text-2xl border-[3px] border-black shadow-brutal animate-pulse cursor-pointer"
              >
                وقّف الآن! 🛑
              </motion.button>
            ) : (
              <div className="px-6 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-neonCyan font-bold text-sm">
                تم التسجيل! في انتظار باقي الترابيزة...
              </div>
            )}
          </div>
        )}

        {/* 3. TAP FRENZY (HAS 6-SECOND FRENZY TIMER!) */}
        {game.id === 'tap-frenzy' && (
          <div className="w-full h-80 flex flex-col items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleTapFrenzy}
              className="w-full h-full rounded-3xl bg-[#FF6B00] text-white border-[3px] border-black shadow-brutal-lg flex flex-col items-center justify-center select-none cursor-pointer"
            >
              <span className="text-7xl font-mono font-black text-white drop-shadow-[4px_4px_0px_#000000]">
                {gameState.count || 0}
              </span>
              <span className="font-display font-black text-xl uppercase tracking-wider text-black mt-2">
                DUS DUS! (دوس بسرعة) 🔥
              </span>
            </motion.button>
          </div>
        )}

        {/* 4. TAP RACE (NO TIMER - REACTION WAIT) */}
        {game.id === 'tap-race' && (
          <div className="w-full h-80 flex flex-col items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleTapRace}
              className={`w-full h-full rounded-3xl border-[3px] border-black shadow-brutal-lg flex flex-col items-center justify-center transition-colors cursor-pointer ${
                gameState.falseStart
                  ? 'bg-zinc-800 text-zinc-500'
                  : gameState.tapped
                  ? 'bg-neonCyan text-black'
                  : gameState.green
                  ? 'bg-neonLime text-black animate-pulse'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {gameState.falseStart ? (
                <span className="font-display font-black text-2xl">استعجلت! غلطة ❌</span>
              ) : gameState.tapped ? (
                <div>
                  <span className="text-4xl font-mono font-black">{gameState.reactionTime}ms</span>
                  <p className="text-sm font-bold mt-1">سرعة استجابة ممتازة! ⚡</p>
                </div>
              ) : gameState.green ? (
                <span className="font-display font-black text-4xl">المس الشاشة فوراً! ⚡</span>
              ) : (
                <span className="font-display font-black text-2xl">استنى لما تقلب أخضر... 🔴</span>
              )}
            </motion.button>
          </div>
        )}

        {/* 5. DON'T LET GO (HAS TIMER) */}
        {game.id === 'dont-let-go' && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="mb-4">
              <h3 className="font-black text-xl text-white">ثبت صباعك على الدايرة واوعى تسيب!</h3>
              <p className="text-xs text-zinc-400">لو رفعت صباعك قبل انتهاء الوقت هتشرب فوراً.</p>
            </div>

            <div
              onMouseDown={() => {
                sounds.playPop();
                setGameState({ holding: true });
              }}
              onMouseUp={() => {
                if (gameState.holding && timeLeft > 1) {
                  sounds.playBuzzer();
                  setGameState({ holding: false, failed: true });
                  setTimeout(() => onFinishGameRound(currentPlayer.id, `${currentPlayer.name} رفع صباعه قبل الوقت!`), 1500);
                }
              }}
              onTouchStart={() => {
                sounds.playPop();
                setGameState({ holding: true });
              }}
              onTouchEnd={() => {
                if (gameState.holding && timeLeft > 1) {
                  sounds.playBuzzer();
                  setGameState({ holding: false, failed: true });
                  setTimeout(() => onFinishGameRound(currentPlayer.id, `${currentPlayer.name} رفع صباعه قبل الوقت!`), 1500);
                }
              }}
              className={`w-64 h-64 rounded-full border-[4px] border-black flex flex-col items-center justify-center select-none cursor-pointer transition-all ${
                gameState.failed
                  ? 'bg-rose-600 text-white'
                  : gameState.holding
                  ? 'bg-neonLime text-black scale-105 shadow-brutal-lg ring-4 ring-white animate-pulse'
                  : 'bg-neonCyan text-black shadow-brutal'
              }`}
            >
              {gameState.failed ? (
                <span className="font-black text-xl">رفعت صباعك! خسرت ❌</span>
              ) : gameState.holding ? (
                <span className="font-black text-2xl">مثبت تمام.. اوعى ترفع! ✋</span>
              ) : (
                <span className="font-black text-2xl">حط صباعك هنا وخليك دايس! 👆</span>
              )}
            </div>
          </div>
        )}

        {/* 6. WHACK-A-MOLE (HAS TIMER) */}
        {game.id === 'whack-a-mole' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-between w-full px-2 mb-3">
              <span className="text-xs font-mono font-bold text-zinc-400">اصطاد الأرانب وابعد عن القنابل!</span>
              <span className="px-3 py-1 bg-neonLime text-black font-black text-xs rounded-full border-2 border-black">
                النقاط: {gameState.score || 0}
              </span>
            </div>

            <div className="w-full grid grid-cols-3 gap-3">
              {(gameState.holes || [false, false, false, false, false, false]).map((hasTarget: boolean, idx: number) => {
                const isBomb = gameState.isBomb && gameState.isBomb[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!hasTarget) return;
                      if (isBomb) {
                        sounds.playBuzzer();
                        setGameState((s: any) => ({ ...s, score: Math.max(0, s.score - 2) }));
                      } else {
                        sounds.playPop();
                        setGameState((s: any) => ({ ...s, score: (s.score || 0) + 1 }));
                      }
                    }}
                    className={`h-24 rounded-2xl border-[3px] border-black flex items-center justify-center text-4xl transition-all cursor-pointer ${
                      hasTarget
                        ? isBomb
                          ? 'bg-rose-500 shadow-brutal animate-bounce'
                          : 'bg-neonLime shadow-brutal scale-105'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    {hasTarget ? (isBomb ? '💣' : '🐹') : '🕳️'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. SNAP! (NO TIMER - DUEL) */}
        {game.id === 'snap' && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="mb-3">
              <span className="text-xs font-mono font-bold text-zinc-400">لو الشكل اتكرر مرتين ورا بعض.. اضرب فوراً!</span>
            </div>

            <div className="w-48 h-56 rounded-3xl bg-white text-black border-[3px] border-black shadow-brutal-lg flex items-center justify-center text-7xl mb-5">
              {gameState.currentEmoji || '🃏'}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (gameState.isMatch) {
                  sounds.playVictory();
                  setGameState((s: any) => ({ ...s, slapped: true, won: true }));
                  const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                  setTimeout(() => onFinishGameRound(other.id, `${other.name} مالحقش يضرب الكارت!`), 1500);
                } else {
                  sounds.playBuzzer();
                  setGameState((s: any) => ({ ...s, slapped: true, won: false }));
                  setTimeout(() => onFinishGameRound(currentPlayer.id, `${currentPlayer.name} استعجل وضرب ومفيش تطابق!`), 1500);
                }
              }}
              className="w-full py-4 rounded-2xl bg-rose-500 text-white font-black text-2xl uppercase border-[3px] border-black shadow-brutal cursor-pointer"
            >
              {gameState.slapped
                ? gameState.won
                  ? 'ضربت صح! كسبت! 🏆'
                  : 'استعجلت.. مفيش تطابق! ❌'
                : 'SLAP! اضرب الآن 💥'}
            </motion.button>
          </div>
        )}

        {/* 8. QUICK DRAW (NO TIMER - DUEL) */}
        {game.id === 'quick-draw' && (
          <div className="w-full h-80 flex flex-col items-center justify-center text-center">
            {gameState.steady ? (
              <div className="w-full h-full rounded-3xl bg-zinc-900 border-[3px] border-black flex flex-col items-center justify-center p-6">
                <span className="text-6xl mb-3">🤠</span>
                <h3 className="font-black text-2xl text-neonYellow">STEADY...</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">اثبت.. أول ما كلمة DRAW تظهر دوس بأقصى سرعة!</p>
              </div>
            ) : gameState.draw && !gameState.shot ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const reaction = Date.now() - gameState.drawTime;
                  sounds.playVictory();
                  setGameState((s: any) => ({ ...s, shot: true, reactionTime: reaction }));
                  const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                  setTimeout(() => onFinishGameRound(other.id, `${other.name} كان أبطأ في ضرب النار!`), 1800);
                }}
                className="w-full h-full rounded-3xl bg-rose-500 text-white border-[3px] border-black shadow-brutal-lg flex flex-col items-center justify-center cursor-pointer animate-pulse"
              >
                <span className="text-7xl font-mono font-black">DRAW! 💥</span>
                <span className="font-black text-lg text-black mt-2">اضرب فوراً! 🔫</span>
              </motion.button>
            ) : (
              <div className="w-full h-full rounded-3xl bg-neonLime text-black border-[3px] border-black flex flex-col items-center justify-center p-6">
                <span className="text-5xl font-mono font-black">{gameState.reactionTime}ms</span>
                <p className="font-black text-lg mt-1">طلقة حاسمة وسريعة! 🎯</p>
              </div>
            )}
          </div>
        )}

        {/* 9. COLOUR CLASH (NO TIMER - SPEED TEST) */}
        {game.id === 'colour-clash' && (
          <div className="w-full flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-zinc-400 mb-2">دوس على لون الكلمة مش معناها!</span>
            
            <div className="w-full bg-white p-6 rounded-3xl border-[3px] border-black shadow-brutal-lg mb-4">
              <h2
                className="text-5xl font-black font-display uppercase tracking-wider"
                style={{ color: gameState.inkColor }}
              >
                {gameState.word}
              </h2>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              {(gameState.colors || []).map((c: any) => (
                <button
                  key={c.name}
                  onClick={() => {
                    const isCorrect = c.name === gameState.correctColor;
                    if (isCorrect) sounds.playVictory();
                    else sounds.playBuzzer();
                    const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                    const loser = isCorrect ? other : currentPlayer;
                    setTimeout(() => onFinishGameRound(loser.id, `${loser.name} اتلخبط في لون الكلمة!`), 1200);
                  }}
                  className="p-4 rounded-2xl font-black text-lg border-[2.5px] border-black shadow-brutal-sm cursor-pointer"
                  style={{ backgroundColor: c.hex, color: '#000000' }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 10. SIMON SAYS (NO TIMER - MEMORY) */}
        {game.id === 'simon-says' && (
          <div className="w-full flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-zinc-400 mb-3">احفظ النمط وكرره بالظبط!</span>

            <div className="w-64 h-64 grid grid-cols-2 gap-3">
              {['#CCFF00', '#00E5FF', '#FFE600', '#FF2A85'].map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playPop();
                    const nextInput = [...(gameState.playerInput || []), idx];
                    setGameState((s: any) => ({ ...s, playerInput: nextInput }));
                    if (nextInput.length === (gameState.pattern || []).length) {
                      sounds.playVictory();
                      const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                      setTimeout(() => onFinishGameRound(other.id, `${other.name} غلط في حفظ النمط!`), 1200);
                    }
                  }}
                  className="rounded-2xl border-[3px] border-black shadow-brutal active:scale-90 cursor-pointer transition-transform"
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 11. COUNT IT (4-SEC FLASH MEMORY) */}
        {game.id === 'count-it' && (
          <div className="w-full flex flex-col items-center text-center">
            {gameState.visible ? (
              <div className="w-full bg-white text-black p-6 rounded-3xl border-[3px] border-black shadow-brutal-lg flex flex-wrap items-center justify-center gap-3 min-h-[180px]">
                {(gameState.icons || []).map((ic: string, i: number) => (
                  <span key={i} className="text-3xl animate-pulse">{ic}</span>
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="w-full bg-zinc-900 text-white p-5 rounded-3xl border-2 border-black mb-4">
                  <h3 className="font-black text-xl">كام بيتزا شوفتها من شوية؟</h3>
                </div>

                <div className="w-full grid grid-cols-4 gap-2">
                  {(() => {
                    const cnt = typeof gameState.count === 'number' ? gameState.count : 7;
                    return [cnt - 1, cnt, cnt + 1, cnt + 2].map(num => (
                      <button
                        key={num}
                        onClick={() => {
                          const isRight = num === gameState.count;
                          if (isRight) sounds.playVictory();
                          else sounds.playBuzzer();
                          const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                          const loser = isRight ? other : currentPlayer;
                          setTimeout(() => onFinishGameRound(loser.id, `${loser.name} غلط في عد الأشكال!`), 1200);
                        }}
                        className="p-4 bg-white text-black font-black text-xl rounded-2xl border-2 border-black shadow-brutal cursor-pointer"
                      >
                        {num}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 12. DRAWING / DOODLE DUEL (NO TIMER) */}
        {(game.id === 'doodle-duel' || game.id === 'drunk-telephone') && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-white rounded-3xl border-[3px] border-black shadow-brutal-lg overflow-hidden mb-3">
              <div className="p-2 bg-neonYellow border-b-2 border-black text-center font-black text-xs text-black">
                المطلوب رسمه: كشري مصري مع شطة 🥣🌶️
              </div>
              <canvas
                ref={canvasRef}
                width={340}
                height={230}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-56 bg-white touch-none cursor-crosshair"
              />
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {['#000000', '#FF2A85', '#CCFF00', '#00E5FF'].map(c => (
                  <button
                    key={c}
                    onClick={() => setBrushColor(c)}
                    className={`w-7 h-7 rounded-full border-2 border-black cursor-pointer ${brushColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1 bg-zinc-800 text-white font-bold text-xs rounded-full border border-zinc-700 mr-2 cursor-pointer"
                >
                  مسح 🗑️
                </button>
              </div>

              <button
                onClick={() => {
                  sounds.playVictory();
                  const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                  onFinishGameRound(other.id, `تم التصويت لرسمتك!`);
                }}
                className="px-4 py-2 bg-neonLime text-black font-black text-xs rounded-xl border-2 border-black shadow-brutal-sm cursor-pointer"
              >
                خلصت الرسمة! 🎨
              </button>
            </div>
          </div>
        )}

        {/* 13. MOST LIKELY TO (NO TIMER) */}
        {game.id === 'most-likely-to' && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-neonPink text-white p-5 rounded-3xl border-[3px] border-black shadow-brutal-lg mb-4 text-center">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-black/80 block mb-1">
                مين أكتر واحد؟ (الكل بيصوت 🗳️)
              </span>
              <h3 className="font-black text-xl text-white leading-snug">
                {gameState.prompt}
              </h3>
            </div>

            <div className="w-full grid grid-cols-2 gap-2.5">
              {players.map((p) => (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    sounds.playPop();
                    setGameState((s: any) => ({ ...s, votedFor: p.id }));
                    setTimeout(() => onFinishGameRound(p.id, `أكتر واحد أخد أصوات من الترابيزة: ${p.name}!`), 1400);
                  }}
                  className={`p-3 rounded-2xl border-2 border-black flex items-center gap-2 font-black text-xs cursor-pointer ${
                    gameState.votedFor === p.id
                      ? 'bg-white text-black shadow-brutal ring-2 ring-neonLime'
                      : 'bg-zinc-900 text-zinc-200'
                  }`}
                >
                  <span className="text-lg">{p.sticker}</span>
                  <span className="truncate">{p.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* 14. WOULD YOU RATHER (NO TIMER) */}
        {game.id === 'would-you-rather' && gameState.pair && (
          <div className="w-full flex flex-col gap-3">
            <div className="text-center text-xs font-bold text-zinc-400 mb-1">
              اختار جانبك.. الأقلية على الترابيزة بتشرب! 🥤
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sounds.playPop();
                setGameState((s: any) => ({ ...s, votedSide: 'a' }));
                const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                setTimeout(() => onFinishGameRound(other.id, `اختار الجانب الخاسر في لو خيروك!`), 1300);
              }}
              className={`w-full p-5 rounded-3xl border-[3px] border-black text-center font-black text-base cursor-pointer ${
                gameState.votedSide === 'a'
                  ? 'bg-neonCyan text-black shadow-brutal'
                  : 'bg-zinc-900 text-white'
              }`}
            >
              {gameState.pair.a}
            </motion.button>

            <div className="text-center font-display font-black text-xs text-zinc-500 uppercase">
              أو (OR)
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sounds.playPop();
                setGameState((s: any) => ({ ...s, votedSide: 'b' }));
                const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                setTimeout(() => onFinishGameRound(other.id, `اختار الجانب الخاسر في لو خيروك!`), 1300);
              }}
              className={`w-full p-5 rounded-3xl border-[3px] border-black text-center font-black text-base cursor-pointer ${
                gameState.votedSide === 'b'
                  ? 'bg-neonYellow text-black shadow-brutal'
                  : 'bg-zinc-900 text-white'
              }`}
            >
              {gameState.pair.b}
            </motion.button>
          </div>
        )}

        {/* 15. HOT TAKE (NO TIMER) */}
        {game.id === 'hot-take' && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-full bg-[#EF4444] text-white p-5 rounded-3xl border-[3px] border-black shadow-brutal-lg mb-5">
              <span className="text-xs font-mono font-bold block mb-1">رأي مثير للجدل 🌶️</span>
              <h3 className="font-black text-xl">{gameState.take}</h3>
            </div>

            <div className="w-full flex gap-3">
              <button
                onClick={() => {
                  sounds.playPop();
                  const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                  setTimeout(() => onFinishGameRound(other.id, `كان رأيه شاذ عن متوسط الترابيزة!`), 1100);
                }}
                className="flex-1 py-4 bg-neonLime text-black font-black text-base rounded-2xl border-2 border-black shadow-brutal cursor-pointer"
              >
                أتفق جداً 👍
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setTimeout(() => onFinishGameRound(currentPlayer.id, `كان رأيك شاذ عن متوسط الترابيزة!`), 1100);
                }}
                className="flex-1 py-4 bg-rose-600 text-white font-black text-base rounded-2xl border-2 border-black shadow-brutal cursor-pointer"
              >
                أعترض تماماً 👎
              </button>
            </div>
          </div>
        )}

        {/* 16. IMPOSTER (NO TIMER - SEATED TALK) */}
        {game.id === 'imposter' && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-full bg-white text-black p-6 rounded-3xl border-[3px] border-black shadow-brutal-lg mb-4">
              <span className="text-xs font-mono font-black text-zinc-500 uppercase block mb-1">
                {gameState.isImposter ? 'تحذير أمني ⚠️' : 'الكلمة السرية للجميع 🔐'}
              </span>
              <h2 className="text-3xl font-black font-display text-zinc-950">
                {gameState.isImposter ? 'أنت الجاسوس! 🕵️‍♂️' : gameState.secretWord}
              </h2>
              <p className="text-xs font-bold text-zinc-600 mt-2">
                {gameState.isImposter
                  ? 'مثل إنك عارف الكلمة واوعى حد من الصحاب يقفشك!'
                  : 'الكل عارف الكلمة ما عدا الجاسوس.. اتكلموا بهدوء واكشفوه!'}
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playVictory();
                const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                onFinishGameRound(other.id, `تم كشف الجاسوس على الترابيزة!`);
              }}
              className="w-full py-4 bg-neonLime text-black font-black text-base rounded-2xl border-2 border-black shadow-brutal cursor-pointer"
            >
              اكشف الجاسوس وخصلت الجولة! 🎯
            </button>
          </div>
        )}

        {/* 17. QUIP CLASH / HERD MENTALITY (NO TIMER) */}
        {(game.id === 'quip-clash' || game.id === 'herd-mentality') && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-full bg-neonCyan text-black p-5 rounded-3xl border-[3px] border-black shadow-brutal-lg mb-4">
              <h3 className="font-black text-lg">{gameState.prompt}</h3>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              {(gameState.options || []).map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => {
                    sounds.playPop();
                    const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                    setTimeout(() => onFinishGameRound(other.id, `إجابته كانت برة تفكير القطيع!`), 1100);
                  }}
                  className="w-full p-3.5 bg-zinc-900 text-white font-black text-sm rounded-2xl border-2 border-black shadow-brutal-sm hover:bg-zinc-800 cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 18. HOT POTATO (HAS FUSE TIMER) */}
        {game.id === 'hot-potato' && (
          <div className="w-full flex flex-col items-center text-center">
            <motion.div
              animate={{ rotate: [-10, 10, -10], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-8xl my-4"
            >
              💣
            </motion.div>
            <h3 className="font-black text-2xl text-rose-500 mb-2">القنبلة بتكتك ع شاشتك!</h3>
            <p className="text-xs text-zinc-400 mb-5">مررها قبل ما تنفجر في إيدك!</p>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                sounds.playPop();
                setGameState((s: any) => ({ ...s, passes: (s.passes || 0) + 1 }));
              }}
              className="w-full py-4 rounded-2xl bg-neonLime text-black font-black text-xl border-[3px] border-black shadow-brutal cursor-pointer"
            >
              مرر القنبلة فوراً! 🚀 ({gameState.passes || 0})
            </motion.button>
          </div>
        )}

        {/* 19. SHELL SHOCK (NO TIMER - PICK CUP) */}
        {game.id === 'shell-shock' && (
          <div className="w-full flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-zinc-400 mb-3">
              {gameState.shuffling ? 'الكوبايات بتلف.. ركز في الكنز!' : 'اختار الكوباية اللي فيها الجوهرة!'}
            </span>

            <div className="w-full grid grid-cols-3 gap-3 my-4">
              {[0, 1, 2].map(cup => (
                <button
                  key={cup}
                  disabled={gameState.shuffling}
                  onClick={() => {
                    sounds.playPop();
                    setGameState((s: any) => ({ ...s, pickedCup: cup }));
                    const isRight = cup === gameState.prizeCup;
                    if (isRight) sounds.playVictory();
                    else sounds.playBuzzer();
                    const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                    const loser = isRight ? other : currentPlayer;
                    setTimeout(() => onFinishGameRound(loser.id, `${loser.name} اختار الكوباية الغلط!`), 1500);
                  }}
                  className={`h-28 rounded-2xl border-[3px] border-black flex flex-col items-center justify-center text-5xl cursor-pointer transition-all ${
                    gameState.pickedCup === cup
                      ? cup === gameState.prizeCup
                        ? 'bg-neonLime shadow-brutal'
                        : 'bg-rose-500 shadow-brutal'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  {gameState.pickedCup !== null && cup === gameState.prizeCup ? '💎' : '🎩'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 20. MUSICAL CHAIRS (AUDIO-BASED SUDDEN STOP) */}
        {game.id === 'musical-chairs' && (
          <div className="w-full flex flex-col items-center text-center">
            {gameState.musicPlaying ? (
              <div className="w-full bg-zinc-900 text-white p-6 rounded-3xl border-[3px] border-black flex flex-col items-center">
                <span className="text-6xl animate-spin mb-3">🎵</span>
                <h3 className="font-black text-xl text-neonLime">المزيكا شغالة...</h3>
                <p className="text-xs text-zinc-400 mt-1">أول ما تقف الكرسي هيظهر فوراً!</p>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  sounds.playVictory();
                  setGameState((s: any) => ({ ...s, satDown: true }));
                  const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                  setTimeout(() => onFinishGameRound(other.id, `${other.name} كان أبطأ لاعب في قعدة الكرسي!`), 1500);
                }}
                className="w-full py-8 rounded-3xl bg-neonLime text-black font-black text-3xl border-[3px] border-black shadow-brutal-lg flex flex-col items-center cursor-pointer animate-bounce"
              >
                <span className="text-6xl mb-2">🪑</span>
                <span>الحق الكرسي! 🏃‍♂️</span>
              </motion.button>
            )}
          </div>
        )}

        {/* 21. LONE WOLF (NO TIMER) */}
        {game.id === 'lone-wolf' && (
          <div className="w-full flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-zinc-400 mb-3">اختار رقم محدش غيرك هيختاره في القعدة!</span>

            <div className="w-full grid grid-cols-5 gap-2 my-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => {
                    sounds.playPop();
                    setGameState({ chosenNumber: num, revealed: true });
                    const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                    setTimeout(() => onFinishGameRound(other.id, `${other.name} اختار رقم مكرر مع غيره!`), 1300);
                  }}
                  className={`h-20 rounded-2xl border-[3px] border-black font-black text-2xl cursor-pointer ${
                    gameState.chosenNumber === num
                      ? 'bg-neonLime text-black shadow-brutal scale-105'
                      : 'bg-white text-black shadow-brutal-sm'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 22. ROCK PAPER ROYALE (NO TIMER) */}
        {game.id === 'rock-paper-royale' && (
          <div className="w-full flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-zinc-400 mb-3">طوبة ولا ورقة ولا مقص؟</span>

            <div className="w-full grid grid-cols-3 gap-3 my-2">
              {[
                { name: 'طوبة', icon: '✊', val: 'rock' },
                { name: 'ورقة', icon: '✋', val: 'paper' },
                { name: 'مقص', icon: '✌️', val: 'scissors' },
              ].map(item => (
                <button
                  key={item.val}
                  onClick={() => {
                    sounds.playPop();
                    setGameState({ playerChoice: item.icon, result: 'done' });
                    const other = players.find(p => p.id !== currentPlayer.id) || currentPlayer;
                    setTimeout(() => onFinishGameRound(other.id, `خسر مواجهة طوبة ورقة مقص ضد ${currentPlayer.name}!`), 1300);
                  }}
                  className={`p-4 rounded-2xl border-[3px] border-black flex flex-col items-center justify-center cursor-pointer ${
                    gameState.playerChoice === item.icon
                      ? 'bg-neonLime text-black shadow-brutal'
                      : 'bg-white text-black shadow-brutal-sm'
                  }`}
                >
                  <span className="text-4xl">{item.icon}</span>
                  <span className="font-black text-xs mt-1">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 23. ROULETTE (NO TIMER - WHEEL SPIN) */}
        {game.id === 'roulette' && (
          <div className="w-full flex flex-col items-center text-center">
            <motion.div
              animate={{ rotate: gameState.spinning ? 1080 : 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="w-48 h-48 rounded-full border-[4px] border-black bg-gradient-to-tr from-neonPink via-neonPurple to-neonCyan flex items-center justify-center text-5xl my-4 shadow-brutal-lg"
            >
              💀
            </motion.div>

            {gameState.victim ? (
              <div className="p-4 bg-neonLime text-black rounded-2xl border-2 border-black font-black text-lg">
                السهم وقف على: {gameState.victim.name}! 🥤
              </div>
            ) : (
              <button
                onClick={() => {
                  sounds.playPop();
                  setGameState({ spinning: true });
                  setTimeout(() => {
                    const victim = players[Math.floor(Math.random() * players.length)];
                    sounds.playBuzzer();
                    setGameState({ spinning: false, victim });
                    setTimeout(() => onFinishGameRound(victim.id, `عجلة الحظ وقفت على ${victim.name}!`), 1800);
                  }, 2000);
                }}
                className="w-full py-4 rounded-2xl bg-neonLime text-black font-black text-xl border-[3px] border-black shadow-brutal cursor-pointer"
              >
                لِف العجلة الآن! 🎡
              </button>
            )}
          </div>
        )}

      </div>

      {/* THE FLOATING SPY PILL BUTTON */}
      {currentPlayer.currentMission && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-30"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              sounds.playPop();
              onOpenSecretMission();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-neonPurple text-white font-black text-sm uppercase font-display border-[3px] border-black shadow-brutal flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🕵️</span>
              <span>مهمتك السرية على {currentPlayer.currentMission.targetName}</span>
            </div>
            <span className="text-xs font-bold text-neonLime underline">
              افتح الكارت ←
            </span>
          </motion.button>
        </motion.div>
      )}

    </div>
  );
};
