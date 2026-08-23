const fs = require('fs');

const bottomPart = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8').split('()}')[1];

const topPart = `import React, { useState, useEffect } from 'react';
import { Gamepad2, Plus, Users, Library, ArrowRight, Share2, Edit2, Play, Trash2, FolderPlus, FolderOpen, MoreVertical, X, Sparkles, Star, Flame, Eye, Lock } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, deleteDoc, writeBatch, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { ViewState } from '../types';
import { GameThumbnail } from '../components/GameThumbnail';

export const GamesLibrary = ({ 
  onViewChange, 
  publishedGames = {},
  isAdmin = false
}: { 
  onViewChange: (view: ViewState, gameId?: any) => void;
  publishedGames?: Record<string, boolean>;
  isAdmin?: boolean;
}) => {
  const { user } = useAuth();
  const [games, setGames] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  const allGameTemplates = [
    { id: "mystery-box", title: "Mystery Box", icon: "https://drive.google.com/thumbnail?id=1ugM0rhtk40XdbSDrdDJja5QpLNkWebQn&sz=w1000", color: "bg-orange-100 text-orange-600" },
    { id: "neon-chain", title: "Neon Chain", icon: "https://drive.google.com/thumbnail?id=1kovfYZSlp6X8HTqQ9OF_gSpf3wgJgNYG&sz=w1000", color: "bg-cyan-100 text-cyan-600" },
    { id: "bubble-pop", title: "Bubble Pop", icon: "https://drive.google.com/thumbnail?id=1AHwLQ7lCIsKt9fzMlWAJWMnRCfFE4mE-&sz=w1000", color: "bg-blue-100 text-blue-600" },
    { id: "flashcards-match", title: "Flashcards Match", icon: "https://drive.google.com/thumbnail?id=1UtaZtVX0onrqj3VorxedOxy1iVXdFAHk&sz=w1000", color: "bg-indigo-100 text-indigo-600" },
    { id: "bubble-sentence-pro", title: "Bubble Island", icon: "https://drive.google.com/thumbnail?id=136UAXGhVDr4ZhJd3bRABHDKp40RJIQSJ&sz=w1000", color: "bg-sky-100 text-sky-600" },
    { id: "yoga-quiz", title: "Yoga Quiz", icon: "https://drive.google.com/thumbnail?id=16viKskpD4hXygTg-0UaGSjfrWibNoqeQ&sz=w1000", color: "bg-emerald-100 text-emerald-600" },
    { id: "family-feud", title: "Family Feud", icon: "https://drive.google.com/thumbnail?id=1DDWdERo9zS6SEbpXA7J8FSh__1CNqxZN&sz=w1000", color: "bg-yellow-100 text-yellow-600" },
    { id: "sumo", title: "Sumo Tags", icon: "https://drive.google.com/thumbnail?id=19zB6Kpor6pry7TV3XvX3eIZdxpd3ys40&sz=w1000", color: "bg-red-100 text-red-600" },
    { id: "letter-lock", title: "Letter Lock", icon: "https://ui-avatars.com/api/?name=Letter+Lock&background=38bdf8&color=fff&size=512", color: "bg-sky-100 text-sky-600" },
    { id: "hamster-pop-quiz", title: "Hamster Pop Quiz", icon: "https://images.unsplash.com/photo-1425082661705-1834bfd08711?q=80&w=1000&auto=format&fit=crop", color: "bg-yellow-100 text-yellow-600" },
    { id: "student-race", title: "Name Picker", icon: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?q=80&w=1000&auto=format&fit=crop", color: "bg-indigo-100 text-indigo-600" },
  ];

  const gameTemplates = allGameTemplates.filter(g => isAdmin || publishedGames[g.id] !== false);

  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const qGames = query(
        collection(db, "mysteryBoxGames"),
        where("userId", "==", user!.uid),
      );
      const qFolders = query(
        collection(db, "gameFolders"),
        where("userId", "==", user!.uid),
      );
      
      const [gamesSnap, foldersSnap] = await Promise.all([
        getDocs(qGames),
        getDocs(qFolders)
      ]);

      const userGames: any[] = [];
      gamesSnap.forEach((doc) => {
        userGames.push({ id: doc.id, ...doc.data() });
      });

      const userFolders: any[] = [];
      foldersSnap.forEach((doc) => {
        userFolders.push({ id: doc.id, ...doc.data() });
      });

      setGames(userGames);
      setFolders(userFolders);
    } catch (error) {
      console.error("Error fetching library:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const confirmDelete = async (gameId: string) => {
    try {
      await deleteDoc(doc(db, "mysteryBoxGames", gameId));
      setGames(games.filter(g => g.id !== gameId));
      setGameToDelete(null);
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("Failed to delete game");
    }
  };

  const confirmDeleteFolder = async (folderId: string) => {
    try {
      await deleteDoc(doc(db, "gameFolders", folderId));
      
      const batch = writeBatch(db);
      const gamesToUpdate = games.filter(g => g.folderId === folderId);
      gamesToUpdate.forEach(game => {
        const gameRef = doc(db, "mysteryBoxGames", game.id);
        batch.update(gameRef, { folderId: null });
      });
      await batch.commit();

      setFolders(folders.filter(f => f.id !== folderId));
      setGames(games.map(g => g.folderId === folderId ? { ...g, folderId: null } : g));
      setFolderToDelete(null);
      setSelectedFolderId(null);
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder");
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const newFolder = {
        name: newFolderName,
        userId: user!.uid,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "gameFolders"), newFolder);
      setFolders([...folders, { id: docRef.id, ...newFolder }]);
      setShowNewFolderModal(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-purple"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700">
          Please sign in to view your saved games.
        </p>
      </div>
    );
  }

  const baseFilteredGames = selectedFolderId 
    ? games.filter(g => g.folderId === selectedFolderId)
    : games.filter(g => !g.folderId);

  const filteredGames = baseFilteredGames.filter(g => isAdmin || publishedGames[g.gameType || "mystery-box"] !== false);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-6 rounded-[24px] shadow-sm border-2 border-slate-100 dark:border-slate-700 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {selectedFolderId && (
              <button 
                onClick={() => setSelectedFolderId(null)}
                className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            )}
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-slate-200">
                {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name || "Folder" : "My Games Folder"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                {selectedFolderId ? \`\${filteredGames.length} \${filteredGames.length === 1 ? 'game' : 'games'}\` : "Manage your custom vocabulary games"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!selectedFolderId && (
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                <FolderPlus className="w-5 h-5" />
                <span className="hidden sm:inline">New Folder</span>
              </button>
            )}
            {selectedFolderId && (
              <button
                onClick={() => handleDeleteFolder(selectedFolderId)}
                className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">Delete Folder</span>
              </button>
            )}
            <button
              onClick={() => setShowNewGameModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-brand-purple text-white font-bold rounded-xl shadow-[0_4px_0_#4c1d95] active:translate-y-[4px] active:shadow-none hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Game</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!selectedFolderId && folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              className="group bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-100 dark:border-slate-700 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <FolderOpen size={28} />
                </div>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === folder.id ? null : folder.id)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === folder.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50">
                      <button 
                        onClick={() => {
                          setFolderToDelete(folder.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Delete Folder
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 mb-1">{folder.name}</h3>
                <p className="text-slate-500 text-sm font-medium">Folder</p>
              </div>
            </div>
          ))}

          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group bg-white dark:bg-slate-800 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-100 dark:border-slate-700 flex flex-col"
            >
              <div className="p-5 flex flex-col h-full relative z-10 bg-white dark:bg-slate-800">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 line-clamp-2 pr-2">
                    {game.topic || "No Topic"}
                  </h3>
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center font-bold text-4xl group-hover:scale-[1.10] transition-transform shrink-0 z-20 relative overflow-hidden">
                    <GameThumbnail gameType={game.gameType} info={gameTemplates.find(t => t.id === game.gameType) || {}} />
`;

fs.writeFileSync('src/views/GamesLibrary.tsx', topPart + bottomPart);
console.log("Rewritten GamesLibrary.tsx");
