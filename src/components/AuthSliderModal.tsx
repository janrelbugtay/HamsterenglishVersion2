import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, auth } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export function AuthSliderModal({ isOpen, onClose, onJoinRoom, initialRoomCode }: { isOpen: boolean; onClose: () => void; onJoinRoom?: (code: string, nickname: string, gameType: string) => void; initialRoomCode?: string }) {
  const { signInWithFacebook, isAuthenticating } = useAuth();
  
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [nickname, setNickname] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (initialRoomCode) {
      setRoomCode(initialRoomCode);
    }
  }, [initialRoomCode]);


  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !nickname.trim()) {
      setError('Please enter both code and name');
      return;
    }
    
    setIsJoining(true);
    setError('');
    const code = roomCode.trim().toUpperCase();

    try {
      // For now we check Tic Tac Toe rooms
      const tttRef = doc(db, 'ttt_rooms', code);
      const snap = await getDoc(tttRef);
      if (snap.exists() && onJoinRoom) {
        onJoinRoom(code, nickname.trim(), 'tic-tac-toe');
        onClose();
      } else {
        setError('Room not found. Please check your code.');
      }
    } catch (err) {
      setError('Error connecting to room.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleGuestPlay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please enter a display name to play as guest');
      return;
    }
    if (auth.currentUser) {
      setIsGuestLoading(true);
      try {
        await updateProfile(auth.currentUser, { displayName: guestName.trim() });
        onClose();
      } catch (err) {
        setError('Error setting guest name');
      } finally {
        setIsGuestLoading(false);
      }
    } else {
      onClose();
    }
  };

  const facebookIconHtml = `<svg class="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#1877F2"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-10 text-center border border-slate-100 dark:border-slate-700"
          >
            {/* Close button */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 z-50 p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-full transition-colors"
            >
               <X size={20} />
            </button>

            {/* Logo */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-brand-purple/20 rounded-3xl animate-ping opacity-50" />
              <img 
                src="https://drive.google.com/thumbnail?id=1IrQAzr2JXZjfhDxPhP-MZkFlbF8GfW9n&sz=w1000" 
                alt="Hamster English Logo" 
                className="relative w-full h-full rounded-3xl object-cover shadow-lg border-4 border-white dark:border-slate-800 z-10" 
                referrerPolicy="no-referrer" 
              />
            </div>

            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
              Hamster English
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
              Choose how you want to play!
            </p>

            <div className="flex flex-col gap-4">

              <button 
                onClick={() => { 
                  signInWithFacebook(); 
                  onClose(); 
                }} 
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm group"
              >
                <div dangerouslySetInnerHTML={{ __html: facebookIconHtml }} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-700 dark:text-slate-200 text-lg">
                  {isAuthenticating ? "Signing In..." : "Sign in with Facebook"}
                </span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t-2 border-slate-100 dark:border-slate-700 w-full"></div>
                <span className="absolute bg-white dark:bg-slate-800 px-4 text-xs text-slate-400 font-bold uppercase tracking-widest">or Join Game</span>
              </div>

              <form onSubmit={handleJoin} className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
                <input 
                  type="text" 
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Room Code"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-center text-slate-800 dark:text-white uppercase tracking-widest focus:ring-2 focus:ring-brand-purple focus:outline-none"
                  maxLength={6}
                />
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-center text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
                  maxLength={15}
                />
                {error && <p className="text-red-500 font-medium text-sm">{error}</p>}
                <button 
                  type="submit"
                  disabled={isJoining}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-70"
                >
                  {isJoining ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                  <span>Join Room</span>
                </button>
              </form>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t-2 border-slate-100 dark:border-slate-700 w-full"></div>
                <span className="absolute bg-white dark:bg-slate-800 px-4 text-xs text-slate-400 font-bold uppercase tracking-widest">or</span>
              </div>

              <form onSubmit={handleGuestPlay} className="flex flex-col gap-3">
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your Display Name"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-center text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
                  maxLength={15}
                />
                <button 
                  type="submit"
                  disabled={isGuestLoading}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-brand-purple hover:bg-purple-600 text-white rounded-2xl transition-all shadow-lg shadow-purple-200 dark:shadow-none hover:-translate-y-1 hover:shadow-xl group"
                >
                  {isGuestLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <User size={24} className="group-hover:scale-110 transition-transform" />
                  )}
                  <span className="font-bold text-lg">
                    {isGuestLoading ? "Joining..." : "Play as Guest"}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
