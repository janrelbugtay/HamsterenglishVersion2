const fs = require('fs');

let sumo = fs.readFileSync('src/views/Sumo.tsx', 'utf8');
let bubble = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// Get GameEditor from BubblePop
let quizEditorStartIndex = bubble.indexOf('function QuizEditor(');
let quizEditorFull = bubble.substring(quizEditorStartIndex);

quizEditorFull = quizEditorFull.replace(/QuizEditor/g, 'GameEditor');
quizEditorFull = quizEditorFull.replace(/quiz/g, 'game');
quizEditorFull = quizEditorFull.replace(/Quiz/g, 'GameData');
quizEditorFull = quizEditorFull.replace(/"Bubble Pop Game"/g, '"Sumo Showdown"');

const handleSaveTarget = /const handleSave = \(\) => \{[\s\S]*?onSave\(\{[\s\S]*?\}\);\n  \};/;
const handleSaveReplacement = `const [showPublishModal, setShowPublishModal] = useState(false);

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
  };`;
quizEditorFull = quizEditorFull.replace(handleSaveTarget, handleSaveReplacement);

quizEditorFull = quizEditorFull.replace(
    /<button onClick=\{handleSave\} className="flex items-center gap-2 px-6 py-2\.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500\/30 cursor-pointer">/g,
    '<button onClick={initiateSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer">'
);

const returnTarget = /<div className="bg-white dark:bg-slate-800\/80 p-8 flex flex-col gap-6 border-b-2 border-blue-500\/50">/;
const returnReplacement = `{showPublishModal && (
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
      <div className="bg-white dark:bg-slate-800/80 p-8 flex flex-col gap-6 border-b-2 border-blue-500/50">`;
quizEditorFull = quizEditorFull.replace(returnTarget, returnReplacement);

const sumoCharRegex = /const SumoCharacter = \(\{ team, isPushing, isStunned, positionStyle, flip \}: any\) => \{[\s\S]*?\};/;
let sumoChar = sumoCharRegex.exec(sumo)[0];

const gameBodyMatch = sumo.match(/<div id="game-container" className="h-\[calc\(100vh-2rem\)\] bg-slate-800 dark:bg-black flex flex-col font-sans overflow-hidden relative"[\s\S]*?\);/);
let gameBody = "";
if (gameBodyMatch) {
    gameBody = gameBodyMatch[0];
} else {
    // If it doesn't match that exact class, let's just grab everything after `if (gameState === 'end') { ... }` up to the end.
    let playStateMatch = sumo.match(/return \(\s*<div id="game-container" className="h-\[calc\(100vh-2rem\)\] bg-slate-800 dark:bg-black flex flex-col font-sans overflow-hidden relative"[\s\S]*?\);/);
    if(playStateMatch) {
       gameBody = playStateMatch[0];
    } else {
       // Just grab the main return statement of Sumo
       let lastReturn = sumo.substring(sumo.lastIndexOf('return ('));
       gameBody = lastReturn.substring(0, lastReturn.lastIndexOf('}') - 1);
    }
}

let fullSumoFile = `import React, { useState, useEffect, useCallback, useRef } from 'react';
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

${sumoChar}

export function Sumo({ onViewChange, initialGame }: { onViewChange: (view: ViewState) => void, initialGame?: any }) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<'menu' | 'playing' | 'end' | 'setup'>(initialGame ? 'setup' : 'menu'); 
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (user) {
      const fetchFolders = async () => {
        try {
          const qFolders = query(collection(db, 'folders'), where('userId', '==', user.uid));
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
          <h2 className={\`text-5xl md:text-7xl font-black mb-4 uppercase italic \${winner === 'Blue Team' ? 'text-blue-600' : 'text-red-600'}\`}>
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

  ${gameBody.replace(/^/gm, '  ')}
}

${quizEditorFull}
`;

fs.writeFileSync('src/views/Sumo.tsx', fullSumoFile);
console.log("Sumo updated.");
