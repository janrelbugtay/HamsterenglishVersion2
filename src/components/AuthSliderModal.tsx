import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function AuthSliderModal({ isOpen, onClose, onJoinRoom }: { isOpen: boolean; onClose: () => void; onJoinRoom?: (code: string, nickname: string, gameType: string) => void }) {
  const { signInWithGoogle, signInWithFacebook, isAuthenticating } = useAuth();
  
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

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

  const googleIconHtml = `<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`;

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
                  signInWithGoogle(); 
                  onClose(); 
                }} 
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm group"
              >
                <div dangerouslySetInnerHTML={{ __html: googleIconHtml }} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-700 dark:text-slate-200 text-lg">
                  {isAuthenticating ? "Signing In..." : "Sign in with Google"}
                </span>
              </button>

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

              <button 
                onClick={onClose} 
                className="w-full flex items-center justify-center gap-3 p-4 bg-brand-purple hover:bg-purple-600 text-white rounded-2xl transition-all shadow-lg shadow-purple-200 dark:shadow-none hover:-translate-y-1 hover:shadow-xl group"
              >
                <User size={24} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg">
                  Play as Guest
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
