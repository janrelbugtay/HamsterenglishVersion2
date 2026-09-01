import { MediaPickerModal } from "../components/MediaPickerModal";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewState } from "../types";
import { FullscreenButton } from "../components/FullscreenButton";
import { ArrowLeft, Edit3, Trash2, Heart, Plus, Sparkles, BookOpen, Search, Save, X, Play, Folder, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
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

const SumoCharacter = ({ team, isPushing, isStunned, positionStyle, flip }: any) => {
  const isLeft = team === 'left';
  const clothingColor = isLeft ? "#2563eb" : "#dc2626";

  let rotation = 0;
  let translateX = 0;
  let translateY = 0;

  if (isPushing) {
    rotation = isLeft ? 15 : -15;
    translateX = isLeft ? 35 : -35;
  } else if (isStunned) {
    rotation = isLeft ? -25 : 25; 
    translateX = isLeft ? -25 : 25;
    translateY = 15;
  }

  const transform = `rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px)`;

  return (
    <div 
      className="absolute bottom-4 z-10 w-28 h-36 md:w-56 md:h-64 transition-all duration-200 ease-out origin-bottom"
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
          {isStunned ? (
            <g>
              <path d="M 35 45 L 45 55 M 45 45 L 35 55" stroke="#1f2937" strokeWidth="3" />
              <path d="M 65 45 L 75 55 M 75 45 L 65 55" stroke="#1f2937" strokeWidth="3" />
              <path d="M 45 65 Q 55 60 65 65" fill="none" stroke="#1f2937" strokeWidth="2" />
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
        </g>
      </svg>
    </div>
  );
};

export function Sumo({ onViewChange, initialGame }: { onViewChange: (view: ViewState) => void, initialGame?: any }) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<'menu' | 'playing' | 'end' | 'setup'>(initialGame && !initialGame.editMode ? 'menu' : 'setup'); 
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

  const generateQuestion = () => {
    const q = questionsDB[Math.floor(Math.random() * questionsDB.length)];
    let options = [...q.options].filter(o => o.trim() !== "");
    if (options.length < 2) options = ["Yes", "No"];
    
    // Pick the correct answer and a random wrong answer
    const correctOpt = q.options[q.answerIndex] || options[0];
    const wrongOpts = options.filter((_, i) => i !== q.answerIndex);
    const wrongOpt = wrongOpts.length > 0 ? wrongOpts[Math.floor(Math.random() * wrongOpts.length)] : (correctOpt === options[0] ? options[1] : options[0]);

    // Randomize position
    const shuffledOpts = Math.random() > 0.5 ? [correctOpt, wrongOpt] : [wrongOpt, correctOpt];
    
    return {
      text: q.text,
      options: shuffledOpts,
      correctIndex: shuffledOpts.indexOf(correctOpt)
    };
  };

  const [leftTeam, setLeftTeam] = useState<any>({ score: 0, q: null, stunned: false, pushing: false });
  const [rightTeam, setRightTeam] = useState<any>({ score: 0, q: null, stunned: false, pushing: false });
  const [battlePos, setBattlePos] = useState(50);
  const [winner, setWinner] = useState<string | null>(null);

  const stateRef = useRef({ screen, leftTeam, rightTeam, battlePos });
  useEffect(() => {
    stateRef.current = { screen, leftTeam, rightTeam, battlePos };
  }, [screen, leftTeam, rightTeam, battlePos]);

  const startGame = () => {
    setLeftTeam({ score: 0, q: generateQuestion(), stunned: false, pushing: false });
    setRightTeam({ score: 0, q: generateQuestion(), stunned: false, pushing: false });
    setBattlePos(50);
    setWinner(null);
    setScreen('playing');
  };

  const handleAnswer = useCallback((teamStr: string, selectedIndex: number) => {
    const state = stateRef.current;
    if (state.screen !== 'playing') return;

    const isLeft = teamStr === 'left';
    const teamState = isLeft ? state.leftTeam : state.rightTeam;
    const setTeamState = isLeft ? setLeftTeam : setRightTeam;

    if (teamState.stunned || teamState.pushing) return;

    if (selectedIndex === teamState.q.correctIndex) {
      setTeamState((prev: any) => ({ ...prev, pushing: true, score: prev.score + 1 }));
      const shiftAmount = 12; 
      
      setBattlePos(prev => {
        const next = isLeft ? prev + shiftAmount : prev - shiftAmount;
        if (next >= 98) { setWinner('Blue Team'); setScreen('end'); }
        if (next <= 2) { setWinner('Red Team'); setScreen('end'); }
        return next;
      });
      
      setTimeout(() => {
        setTeamState((prev: any) => ({ ...prev, pushing: false, q: generateQuestion() }));
      }, 400);
    } else {
      setTeamState((prev: any) => ({ ...prev, stunned: true }));
      setBattlePos(prev => Math.max(2, Math.min(98, isLeft ? prev - 10 : prev + 10)));
      setTimeout(() => setTeamState((prev: any) => ({ ...prev, stunned: false })), 1200);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.screen !== 'playing') return;
      const key = e.key.toLowerCase();
      // Left Team Controls: A and D
      if (key === 'a') handleAnswer('left', 0);
      if (key === 'd') handleAnswer('left', 1);
      // Right Team Controls: Left Arrow and Right Arrow
      if (key === 'arrowleft') handleAnswer('right', 0);
      if (key === 'arrowright') handleAnswer('right', 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer]);

  const renderQuestionText = (text: string) => {
    const parts = text.split('____');
    if (parts.length === 1) return text;
    return parts.map((part, i, arr) => (
      <React.Fragment key={i}>
        {part}
        {i !== arr.length - 1 && (
          <span className="inline-block border-b-4 border-yellow-400 min-w-[3rem] mx-1 text-yellow-300">
            &nbsp;
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
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] text-center shadow-2xl border-b-8 border-yellow-500 max-w-lg w-full">
          <div className="mb-6 flex justify-center gap-6 animate-pulse">
             <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-blue-900 shadow-lg"></div>
             <div className="w-12 h-12 bg-red-600 rounded-full border-4 border-red-900 shadow-lg"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-indigo-900 italic uppercase tracking-tighter leading-tight">{activeGame?.title || "QUESTION TAGS SHOWDOWN"}</h1>
          <p className="text-slate-500 mb-8 font-bold text-lg uppercase tracking-widest">{activeGame?.topic || "Master the Tags"}</p>
          <button onClick={startGame} className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-2xl font-black px-12 py-6 rounded-full shadow-[0_8px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all w-full md:w-auto">
            START BATTLE
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
        </div>

        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] text-center shadow-2xl border-8 border-yellow-400">
          <h2 className={`text-5xl md:text-7xl font-black mb-4 uppercase italic ${winner === 'Blue Team' ? 'text-blue-600' : 'text-red-600'}`}>
            {winner}
          </h2>
          <p className="text-2xl font-black text-slate-800 mb-10 uppercase tracking-widest">Wins the Match!</p>
          <button onClick={() => setScreen('menu')} className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-2xl font-black px-12 py-5 rounded-full shadow-[0_6px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all">
            Play Again
          </button>
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
        </div>
  
        {/* Blue Team Side */}
        <div className="w-full md:w-1/4 bg-blue-700 rounded-3xl md:rounded-[2.5rem] flex flex-row md:flex-col p-3 md:p-6 pt-16 md:pt-16 shadow-2xl border-b-4 md:border-b-0 md:border-r-8 border-blue-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center mb-0 md:mb-6 pr-4 md:pr-0">
            <h2 className="text-xs md:text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-widest whitespace-nowrap">BLUE TEAM</h2>
            <div className="bg-slate-200 dark:bg-black/30 px-3 md:px-4 py-1 md:py-2 rounded-xl text-xl md:text-3xl font-black text-slate-800 dark:text-white">{leftTeam.score}</div>
          </div>
          
          <div className="hidden md:flex bg-blue-800/80 flex-1 rounded-3xl p-4 md:p-8 items-center justify-center shadow-inner mb-6 relative overflow-hidden border border-blue-400/20">
            <p className="text-slate-800 dark:text-white text-lg md:text-2xl font-bold text-center leading-relaxed">
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
                className="bg-white hover:bg-blue-50 text-blue-900 rounded-xl md:rounded-3xl py-3 md:py-6 text-sm md:text-2xl font-black shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center md:justify-between px-2 md:px-8">
                <span className="hidden md:inline text-blue-400">{idx + 1}:</span>
                <span>{opt}</span>
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
  
          <div className="absolute top-1/2 w-full h-0 transition-all duration-300 ease-out"
               style={{ left: `${battlePos}%` }}>
            <SumoCharacter team="left" 
              isPushing={leftTeam.pushing} isStunned={leftTeam.stunned} flip={false}
              positionStyle={{ left: '-110px', bottom: '-1rem' }} />
            <SumoCharacter team="right" 
              isPushing={rightTeam.pushing} isStunned={rightTeam.stunned} flip={true}
              positionStyle={{ left: '0px', bottom: '-1rem' }} />
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
            <div className="bg-slate-200 dark:bg-black/30 px-3 md:px-4 py-1 md:py-2 rounded-xl text-xl md:text-3xl font-black text-slate-800 dark:text-white order-2 md:order-1">{rightTeam.score}</div>
            <h2 className="text-xs md:text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-widest order-1 md:order-2 whitespace-nowrap">RED TEAM</h2>
          </div>
  
          {/* Question Area */}
          <div className="hidden md:flex bg-red-800/80 flex-1 rounded-3xl p-4 md:p-8 items-center justify-center shadow-inner mb-6 relative overflow-hidden border border-red-400/20">
            <p className="text-slate-800 dark:text-white text-lg md:text-2xl font-bold text-center leading-relaxed">
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
                className="bg-white hover:bg-red-50 text-red-900 rounded-xl md:rounded-3xl py-3 md:py-6 text-sm md:text-2xl font-black shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center md:justify-between px-2 md:px-8">
                <span className="hidden md:inline text-red-400 uppercase">{idx + 1}:</span>
                <span>{opt}</span>
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
  const [questions, setQuestions] = useState<Question[]>(game.questions);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeGiphyInput, setActiveGiphyInput] = useState<{ qId: number | string, optIndex: number } | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', '', ''], answerIndex: 0 }]);
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

        <div className="p-6 flex flex-col gap-6 bg-slate-100 dark:bg-slate-900/50">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-300 dark:border-slate-700 shadow-sm relative group">
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

