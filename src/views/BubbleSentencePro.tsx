import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from "../types";
import { FullscreenButton } from "../components/FullscreenButton";
import { ArrowLeft, Edit3, Trash2, Save, Play, Plus, Sparkles, ClipboardList, Check, Info, Layers } from "lucide-react";
import { collection, query, where, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

type GameScreen = 'editor' | 'setup' | 'loading' | 'game';

interface Sentence {
  id: number | string;
  text: string;
  emoji: string;
  diff: number;
}

interface GameData {
  id: number | string;
  title?: string;
  folderId?: string;
  topic?: string;
  classLevel?: string;
  sentences: Sentence[];
  isPublic?: boolean;
  mode?: 'word' | 'anagram';
}

export function BubbleSentencePro({ onViewChange, initialGame }: { onViewChange: (view: ViewState) => void, initialGame?: any }) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<GameScreen>(initialGame ? 'setup' : 'editor');
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [activeGame, setActiveGame] = useState<GameData>(() => {
    if (initialGame) {
      return {
        id: initialGame.id,
        title: initialGame.name || "",
        folderId: initialGame.folderId || "",
        topic: initialGame.topic || "",
        classLevel: initialGame.className || "",
        sentences: initialGame.customSentences || [],
        mode: initialGame.mode || 'word',
      };
    }
    return {
      id: Date.now(),
      title: "",
      folderId: "",
      topic: "",
      classLevel: "",
      sentences: [{ id: Date.now(), text: "", emoji: "✨", diff: 1 }],
      mode: 'word',
    };
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === 'QUIT_GAME') {
        setScreen('setup');
      } else if (e.data.type === 'IFRAME_READY') {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'LOAD_GAME',
                data: activeGame
            }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeGame]);

  useEffect(() => {
    if (user) {
      const fetchFolders = async () => {
        const qFolders = query(collection(db, "gameFolders"), where("userId", "==", user.uid));
        const foldersSnap = await getDocs(qFolders);
        const f: any[] = [];
        foldersSnap.forEach(doc => f.push({ id: doc.id, ...doc.data() }));
        setFolders(f);
      };
      fetchFolders();
    }
  }, [user]);

  
  const saveGame = async (gameData: GameData) => {
    if (!user) {
      alert("You must be logged in to save games.");
      return;
    }

    // Go to games view instantly for a snappy feel
    onViewChange("games");

    try {
      const gameToSave = JSON.parse(JSON.stringify({
        name: gameData.title || "",
        folderId: gameData.folderId || "",
        topic: gameData.topic || "",
        className: gameData.classLevel || "",
        gameType: "bubble-sentence-pro",
        customSentences: gameData.sentences,
        mode: gameData.mode || "word",
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
    } catch (error) {
      console.error("Error saving game:", error);
      // alert("Error saving game.");
    }
  };

  const startGame = () => {
    setScreen('game');
  };

  return (
    <div id="game-container" className="w-full h-full flex flex-col relative bg-slate-50 dark:bg-slate-900 overflow-hidden -mx-4 md:-mx-8 -my-4 md:-my-8">
      
      {screen !== 'game' && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[100px]"></div>
        </div>
      )}

      {screen !== 'game' && (
        <div className="p-6 flex items-center justify-between z-10 relative">
            <button 
                onClick={() => onViewChange('games')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
                <ArrowLeft size={20} /> Back
            </button>
        </div>
      )}

      {screen === 'editor' && (
        <GameEditor 
          game={activeGame} 
          onSave={saveGame} 
          onCancel={() => onViewChange('games')} 
          folders={folders}
        />
      )}

      {screen === 'setup' && (
        <div className="absolute inset-0 z-40 bg-gradient-to-b from-sky-400 to-blue-200 dark:from-sky-900 dark:to-blue-950 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Immersive Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300/30 rounded-full blur-3xl"></div>
                {/* Clouds */}
                <div className="absolute top-20 left-[10%] opacity-80 animate-float" style={{ animationDelay: '0s' }}>
                    <div className="w-24 h-8 bg-white rounded-full absolute top-4 left-4"></div>
                    <div className="w-16 h-16 bg-white rounded-full absolute top-0 left-8"></div>
                    <div className="w-12 h-12 bg-white rounded-full absolute top-2 left-2"></div>
                </div>
                <div className="absolute top-40 right-[15%] opacity-60 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-32 h-10 bg-white rounded-full absolute top-6 left-6"></div>
                    <div className="w-20 h-20 bg-white rounded-full absolute top-0 left-10"></div>
                </div>
                {/* Floating Bubbles */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute rounded-full border border-white/40 bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-[2px] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] animate-float-up"
                        style={{
                            width: `${Math.random() * 40 + 20}px`,
                            height: `${Math.random() * 40 + 20}px`,
                            left: `${Math.random() * 100}%`,
                            bottom: `-${Math.random() * 20 + 10}%`,
                            animationDuration: `${Math.random() * 10 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    >
                        <div className="absolute top-[15%] left-[20%] w-1/4 h-1/4 bg-white/60 rounded-full blur-[1px]"></div>
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-6xl sm:text-7xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-100 drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)] text-center tracking-tight" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
                    Bubble Island
                </h2>
                
                <div className="flex gap-8 max-w-2xl w-full justify-center perspective-[1000px]">
                    <button onClick={startGame} className="group relative w-full sm:w-80 h-80 rounded-[3rem] bg-white/20 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-white/30 hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-center p-8">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-black/20 pointer-events-none"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full blur-2xl group-hover:bg-blue-400/50 transition-colors"></div>
                        
                        <div className="relative z-10 text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" style={{ animation: 'bounce-idle 3s infinite ease-in-out' }}>
                            🫧
                        </div>
                        <h3 className="relative z-10 text-3xl font-black text-white mb-2 drop-shadow-md">Play Game</h3>
                        <p className="relative z-10 text-blue-50 font-medium text-center">Start popping bubbles!</p>
                    </button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mt-12 relative z-10">
                  <button onClick={() => onViewChange('games')} className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/30 text-xl font-bold text-white border border-white/40 cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    <ArrowLeft size={24} /> Back to Games
                  </button>

                </div>
            </div>
        </div>
      )}

      {screen === 'game' && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white" id="game-container">
            <div className="absolute top-4 right-4 z-10">
                <FullscreenButton targetId="game-container" />
            </div>
            <iframe
                ref={iframeRef}
                src={`/bubble-sentence.html?v=${Date.now()}`}
                className="w-full flex-1 border-none"
                title="Bubble Island"
                onLoad={() => { if (iframeRef.current?.contentWindow) {
                      iframeRef.current.contentWindow.postMessage({
                          type: 'LOAD_GAME',
                          data: activeGame
                      }, '*');
                  }
                }}
            />
        </div>
      )}
    </div>
  );
}

function parsePastedSentences(rawText: string, mode: 'word' | 'anagram' = 'word'): string[] {
  if (!rawText || !rawText.trim()) return [];

  const text = rawText.trim();
  let items: string[] = [];

  // 1. Check if text contains explicit newlines
  if (text.includes('\n') || text.includes('\r')) {
    items = text.split(/\r?\n/);
  }
  // 2. Check if numbered list on a single or unformatted line, e.g. "1. First sentence 2. Second sentence 3. Third sentence" or "1) Apple 2) Banana"
  else if (/(?:^|\s+)(?:\d+[\.\)\:\-]|\[\d+\])\s+/.test(text)) {
    const splitByNumbers = text.split(/(?:^|\s+)(?:\d+[\.\)\:\-]|\[\d+\])\s+/).filter(Boolean);
    if (splitByNumbers.length > 1) {
      items = splitByNumbers;
    }
  }

  // 3. If still 1 item, evaluate mode and delimiters
  if (items.length <= 1) {
    if (mode === 'anagram') {
      // In anagram (word/phrase) mode, check comma, semicolon, tab
      if (text.includes(',') || text.includes(';') || text.includes('\t')) {
        items = text.split(/[,;\t]/);
      }
    } else {
      // In sentence mode:
      if (text.includes(';') || text.includes('\t')) {
        items = text.split(/[;\t]/);
      } else {
        // Match sentences ending in . ! ? followed by whitespace and a capital letter or end of string
        const sentenceMatches = text.match(/[^.!?]+[.!?]+(?=(?:\s+[A-Z0-9"'])|$)|[^.!?]+$/g);
        if (sentenceMatches && sentenceMatches.length > 1) {
          items = sentenceMatches;
        }
      }
    }
  }

  // Clean each item: remove leading numberings/bullets, trim extra whitespace
  const cleaned = (items.length > 0 ? items : [text])
    .map(item => {
      let s = item.trim();
      // Remove leading numbering like "1. ", "1) ", "1- ", "[1] ", "• ", "- ", "* ", "1: "
      s = s.replace(/^(?:\d+[\.\)\:\-]\s*|\[\d+\]\s*|[\-\*\•\–\—\>]\s*)+/g, '').trim();
      return s;
    })
    .filter(s => s.length > 0);

  return cleaned;
}

function GameEditor({ game, onSave, onCancel, folders }: { game: GameData, onSave: (g: GameData) => void, onCancel: () => void, folders: { id: string; name: string }[] }) {
  const [folderId, setFolderId] = useState(game.folderId || "");
  const [topic, setTopic] = useState(game.topic || "");
  const [classLevel, setClassLevel] = useState(game.classLevel || "");
  const [mode, setMode] = useState<'word' | 'anagram'>(game.mode || 'word');
  const [sentences, setSentences] = useState<Sentence[]>(game.sentences);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const addSentence = () => {
    setSentences([...sentences, { id: Date.now(), text: '', emoji: '✨', diff: 1 }]);
  };

  const updateSentence = (id: number | string, field: keyof Sentence, value: any) => {
    setSentences(sentences.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSentence = (id: number | string) => {
    setSentences(prev => {
      if (prev.length > 1) {
        return prev.filter(s => s.id !== id);
      }
      return prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index === sentences.length - 1) {
        // If it's the last sentence, add a new one and focus it
        addSentence();
        setTimeout(() => {
          const nextInput = document.getElementById(`sentence-input-${index + 1}`);
          nextInput?.focus();
        }, 50);
      } else {
        // Just focus the next input
        const nextInput = document.getElementById(`sentence-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText) return;

    const parsedItems = parsePastedSentences(pastedText, mode);

    if (parsedItems.length > 1) {
      e.preventDefault();
      
      const newItems: Sentence[] = parsedItems.map((text, i) => ({
        id: Date.now() + i + Math.random(),
        text,
        emoji: '✨',
        diff: 1,
      }));

      setSentences(prev => {
        const updated = [...prev];
        const current = updated[index];

        if (current && !current.text.trim()) {
          // If current slot is empty, replace it with the first parsed item and insert the rest
          updated.splice(index, 1, ...newItems);
        } else {
          // If current slot has text, insert new items right after this slot
          updated.splice(index + 1, 0, ...newItems);
        }
        return updated;
      });

      setToastMsg(`✨ Automatically divided into ${parsedItems.length} numbered ${mode === 'anagram' ? 'words' : 'sentences'}!`);
      setTimeout(() => setToastMsg(""), 3500);

      // Focus the last inserted element
      setTimeout(() => {
        const targetIdx = index + parsedItems.length - (sentences[index]?.text.trim() ? 0 : 1);
        const targetInput = document.getElementById(`sentence-input-${targetIdx}`);
        targetInput?.focus();
      }, 80);
    } else if (parsedItems.length === 1 && parsedItems[0] !== pastedText) {
      // If single item with leading numbers/bullets stripped, replace cleanly
      e.preventDefault();
      updateSentence(sentences[index].id, 'text', parsedItems[0]);
    }
  };

  const handleApplyBulkPaste = (action: 'replace' | 'append') => {
    const parsed = parsePastedSentences(bulkText, mode);
    if (parsed.length === 0) {
      setErrorMsg("Please enter or paste at least one item.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    const newItems: Sentence[] = parsed.map((text, i) => ({
      id: Date.now() + i + Math.random(),
      text,
      emoji: '✨',
      diff: 1,
    }));

    if (action === 'replace') {
      setSentences(newItems);
    } else {
      setSentences(prev => {
        // If the only element in prev is empty, replace it
        if (prev.length === 1 && !prev[0].text.trim()) {
          return newItems;
        }
        return [...prev, ...newItems];
      });
    }

    setToastMsg(`✨ Added ${parsed.length} numbered ${mode === 'anagram' ? 'words' : 'sentences'}!`);
    setTimeout(() => setToastMsg(""), 3500);
    setShowBulkPasteModal(false);
    setBulkText("");
  };

  const initiateSave = () => {
    const validSentences = sentences.filter(s => s.text.trim());
    if(validSentences.length === 0) {
      setErrorMsg("Please add at least one complete sentence.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setShowPublishModal(true);
  };

  const handleSave = (isPublic: boolean) => {
    const generatedTitle = "Bubble Island Game";
    const validSentences = sentences.filter(s => s.text.trim());
    
    onSave({
      ...game,
      title: generatedTitle,
      folderId,
      topic,
      classLevel,
      sentences: validSentences,
      mode,
      isPublic
    });
  };

  const previewBulkItems = parsePastedSentences(bulkText, mode);

  return (
    <div className="absolute inset-0 z-40 bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar pt-20">
      <div className="w-full min-h-full flex flex-col items-center pb-8 px-4">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col shadow-2xl mb-8 border border-white/20 dark:border-white/10">
        
        {/* Bulk Paste Modal */}
        {showBulkPasteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-5 transform scale-100 animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold">
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                      Bulk Paste & Auto-Divide
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Paste multiple sentences, numbered lists, or words. They will be divided into separate numbers.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowBulkPasteModal(false); setBulkText(""); }}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Paste Text Below (Supports multi-line, 1. 2. 3., bullet points, or paragraphs)
                </label>
                <textarea 
                  rows={6}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={mode === 'anagram' 
                    ? "Example:\n1. Elephant\n2. Crocodile\n3. Butterfly\n4. Kangaroo"
                    : "Example:\n1. The cat sleeps on the soft sofa.\n2. She reads a fascinating book every evening.\n3. Where are you going for summer vacation?"
                  }
                  className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white p-4 rounded-2xl focus:border-cyan-500 transition-colors custom-scrollbar"
                />
              </div>

              {/* Live division preview */}
              {previewBulkItems.length > 0 && (
                <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} /> Live Preview ({previewBulkItems.length} {mode === 'anagram' ? 'words' : 'sentences'} detected)
                    </span>
                  </div>
                  <div className="max-h-44 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {previewBulkItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {i + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium break-words flex-1">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={() => handleApplyBulkPaste('replace')}
                  disabled={previewBulkItems.length === 0}
                  className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Replace All List ({previewBulkItems.length})
                </button>
                <button
                  onClick={() => handleApplyBulkPaste('append')}
                  disabled={previewBulkItems.length === 0}
                  className="flex-1 py-3.5 px-4 rounded-xl font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Append to List ({previewBulkItems.length})
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
      <div className="bg-white dark:bg-slate-800 p-8 flex flex-col gap-6 border-b-2 border-cyan-500/50">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-wide">GAME SETUP</h2>
                <div className="flex gap-3 items-center">
                    <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={initiateSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer">
                        <Save size={18} /> Save Game
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Game Mode</label>
                    <select 
                      value={mode}
                      onChange={(e) => setMode(e.target.value as 'word' | 'anagram')}
                      className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-white px-4 py-3 rounded-xl focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="word">Words (Sentences)</option>
                      <option value="anagram">Anagram (Letters)</option>
                    </select>
                </div>
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

        {toastMsg && (
          <div className="bg-cyan-500/20 text-cyan-500 dark:text-cyan-300 p-3 mx-6 mt-6 rounded-xl font-bold text-center border border-cyan-500/30 animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-center gap-2 shadow-sm">
            <Sparkles size={18} /> {toastMsg}
          </div>
        )}

        <div className="p-6 flex flex-col gap-6 bg-slate-100 dark:bg-slate-900/50">
          
          {/* Smart Tip Bar */}
          <div className="bg-cyan-500/10 dark:bg-cyan-950/30 border border-cyan-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-cyan-900 dark:text-cyan-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                <Info size={18} />
              </div>
              <p className="text-xs sm:text-sm font-medium">
                <span className="font-bold">Smart Paste:</span> Paste multiple lines or numbered lists directly into any box below — they will automatically divide into numbered items!
              </p>
            </div>
            <button
              onClick={() => setShowBulkPasteModal(true)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer self-end sm:self-auto"
            >
              <ClipboardList size={14} /> Bulk Paste Modal
            </button>
          </div>

          {sentences.map((s, index) => (
            <div key={s.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-300 dark:border-slate-700 shadow-sm relative group transition-all hover:border-cyan-400/50">
              <button 
                onClick={() => removeSentence(s.id)}
                className="absolute -right-3 -top-3 w-8 h-8 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white border-2 border-white dark:border-slate-800 cursor-pointer z-10"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 font-bold flex items-center justify-center shrink-0 border border-cyan-500/30">
                  {index + 1}
                </div>
                <input 
                  id={`sentence-input-${index}`}
                  type="text"
                  value={s.text}
                  onChange={(e) => updateSentence(s.id, 'text', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  placeholder={mode === 'anagram' ? "Type or paste words here..." : "Type or paste your sentences here..."}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 text-slate-800 dark:text-white font-medium transition-colors"
                />
              </div>
            </div>
          ))}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={addSentence}
              className="flex-1 py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={20} /> {mode === 'anagram' ? "Add Another Word/Phrase" : "Add Another Sentence"}
            </button>

            <button 
              onClick={() => setShowBulkPasteModal(true)}
              className="sm:w-64 py-4 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl text-cyan-600 dark:text-cyan-400 font-bold hover:bg-cyan-50 dark:hover:bg-slate-700/80 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ClipboardList size={20} /> Paste Multiple List
            </button>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
}
