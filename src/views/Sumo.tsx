import { MediaPickerModal } from "../components/MediaPickerModal";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewState } from "../types";
import { FullscreenButton } from "../components/FullscreenButton";
import { ArrowLeft, Edit3, Trash2, Heart, Plus, Sparkles, BookOpen, Search, Save, X, Play, Folder, Image as ImageIcon, Info, ClipboardList, Copy, Trophy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";


let sharedAudioCtx: AudioContext | null = null;

const playSFX = (type: 'push' | 'stun' | 'win') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    const ctx = sharedAudioCtx;
    
    // Resume context if suspended (browser auto-play policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'push') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'stun') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'win') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

import { doc, getDoc, updateDoc, addDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface Question {
  id: number | string;
  text: string;
  options: string[];
  answerIndex: number;
}

interface GameData {
  id: number | string;
  title?: string;
  folderId?: string;
  topic?: string;
  classLevel?: string;
  questions: Question[];
  isPublic?: boolean;
}

const DEFAULT_QUESTIONS: Question[] = [
  { id: 1, text: "He likes movies, ____?", options: ["doesn’t he?", "does he?"], answerIndex: 0 },
  { id: 2, text: "She is your friend, ____?", options: ["isn’t she?", "is she?"], answerIndex: 0 },
  { id: 3, text: "They can swim well, ____?", options: ["can’t they?", "can they?"], answerIndex: 0 },
  { id: 4, text: "Tom plays football, ____?", options: ["doesn’t he?", "does he?"], answerIndex: 0 },
  { id: 5, text: "You are happy today, ____?", options: ["aren’t you?", "are you?"], answerIndex: 0 }
];

const SumoCharacter = ({ team, isPushing, isStunned, isFrozen, hasLost, positionStyle, flip, className }: any) => {
  const isLeft = team === 'left';
  const clothingColor = isLeft ? "#2563eb" : "#dc2626";

  let rotation = 0;
  let translateX = 0;
  let translateY = 0;

  if (hasLost) {
    rotation = isLeft ? -75 : 75;
    translateX = isLeft ? -100 : 100;
    translateY = 20;
  } else if (isPushing) {
    rotation = isLeft ? 15 : -15;
    translateX = isLeft ? 45 : -45;
  } else if (isStunned) {
    rotation = isLeft ? -25 : 25; 
    translateX = isLeft ? -25 : 25;
    translateY = 15;
  }

  const transform = `rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px)`;

  return (
    <div 
      className={`absolute bottom-4 z-10 w-56 h-72 md:w-[448px] md:h-[512px] transition-all duration-200 ease-out origin-bottom ${className || ''}`}
      style={{ ...positionStyle, transform }}
    >
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl overflow-visible">
        <g transform={flip ? "scale(-1, 1) translate(-100, 0)" : ""}>
          <ellipse cx="50" cy="115" rx="40" ry="6" fill="rgba(0,0,0,0.2)" />
          <rect x="30" y="80" width="18" height="32" rx="9" fill="#e5c8b0" />
          <rect x="52" y="80" width="18" height="32" rx="9" fill="#e5c8b0" />
          <circle cx="50" cy="65" r="42" fill="#ffdfc4" />
          <path d="M 15 45 C 20 10, 80 10, 85 45 Z" fill="#1f2937" />
          <path d="M 50 20 C 45 0, 65 0, 60 20 Z" fill="#1f2937" />
          <rect x="47" y="18" width="14" height="4" fill="#fbbf24" rx="2" />
          {hasLost ? (
             <g>
               {/* Dizzy spirals */}
               <path d="M 40 50 Q 45 45 45 55 T 35 50" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
               <path d="M 70 50 Q 75 45 75 55 T 65 50" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
               {/* Big open mouth */}
               <ellipse cx="55" cy="68" rx="8" ry="12" fill="#7f1d1d" />
               {/* Tears flying out */}
               <path d="M 35 55 L 20 70 M 65 55 L 80 70" stroke="#60a5fa" strokeWidth="4" strokeDasharray="4 4" className="animate-pulse" />
             </g>
          ) : isStunned ? (
            <g>
              <path d="M 35 45 L 45 55 M 45 45 L 35 55" stroke="#1f2937" strokeWidth="3" />
              <path d="M 65 45 L 75 55 M 75 45 L 65 55" stroke="#1f2937" strokeWidth="3" />
              <path d="M 45 65 Q 55 60 65 65" fill="none" stroke="#1f2937" strokeWidth="2" />
              {/* Sweat drop */}
              <path d="M 75 35 Q 82 45 75 48 Q 68 45 75 35" fill="#93c5fd" />
            </g>
          ) : (
            <g>
              <circle cx="45" cy="50" r="4" fill="#1f2937" />
              <circle cx="75" cy="50" r="4" fill="#1f2937" />
              <path d="M 50 62 Q 55 68 60 62" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
          <path d="M 8 68 Q 50 90 92 68 L 88 82 Q 50 102 12 82 Z" fill={clothingColor} />
          <path d="M 38 78 L 62 78 L 58 112 L 42 112 Z" fill={clothingColor} />
          <path d={isPushing ? "M 55 60 L 105 50" : "M 55 60 Q 85 75 95 65"} fill="none" stroke="#ffdfc4" strokeWidth="16" strokeLinecap="round" />
          
          {/* Action lines for pushing (dust/impact) */}
          {isPushing && (
             <g stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" className="animate-pulse" opacity="0.6">
               <line x1="-20" y1="50" x2="10" y2="50" />
               <line x1="-15" y1="30" x2="5" y2="40" />
               <line x1="-15" y1="70" x2="5" y2="60" />
             </g>
          )}
          
          {isFrozen && (
            <g>
              {/* Ice block shape overlay */}
              <rect x="-10" y="5" width="120" height="110" rx="15" fill="rgba(165, 243, 252, 0.7)" stroke="rgba(103, 232, 249, 0.9)" strokeWidth="6" />
              <path d="M -5 20 L 15 5 M 10 110 L 30 95 M 85 5 L 105 20 M 80 100 L 115 110" stroke="rgba(255,255,255,0.7)" strokeWidth="4" strokeLinecap="round" />
              
              {/* Glare effects */}
              <rect x="5" y="15" width="20" height="40" rx="10" fill="rgba(255,255,255,0.5)" transform="rotate(15 15 35)" />
              <circle cx="95" cy="85" r="8" fill="rgba(255,255,255,0.6)" />
              <circle cx="100" cy="95" r="4" fill="rgba(255,255,255,0.5)" />
              
              {/* FROZEN text */}
              <g transform={flip ? "scale(-1, 1) translate(-100, 0)" : ""}>
                <text x="50" y="55" fontFamily="sans-serif" fontSize="22" fontWeight="900" fill="#083344" textAnchor="middle" transform="rotate(-10 50 55)" style={{ paintOrder: 'stroke', stroke: '#cffafe', strokeWidth: '4px' }}>
                  FROZEN
                </text>
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export function Sumo({ onViewChange, initialGame }: { onViewChange: (view: ViewState) => void, initialGame?: any }) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<'menu' | 'playing' | 'end' | 'setup' | 'study'>(initialGame && !initialGame.editMode ? 'menu' : 'setup');
  const [studyIndex, setStudyIndex] = useState(0);
  const [studySelectedOption, setStudySelectedOption] = useState<number | null>(null); 
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (user) {
      const fetchFolders = async () => {
        try {
          const qFolders = query(collection(db, 'gameFolders'), where('userId', '==', user.uid));
          const snap = await getDocs(qFolders);
          const fData: { id: string; name: string }[] = [];
          snap.forEach(d => fData.push({ id: d.id, name: d.data().name }));
          setFolders(fData);
        } catch (err) {
          console.error("Error loading folders", err);
        }
      };
      fetchFolders();
    }
  }, [user]);

  const [activeGame, setActiveGame] = useState<GameData | null>(() => {
    if (initialGame) {
      return {
        id: initialGame.id,
        title: initialGame.name || "",
        folderId: initialGame.folderId || "",
        topic: initialGame.topic || "",
        classLevel: initialGame.className || "",
        questions: initialGame.customQuestions || DEFAULT_QUESTIONS,
        isPublic: initialGame.isPublic || false
      };
    }
    return {
      id: Date.now(),
      title: "",
      folderId: "",
      topic: "",
      classLevel: "",
      questions: [{ id: Date.now(), text: '', options: ['', ''], answerIndex: 0 }]
    };
  });

  const saveGame = async (gameData: GameData) => {
    if (!user) {
      alert("You must be logged in to save games.");
      return;
    }

    onViewChange("games");

    try {
      const gameToSave = JSON.parse(JSON.stringify({
        name: gameData.title || "",
        folderId: gameData.folderId || "",
        topic: gameData.topic || "",
        className: gameData.classLevel || "",
        gameType: "sumo",
        customQuestions: gameData.questions,
        isPublic: gameData.isPublic ?? false,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
      }));

      if (initialGame?.id) {
        await updateDoc(doc(db, "mysteryBoxGames", initialGame.id), gameToSave);
      } else {
        await addDoc(collection(db, "mysteryBoxGames"), {
          ...gameToSave,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error("Error saving game", e);
      alert("Failed to save game.");
    }
  };

  const questionsDB = activeGame?.questions || DEFAULT_QUESTIONS;

  const generateQuestion = (index: number) => {
    const q = questionsDB[index % questionsDB.length];
    
    // Get valid options
    let validOptions = [...q.options].filter(o => o.trim() !== "");
    if (validOptions.length < 2) validOptions = ["Yes", "No"];
    
    const correctOpt = q.options[q.answerIndex] || validOptions[0];
    
    // Ensure correct option is included
    if (!validOptions.includes(correctOpt)) {
       validOptions[0] = correctOpt;
    }
    
    // Shuffle all valid options
    const shuffledOpts = [...validOptions].sort(() => Math.random() - 0.5);
    
    return {
      text: q.text,
      options: shuffledOpts,
      correctIndex: shuffledOpts.indexOf(correctOpt)
    };
  };

  const [leftTeam, setLeftTeam] = useState<any>({ score: 0, wins: 0, qIndex: 0, q: null, stunned: false, pushing: false, mistakes: 0, frozen: false });
  const [rightTeam, setRightTeam] = useState<any>({ score: 0, wins: 0, qIndex: 0, q: null, stunned: false, pushing: false, mistakes: 0, frozen: false });
  const [battlePos, setBattlePos] = useState(50);
  const [winner, setWinner] = useState<string | null>(null);

  const matchOverRef = useRef(false);
  const stateRef = useRef({ screen, leftTeam, rightTeam, battlePos });
  useEffect(() => {
    stateRef.current = { screen, leftTeam, rightTeam, battlePos };
  }, [screen, leftTeam, rightTeam, battlePos]);

  const startGame = (continueMatch = false) => {
    setLeftTeam(prev => {
       const nextIndex = continueMatch ? prev.qIndex : 0;
       return { ...prev, score: 0, qIndex: nextIndex, q: generateQuestion(nextIndex), stunned: false, pushing: false };
    });
    setRightTeam(prev => {
       const nextIndex = continueMatch ? prev.qIndex : 0;
       return { ...prev, score: 0, qIndex: nextIndex, q: generateQuestion(nextIndex), stunned: false, pushing: false };
    });
    setBattlePos(50);
    setWinner(null);
    matchOverRef.current = false;
    setScreen('playing');
  };

  const handleAnswer = useCallback((teamStr: string, selectedIndex: number) => {
    const state = stateRef.current;
    if (state.screen !== 'playing') return;

    const isLeft = teamStr === 'left';
    const teamState = isLeft ? state.leftTeam : state.rightTeam;
    const setTeamState = isLeft ? setLeftTeam : setRightTeam;

    if (teamState.stunned || teamState.pushing || teamState.frozen) return;

    if (selectedIndex === teamState.q.correctIndex) {
      setTeamState((prev: any) => ({ ...prev, pushing: true, score: prev.score + 1, mistakes: 0 }));
      playSFX('push');
      const shiftAmount = 12; 
      
      if (matchOverRef.current) return;
      
      const nextPos = isLeft ? state.battlePos + shiftAmount : state.battlePos - shiftAmount;
      let matchOver = false;
      
      if (nextPos >= 98) {
         matchOverRef.current = true;
         matchOver = true;
         setWinner('Blue Team');
         setLeftTeam(prev => ({ ...prev, wins: prev.wins + 1 }));
         playSFX('win');
         setTimeout(() => setScreen('end'), 1500);
      } else if (nextPos <= 2) {
         matchOverRef.current = true;
         matchOver = true;
         setWinner('Red Team');
         setRightTeam(prev => ({ ...prev, wins: prev.wins + 1 }));
         playSFX('win');
         setTimeout(() => setScreen('end'), 1500);
      }
      
      setBattlePos(prev => {
        const next = isLeft ? prev + shiftAmount : prev - shiftAmount;
        return next;
      });

      if (!matchOver) {
        setTimeout(() => {
          setTeamState((prev: any) => {
             const nextIndex = prev.qIndex + 1;
             return { ...prev, pushing: false, qIndex: nextIndex, q: generateQuestion(nextIndex) };
          });
        }, 400);
      } else {
        // Keep them pushing so the impact is strong
      }
    } else {
      setTeamState((prev: any) => {
         const nextMistakes = prev.mistakes + 1;
         if (nextMistakes >= 2) {
             playSFX('stun'); // or a freeze sound
             setTimeout(() => setTeamState((p: any) => ({ ...p, frozen: false, mistakes: 0 })), 3000);
             return { ...prev, frozen: true, mistakes: 0 };
         }
         
         playSFX('stun');
         setTimeout(() => setTeamState((p: any) => ({ ...p, stunned: false })), 1200);
         return { ...prev, stunned: true, mistakes: nextMistakes };
      });
      setBattlePos(prev => Math.max(2, Math.min(98, isLeft ? prev - 10 : prev + 10)));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.screen !== 'playing') return;
      const key = e.key.toLowerCase();
      
      const leftOptsCount = stateRef.current.leftTeam?.q?.options?.length || 4;
      const rightOptsCount = stateRef.current.rightTeam?.q?.options?.length || 4;
      
      const leftMap: Record<string, number> = leftOptsCount === 2 
          ? { a: 0, d: 1 } 
          : { w: 0, a: 1, s: 2, d: 3 };
          
      const rightMap: Record<string, number> = rightOptsCount === 2
          ? { arrowleft: 0, arrowright: 1 }
          : { arrowup: 0, arrowleft: 1, arrowdown: 2, arrowright: 3 };

      if (key in leftMap) {
         handleAnswer('left', leftMap[key]);
      } else if (key in rightMap) {
         handleAnswer('right', rightMap[key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer]);

  const renderQuestionText = (text: string) => {
    // Some users might have varied length of blanks, split on 3 or more underscores
    const parts = text.split(/_{3,}/);
    if (parts.length === 1) return text;
    return parts.map((part, i, arr) => (
      <React.Fragment key={i}>
        {part}
        {i !== arr.length - 1 && (
          <span className="inline-block border-b-4 border-white/60 min-w-[4rem] mx-2 align-baseline translate-y-[-4px]">
          </span>
        )}
      </React.Fragment>
    ));
  };

  if (screen === 'setup') {
    return (
      <GameEditor 
        game={activeGame!} 
        onSave={saveGame} 
        onCancel={() => onViewChange("games")}
        folders={folders}
      />
    );
  }

  if (screen === 'study') {
    const studyQuestions = activeGame?.questions || DEFAULT_QUESTIONS;
    const currentQ = studyQuestions[studyIndex];
    
    return (
      <div id="game-container" className="h-[calc(100vh-2rem)] bg-indigo-50 dark:bg-indigo-950 flex flex-col font-sans p-4 relative" style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl backdrop-blur-md mb-8">
           <button 
             onClick={() => setScreen('menu')}
             className="flex items-center gap-2 p-2 rounded-full transition-colors bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 shadow-sm text-indigo-900 dark:text-indigo-100 font-bold px-4"
           >
             <ArrowLeft size={20} /> Back to Menu
           </button>
           <div className="text-xl font-black text-indigo-900 dark:text-indigo-100">
              Question {studyIndex + 1} of {studyQuestions.length}
           </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
           {studyQuestions.length > 0 ? (
              <>
                 <h1 className="text-3xl md:text-5xl font-black text-indigo-950 dark:text-white tracking-tight leading-tight text-center max-w-full break-words drop-shadow-sm mb-12">
                     {currentQ?.text}
                 </h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                     {currentQ?.options.map((opt, i) => {
                         if (!opt || opt.trim() === '') return null;
                         const isSelected = studySelectedOption === i;
                         const isCorrect = i === currentQ.answerIndex;
                         const showAsCorrect = studySelectedOption !== null && isCorrect;
                         const showAsIncorrect = studySelectedOption !== null && isSelected && !isCorrect;
                         
                         return (
                             <button
                                 key={i}
                                 onClick={() => {
                                     if (studySelectedOption === null) {
                                         setStudySelectedOption(i);
                                     }
                                 }}
                                 disabled={studySelectedOption !== null}
                                 className={`relative p-6 rounded-2xl text-xl md:text-2xl font-bold transition-all duration-300 transform ${
                                     showAsCorrect ? 'bg-green-500 text-white shadow-[0_6px_0_#15803d] scale-105 z-10' :
                                     showAsIncorrect ? 'bg-red-500 text-white opacity-90 scale-95 shadow-[0_4px_0_#991b1b]' :
                                     studySelectedOption !== null ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-50 shadow-none' :
                                     'bg-white text-indigo-900 hover:bg-indigo-50 hover:scale-[1.02] shadow-[0_6px_0_#cbd5e1] dark:shadow-[0_6px_0_#334155] border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                                 }`}
                             >
                                 <div className="flex items-center justify-center gap-4">
                                     {opt}
                                     {showAsCorrect && <span className="text-3xl animate-bounce">✅</span>}
                                     {showAsIncorrect && <span className="text-3xl">❌</span>}
                                 </div>
                             </button>
                         );
                     })}
                 </div>
                 
                 <div className={`mt-12 h-20 transition-all duration-500 ${studySelectedOption !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                     <button
                         onClick={() => {
                             if (studyIndex < studyQuestions.length - 1) {
                                 setStudyIndex(studyIndex + 1);
                                 setStudySelectedOption(null);
                             } else {
                                 setScreen('menu');
                                 setStudyIndex(0);
                                 setStudySelectedOption(null);
                             }
                         }}
                         className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl rounded-full shadow-[0_6px_0_#4338ca] active:translate-y-1 active:shadow-none transition-all"
                     >
                         {studyIndex < studyQuestions.length - 1 ? 'Next Question →' : 'Finish Study'}
                     </button>
                 </div>
              </>
           ) : (
              <div className="text-slate-500 text-3xl font-bold">No questions available!</div>
           )}
        </div>
      </div>
    );
  }

  if (screen === 'menu') {
    return (
      <div id="game-container" className="h-[calc(100vh-2rem)] bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center font-sans p-4 overflow-hidden relative" style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }}>
        <div className="absolute top-4 left-4 z-[60] flex items-center gap-2">
          <button 
            onClick={() => onViewChange("home")}
            className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-black/50 border-slate-300/50 dark:border-white/20"
          >
            <ArrowLeft size={24} />
          </button>
          <FullscreenButton targetId="game-container" />
          <button 
            onClick={() => {
              setLeftTeam(prev => ({ ...prev, wins: 0 }));
              setRightTeam(prev => ({ ...prev, wins: 0 }));
              setScreen('menu');
            }}
            className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-100/80 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 border-red-300/50 dark:border-red-500/20 shadow-sm"
            title="Quit Game"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] text-center shadow-2xl border-b-8 border-yellow-500 max-w-lg w-full">
          <div className="mb-6 flex justify-center gap-6 animate-pulse">
             <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-blue-900 shadow-lg"></div>
             <div className="w-12 h-12 bg-red-600 rounded-full border-4 border-red-900 shadow-lg"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-indigo-900 italic uppercase tracking-tighter leading-tight">{activeGame?.title || "QUESTION TAGS SHOWDOWN"}</h1>
          <p className="text-slate-500 mb-8 font-bold text-lg uppercase tracking-widest">{activeGame?.topic || "Master the Tags"}</p>
          <button onClick={() => startGame(false)} className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-2xl font-black px-12 py-6 rounded-full shadow-[0_8px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all w-full md:w-auto mb-4">
            START BATTLE
          </button>
          
          <button onClick={() => { setStudyIndex(0); setStudySelectedOption(null); setScreen('study'); }} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xl font-bold px-12 py-4 rounded-full shadow-[0_6px_0_#818cf8] active:translate-y-1 active:shadow-none transition-all w-full md:w-auto flex items-center justify-center gap-3 mx-auto">
             <span className="text-3xl">📖</span> STUDY MODE
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'end') {
    return (
      <div id="game-container" className="h-[calc(100vh-2rem)] bg-slate-100 dark:bg-black/95 flex items-center justify-center font-sans p-4 overflow-hidden relative" style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }}>
        <div className="absolute top-4 left-4 z-[60] flex items-center gap-2">
          <button 
            onClick={() => onViewChange("home")}
            className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-black/50 border-slate-300/50 dark:border-white/20"
          >
            <ArrowLeft size={24} />
          </button>
          <FullscreenButton targetId="game-container" />
          <button 
            onClick={() => {
              setLeftTeam(prev => ({ ...prev, wins: 0 }));
              setRightTeam(prev => ({ ...prev, wins: 0 }));
              setScreen('menu');
            }}
            className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-100/80 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 border-red-300/50 dark:border-red-500/20 shadow-sm"
            title="Quit Game"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] text-center shadow-2xl border-8 border-yellow-400">
          <h2 className={`text-5xl md:text-7xl font-black mb-4 uppercase italic ${winner === 'Blue Team' ? 'text-blue-600' : 'text-red-600'}`}>
            {winner}
          </h2>
          <p className="text-2xl font-black text-slate-800 mb-10 uppercase tracking-widest">Wins the Match!</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button onClick={() => startGame(true)} className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-2xl font-black px-8 py-5 rounded-full shadow-[0_6px_0_#ca8a04] active:translate-y-1 active:shadow-[0_0px_0_#ca8a04] transition-all">
              Continue
            </button>
            <button onClick={() => {
                setLeftTeam((prev: any) => ({ ...prev, wins: 0 }));
                setRightTeam((prev: any) => ({ ...prev, wins: 0 }));
                startGame(false);
              }} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xl font-bold px-8 py-5 rounded-full shadow-[0_6px_0_#94a3b8] active:translate-y-1 active:shadow-[0_0px_0_#94a3b8] transition-all">
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

    return (
      <div id="game-container" className="h-[calc(100vh-2rem)] w-full bg-indigo-50 dark:bg-indigo-950 p-2 md:p-4 flex flex-col md:flex-row gap-2 md:gap-4 select-none overflow-hidden font-sans relative" style={{ margin: '-1rem', height: 'calc(100% + 2rem)' }}>
        <div className="absolute top-4 left-4 z-[60] flex items-center gap-2">
          <button 
            onClick={() => onViewChange("home")}
            className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-black/50 border-slate-300/50 dark:border-white/20"
          >
            <ArrowLeft size={24} />
          </button>
          <FullscreenButton targetId="game-container" />
          <button 
            onClick={() => {
              setLeftTeam(prev => ({ ...prev, wins: 0 }));
              setRightTeam(prev => ({ ...prev, wins: 0 }));
              setScreen('menu');
            }}
            className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-100/80 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 border-red-300/50 dark:border-red-500/20 shadow-sm"
            title="Quit Game"
          >
            <X size={24} />
          </button>
        </div>
  
        {/* Blue Team Side */}
        <div className="w-full md:w-1/4 bg-blue-700 rounded-3xl md:rounded-[2.5rem] flex flex-row md:flex-col p-3 md:p-6 pt-16 md:pt-16 shadow-2xl border-b-4 md:border-b-0 md:border-r-8 border-blue-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center mb-0 md:mb-6 pr-4 md:pr-0">
            <h2 className="text-xs md:text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-widest whitespace-nowrap">BLUE TEAM</h2>
            <div className="flex gap-1 bg-slate-200 dark:bg-black/30 px-3 md:px-4 py-2 rounded-xl">
              {Array.from({ length: leftTeam.wins }).map((_, i) => (
                <Trophy key={i} size={24} className="text-yellow-500 fill-yellow-500" />
              ))}
              {leftTeam.wins === 0 && <span className="text-slate-400 text-sm md:text-base font-bold px-2 flex items-center">0 WINS</span>}
            </div>
          </div>
          
          <div className="hidden md:flex bg-blue-800/80 flex-1 rounded-3xl p-4 md:p-8 items-center justify-center shadow-inner mb-6 relative overflow-hidden border border-blue-400/20">
            <p className="text-slate-800 dark:text-white text-2xl md:text-4xl font-black text-center leading-snug drop-shadow-sm">
              {renderQuestionText(leftTeam.q?.text || "")}
            </p>
            {leftTeam.stunned && (
              <div className="absolute inset-0 bg-red-600/60 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <span className="text-slate-800 dark:text-white font-black italic text-3xl drop-shadow-lg">MISS!</span>
              </div>
            )}
          </div>
  
          <div className={`grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4 flex-1 md:flex-none ${leftTeam.stunned ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            {leftTeam.q?.options.map((opt: string, idx: number) => (
              <button key={idx} onClick={() => handleAnswer('left', idx)}
                className={`bg-white hover:bg-blue-50 text-blue-900 rounded-xl md:rounded-3xl py-3 md:py-6 text-base md:text-3xl font-black shadow-[0_6px_0_#1e3a8a] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center md:justify-between px-2 md:px-8 relative overflow-hidden ${leftTeam.frozen ? 'pointer-events-none border-4 border-cyan-300' : ''}`}>
                <span className="hidden md:inline text-blue-400 font-bold bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-lg text-sm md:text-xl relative z-10">{leftTeam.q?.options.length === 2 ? ['A', 'D'][idx] : ['W', 'A', 'S', 'D'][idx] || (idx + 1)}</span>
                <span className="relative z-10">{opt}</span>
                {leftTeam.frozen && (
                  <div className="absolute inset-0 bg-cyan-200/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                     <span className="text-3xl md:text-5xl opacity-80 rotate-[-10deg]">❄️</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
  
        {/* Arena */}
        <div className="flex-1 bg-[#fefae0] rounded-3xl md:rounded-[3rem] relative overflow-hidden border-4 md:border-8 border-amber-900/20 shadow-inner min-h-[150px] mt-16 md:mt-0">
          {/* Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[110%] aspect-square flex items-center justify-center">
            <div className="w-full h-full bg-[#bc6c25] rounded-full border-[10px] md:border-[30px] border-[#8b5e34] shadow-2xl transform scale-y-[0.6] relative">
               <div className="h-full w-1 bg-white/20 absolute left-1/2 -translate-x-1/2"></div>
            </div>
          </div>
  
          <div className="absolute top-1/2 w-0 h-0 transition-all duration-300 ease-out flex justify-center items-end"
               style={{ left: `${battlePos}%` }}>
            <SumoCharacter team="left" 
              isPushing={leftTeam.pushing} isStunned={leftTeam.stunned} isFrozen={leftTeam.frozen} flip={false}
              hasLost={winner === 'Red Team'}
              className="right-0"
              positionStyle={{ bottom: '-3rem', marginRight: '-15%' }} />
            <SumoCharacter team="right" 
              isPushing={rightTeam.pushing} isStunned={rightTeam.stunned} isFrozen={rightTeam.frozen} flip={true}
              hasLost={winner === 'Blue Team'}
              className="left-0"
              positionStyle={{ bottom: '-3rem', marginLeft: '-15%' }} />
          </div>
  
          {/* Mobile View Question Text */}
          <div className="md:hidden absolute top-4 left-0 w-full px-4 flex justify-between gap-3 z-10">
              <div className={`bg-blue-900/90 p-2 rounded-xl text-slate-100 dark:text-white text-[10px] font-bold w-1/2 text-center shadow-lg ${leftTeam.stunned ? 'bg-red-900' : ''}`}>
                  {leftTeam.stunned ? "MISS!" : leftTeam.q?.text}
              </div>
              <div className={`bg-red-900/90 p-2 rounded-xl text-slate-100 dark:text-white text-[10px] font-bold w-1/2 text-center shadow-lg ${rightTeam.stunned ? 'bg-red-900' : ''}`}>
                  {rightTeam.stunned ? "MISS!" : rightTeam.q?.text}
              </div>
          </div>
        </div>
  
        {/* Red Team Side (Options UNDER Question) */}
        <div className="w-full md:w-1/4 bg-red-700 rounded-3xl md:rounded-[2.5rem] flex flex-row md:flex-col p-3 md:p-6 shadow-2xl border-t-4 md:border-t-0 md:border-l-8 border-red-900/50">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-0 md:mb-6 pl-4 md:pl-0 w-full">
            <div className="flex gap-1 bg-slate-200 dark:bg-black/30 px-3 md:px-4 py-2 rounded-xl order-2 md:order-1">
              {Array.from({ length: rightTeam.wins }).map((_, i) => (
                <Trophy key={i} size={24} className="text-yellow-500 fill-yellow-500" />
              ))}
              {rightTeam.wins === 0 && <span className="text-slate-400 text-sm md:text-base font-bold px-2 flex items-center">0 WINS</span>}
            </div>
            <h2 className="text-xs md:text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-widest order-1 md:order-2 whitespace-nowrap">RED TEAM</h2>
          </div>
  
          {/* Question Area */}
          <div className="hidden md:flex bg-red-800/80 flex-1 rounded-3xl p-4 md:p-8 items-center justify-center shadow-inner mb-6 relative overflow-hidden border border-red-400/20">
            <p className="text-slate-800 dark:text-white text-2xl md:text-4xl font-black text-center leading-snug drop-shadow-sm">
              {renderQuestionText(rightTeam.q?.text || "")}
            </p>
            {rightTeam.stunned && (
              <div className="absolute inset-0 bg-red-600/60 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <span className="text-slate-800 dark:text-white font-black italic text-3xl drop-shadow-lg">MISS!</span>
              </div>
            )}
          </div>
  
          {/* Options Grid (Now at the bottom) */}
          <div className={`grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4 flex-1 md:flex-none ${rightTeam.stunned ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            {rightTeam.q?.options.map((opt: string, idx: number) => (
              <button key={idx} onClick={() => handleAnswer('right', idx)}
                className={`bg-white hover:bg-red-50 text-red-900 rounded-xl md:rounded-3xl py-3 md:py-6 text-base md:text-3xl font-black shadow-[0_6px_0_#991b1b] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center md:justify-between px-2 md:px-8 relative overflow-hidden ${rightTeam.frozen ? 'pointer-events-none border-4 border-cyan-300' : ''}`}>
                <span className="hidden md:inline text-red-400 font-bold bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-lg text-sm md:text-xl uppercase relative z-10">{rightTeam.q?.options.length === 2 ? ['←', '→'][idx] : ['↑', '←', '↓', '→'][idx] || (idx + 1)}</span>
                <span className="relative z-10">{opt}</span>
                {rightTeam.frozen && (
                  <div className="absolute inset-0 bg-cyan-200/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                     <span className="text-3xl md:text-5xl opacity-80 rotate-[-10deg]">❄️</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
}

function GameEditor({ game, onSave, onCancel, folders }: { game: GameData, onSave: (q: GameData) => void, onCancel: () => void, folders: { id: string; name: string }[] }) {
  const [folderId, setFolderId] = useState(game.folderId || "");
  const [topic, setTopic] = useState(game.topic || "");
  const [classLevel, setClassLevel] = useState(game.classLevel || "");
  const [questions, setQuestions] = useState<Question[]>(() => {
    return game.questions.map(q => {
        if (!q.options) return q;
        const newOpts = [...q.options];
        while (newOpts.length > 2 && newOpts[newOpts.length - 1] === "") {
            newOpts.pop();
        }
        return { ...q, options: newOpts };
    });
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [activeGiphyInput, setActiveGiphyInput] = useState<{ qId: number | string, optIndex: number } | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: ['', ''], answerIndex: 0 }]);
  };

  const updateQuestion = (id: number | string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: number | string, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (qId: number | string) => {
    setQuestions(questions.map(q => {
        if (q.id === qId && q.options.length < 6) {
            return { ...q, options: [...q.options, ''] };
        }
        return q;
    }));
  };

  const removeOption = (qId: number | string) => {
    setQuestions(questions.map(q => {
        if (q.id === qId && q.options.length > 2) {
            const newOptions = [...q.options];
            newOptions.pop();
            const newAnswerIndex = q.answerIndex >= newOptions.length ? newOptions.length - 1 : q.answerIndex;
            return { ...q, options: newOptions, answerIndex: newAnswerIndex };
        }
        return q;
    }));
  };

  const removeQuestion = (id: number | string) => {
    setQuestions(prev => {
      if (prev.length > 1) {
        return prev.filter(q => q.id !== id);
      }
      return prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index === questions.length - 1) {
        addQuestion();
        setTimeout(() => {
          const nextInput = document.getElementById(`question-input-${index + 1}`);
          nextInput?.focus();
        }, 50);
      } else {
        const nextInput = document.getElementById(`question-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const handleApplyBulkPaste = (action: 'replace' | 'append') => {
    const parsed = parsePastedQuiz(bulkText);
    if (parsed.length === 0) {
      setErrorMsg("Please enter or paste at least one item.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    const newItems: Question[] = parsed.map((item, i) => ({
      id: Date.now() + i + Math.random(),
      text: item.text || "",
      options: item.options || ["", ""],
      answerIndex: item.answerIndex || 0,
    }));

    if (action === 'replace') {
      setQuestions(newItems);
    } else {
      setQuestions(prev => {
        if (prev.length === 1 && !prev[0].text.trim()) {
          return newItems;
        }
        return [...prev, ...newItems];
      });
    }
    
    setShowBulkPasteModal(false);
    setBulkText("");
    setToastMsg(`Successfully added ${newItems.length} items!`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleBulkPaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText) return;

    const parsedItems = parsePastedQuiz(pastedText);
    
    if (parsedItems.length === 1 && parsedItems[0].text === pastedText && parsedItems[0].options?.every(o => !o)) {
       return;
    }

    if (parsedItems.length > 0) {
      e.preventDefault();
      
      const newItems: Question[] = parsedItems.map((item, i) => ({
        id: Date.now() + i + Math.random(),
        text: item.text || "",
        options: item.options || ["", ""],
        answerIndex: item.answerIndex || 0,
      }));

      setQuestions(prev => {
        if (prev.length === 1 && !prev[0].text.trim()) {
          return newItems;
        }
        return [...prev, ...newItems];
      });
      setToastMsg(`Smart Paste: Added ${newItems.length} items`);
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  const duplicateQuestion = (index: number) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      const qToCopy = prev[index];
      const duplicatedQ = {
        ...qToCopy,
        id: Date.now() + Math.random(),
        options: [...qToCopy.options]
      };
      newQuestions.splice(index + 1, 0, duplicatedQ);
      return newQuestions;
    });
  };


  const initiateSave = () => {
    const validQuestions = questions.filter(q => q.text.trim());
    if(validQuestions.length === 0) {
      setErrorMsg("Please add at least one complete question.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setShowPublishModal(true);
  };

  const handleSave = (isPublic: boolean) => {
    const generatedTitle = "Sumo Showdown";
    const validQuestions = questions.filter(q => q.text.trim());
    
    onSave({
      ...game,
      title: generatedTitle,
      folderId,
      topic,
      classLevel,
      questions: validQuestions,
      isPublic
    });
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar">
      <div className="w-full min-h-full flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl mb-8">
  
        {toastMsg && (
          <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
            <Sparkles size={18} /> {toastMsg}
          </div>
        )}

        {/* Bulk Paste Modal */}
        {showBulkPasteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-5 transform scale-100 animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Bulk Add Q&As</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Paste text to automatically generate questions</p>
                  </div>
                </div>
                <button onClick={() => setShowBulkPasteModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">Supported formats:</h4>
                <ul className="text-xs text-blue-600/80 dark:text-blue-400/80 space-y-1 list-disc list-inside">
                  <li><strong>Standard text:</strong> Paste a list of terms/questions, one per line.</li>
                  <li><strong>Excel/Sheets:</strong> Copy cells (Question | Option1 | Option2 | Option3 | Option4).</li>
                  <li><strong>Numbered Q&As:</strong> "1. Question?\nA. Option 1\nB. Option 2".</li>
                </ul>
              </div>

              <textarea 
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Paste your questions here..."
                className="w-full h-64 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-white p-4 rounded-xl focus:border-cyan-500 resize-none font-medium text-sm leading-relaxed"
              ></textarea>

              {bulkText.trim() && (
                <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in">
                  <Sparkles size={16} />
                  <p>
                    Found <span className="font-bold text-slate-800 dark:text-white">{parsePastedQuiz(bulkText).length}</span> items. 
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => handleApplyBulkPaste('replace')}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Replace All
                </button>
                <button 
                  onClick={() => handleApplyBulkPaste('append')}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                >
                  Append to End
                </button>
              </div>
            </div>
          </div>
        )}

      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 transform scale-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white text-center">Publish Game?</h3>
            <p className="text-slate-600 dark:text-slate-300 text-center font-medium">
              Would you like to publish this game to the Community so other teachers can use it?
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={() => handleSave(true)}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Yes, Publish (Public)
              </button>
              <button 
                onClick={() => handleSave(false)}
                className="w-full py-4 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-lg transition-colors"
              >
                No, Keep Private
              </button>
            </div>
            <button 
              onClick={() => setShowPublishModal(false)}
              className="mt-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-slate-800/80 p-8 flex flex-col gap-6 border-b-2 border-blue-500/50">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-wide">GAME SETUP</h2>
                <div className="flex gap-3 items-center">
                    <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={initiateSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer">
                        <Save size={18} /> Save GameData
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Topic</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Present Simple" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Class Level</label>
                    <input 
                      type="text" 
                      placeholder="e.g. KET, Starters" 
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Folder</label>
                    <select 
                      value={folderId}
                      onChange={(e) => setFolderId(e.target.value)}
                      className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="">No Folder (Root)</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                </div>
            </div>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 text-red-400 p-3 mx-6 mt-6 rounded-lg font-medium text-center border border-red-500/30 animate-pulse">
            {errorMsg}
          </div>
        )}

        <div className="p-6 flex flex-col gap-6 bg-slate-100 dark:bg-slate-900/50" onPaste={handleBulkPaste}>
          {/* Smart Paste Banner */}
          <div className="bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold">
                <Info size={18} />
              </div>
              <p className="text-xs sm:text-sm font-medium">
                <span className="font-bold">Smart Paste:</span> Paste multiple lines, numbered Q&As, or Excel rows directly into any box below — they will automatically populate!
              </p>
            </div>
            <button
              onClick={() => setShowBulkPasteModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer self-end sm:self-auto"
            >
              <ClipboardList size={14} /> Bulk Paste Modal
            </button>
          </div>

          {questions.map((q, index) => (
            <div key={q.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-300 dark:border-slate-700 shadow-sm relative group">
              <button 
                onClick={() => duplicateQuestion(index)}
                title="Duplicate Question"
                className="absolute right-6 -top-3 w-8 h-8 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500 hover:text-white border-2 border-white dark:border-slate-800 cursor-pointer z-10"
              >
                <Copy size={14} />
              </button>
              <button 
                onClick={() => removeQuestion(q.id)}
                className="absolute -right-3 -top-3 w-8 h-8 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white border-2 border-white dark:border-slate-800 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="flex gap-4 mb-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30">
                  {index + 1}
                </div>
                <input 
                  id={`question-input-${index}`}
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder="Type your question here..."
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium"
                />
              </div>

              <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name={`answer-${q.id}`} 
                      checked={q.answerIndex === optIndex}
                      onChange={() => updateQuestion(q.id, 'answerIndex', optIndex)}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    />
                    {opt.startsWith('data:image') || opt.startsWith('http') ? (
                      <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 pr-3">
                        <img src={opt} alt="Option" className="w-8 h-8 rounded object-cover" />
                        <span className="text-xs text-slate-400 flex-1 truncate">Image/GIF</span>
                        <button onClick={() => updateOption(q.id, optIndex, '')} className="text-red-400 hover:text-red-300 cursor-pointer p-1">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <input 
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                          className={`flex-1 min-w-0 bg-slate-50 dark:bg-slate-900 border ${q.answerIndex === optIndex ? 'border-blue-500/50 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'} rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm font-medium`}
                        />
                        <button 
                          onClick={() => setActiveGiphyInput({ qId: q.id, optIndex })}
                          className="bg-purple-500/20 text-purple-400 p-2 rounded-lg hover:bg-purple-500 hover:text-white transition-colors shrink-0 cursor-pointer flex items-center justify-center"
                          title="Search Giphy"
                        >
                          <ImageIcon size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="ml-12 mt-3 flex gap-2">
                  <button onClick={() => addOption(q.id)} disabled={q.options.length >= 6} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 cursor-pointer">+ Option</button>
                  <button onClick={() => removeOption(q.id)} disabled={q.options.length <= 2} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 cursor-pointer">- Option</button>
              </div>
            </div>
          ))}

          <button 
            onClick={addQuestion}
            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={20} /> Add Another Question
          </button>
        </div>
      </div>
      </div>
      
      <MediaPickerModal 
        isOpen={activeGiphyInput !== null}
        onClose={() => setActiveGiphyInput(null)}
        onSelect={(url) => {
          if (activeGiphyInput) {
            updateOption(activeGiphyInput.qId, activeGiphyInput.optIndex, url);
            setActiveGiphyInput(null);
          }
        }}
      />
    </div>
  );
}

function parsePastedQuiz(rawText: string): Partial<Question>[] {
  if (!rawText || !rawText.trim()) return [];
  const items: Partial<Question>[] = [];
  
  if (rawText.includes('\t')) {
    const lines = rawText.split(/\r?\n/).filter(line => line.trim());
    lines.forEach(line => {
      const parts = line.split('\t').map(p => p.trim());
      if (parts.length > 0) {
        items.push({
          text: parts[0],
          options: [
            parts[1] || "",
            parts[2] || "",
            parts[3] || "",
            parts[4] || ""
          ],
          answerIndex: 0
        });
      }
    });
    if (items.length > 0) {
      items.forEach(q => {
         if (q.options) {
            while (q.options.length > 2 && q.options[q.options.length - 1] === "") {
                q.options.pop();
            }
         }
      });
      return items;
    }
  }
  
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let currentQ: Partial<Question> | null = null;
  const optionRegex = /^([a-eA-E1-4])[\.\)\:\-]\s+(.*)/;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    const ansMatch = line.match(/^answer\s*[:=]?\s*([a-eA-E1-4])/i);
    if (ansMatch) {
       if (currentQ) {
          const val = ansMatch[1].toUpperCase();
          if (/[A-E]/.test(val)) currentQ.answerIndex = val.charCodeAt(0) - 65;
          else if (/[1-4]/.test(val)) currentQ.answerIndex = parseInt(val) - 1;
       }
       continue;
    }

    let inlineAnswerMatch = line.match(/\banswer\s*[:=]?\s*([a-eA-E1-4])\b/i);
    let inlineAnswerIndex = -1;
    if (inlineAnswerMatch) {
       const val = inlineAnswerMatch[1].toUpperCase();
       if (/[A-E]/.test(val)) inlineAnswerIndex = val.charCodeAt(0) - 65;
       else if (/[1-4]/.test(val)) inlineAnswerIndex = parseInt(val) - 1;
       line = line.replace(inlineAnswerMatch[0], '').trim();
    }
    
    if (line === '') continue;
    
    const optMatch = line.match(optionRegex);
    if (optMatch) {
       if (!currentQ) {
          currentQ = { text: "Question", options: ["", "", "", ""], answerIndex: 0 };
          items.push(currentQ);
       }
       
       const optText = optMatch[2].trim();
       const prefix = optMatch[1].toUpperCase();
       let expectedIndex = -1;
       if (/[A-E]/.test(prefix)) expectedIndex = prefix.charCodeAt(0) - 65;
       else if (/[1-4]/.test(prefix)) expectedIndex = parseInt(prefix) - 1;
       
       if (expectedIndex >= 0 && expectedIndex < 4) {
           currentQ.options![expectedIndex] = optText;
       } else {
           const emptyIdx = currentQ.options!.findIndex(o => o === "");
           if (emptyIdx !== -1) currentQ.options![emptyIdx] = optText;
       }
       
       if (inlineAnswerIndex !== -1) {
           currentQ.answerIndex = inlineAnswerIndex;
       }
    } else {
       const hasOptions = currentQ && currentQ.options!.some(o => o !== "");
       const qText = line.replace(/^(?:\d+[\.\)\:\-]|\[\d+\])\s+/, "");
       
       if (!currentQ || hasOptions) {
           currentQ = { text: qText, options: ["", "", "", ""], answerIndex: 0 };
           items.push(currentQ);
           if (inlineAnswerIndex !== -1) {
               currentQ.answerIndex = inlineAnswerIndex;
           }
       } else {
           currentQ.text += " " + qText;
           if (inlineAnswerIndex !== -1) {
               currentQ.answerIndex = inlineAnswerIndex;
           }
       }
    }
  }

  const allEmptyOptions = items.every(q => q.options!.every(o => o === ""));
  
  // Clean up trailing empty options, keeping minimum 2 options
  items.forEach(q => {
     if (q.options) {
        while (q.options.length > 2 && q.options[q.options.length - 1] === "") {
            q.options.pop();
        }
     }
  });

  if (allEmptyOptions && items.length > 0) {
     return items; 
  }

  return items;
}
