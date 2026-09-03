const fs = require('fs');

let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// 1. Add imports
if (!content.includes('firebase/firestore')) {
  content = content.replace(
    "import { playSound } from '../lib/audio';",
    `import { playSound } from '../lib/audio';
import { collection, query, where, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Folder } from "lucide-react";`
  );
}

// 2. Update Quiz interface
content = content.replace(
  "isFavorite?: boolean;",
  "isFavorite?: boolean;\n  folderId?: string;\n  isPublic?: boolean;"
);

// 3. Delete QuizLobby completely.
content = content.replace(/function QuizLobby[\s\S]*?\}\n\nfunction QuizEditor/, 'function QuizEditor');

// 4. Update YogaQuiz
const oldYogaQuizRegex = /export function YogaQuiz\(\{ onViewChange \}: \{ onViewChange: \(view: ViewState\) => void \}\) \{[\s\S]*?\/\/ --- Components ---/m;

const newYogaQuiz = `export function YogaQuiz({ onViewChange, initialGame }: { onViewChange: (view: ViewState) => void, initialGame?: any }) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<'editor' | 'game'>(initialGame && !initialGame.editMode ? 'game' : 'editor');
  
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);

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

  const handleSaveQuiz = async (quiz: Quiz) => {
    if (!user) return;
    
    try {
      const gameToSave = {
        name: quiz.title || "Yoga Quiz",
        folderId: quiz.folderId || "",
        topic: quiz.topic || "",
        className: quiz.classLevel || "",
        gameType: "yoga-quiz",
        customQuestions: quiz.questions,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
        isPublic: quiz.isPublic ?? false,
      };

      if (initialGame?.id) {
        await updateDoc(doc(db, "mysteryBoxGames", initialGame.id), gameToSave);
      } else {
        await addDoc(collection(db, "mysteryBoxGames"), {
          ...gameToSave,
          createdAt: new Date().toISOString(),
        });
      }
      onViewChange("games");
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const getQuizData = (): Quiz => {
    if (initialGame) {
      return {
        id: initialGame.id,
        title: initialGame.name || "Yoga Quiz",
        subject: "Grammar",
        topic: initialGame.topic || "",
        classLevel: initialGame.className || "",
        questions: initialGame.customQuestions || initialQuizzes[0].questions,
        thumbnail: "🧘",
        folderId: initialGame.folderId,
        isPublic: initialGame.isPublic,
      };
    }
    return initialQuizzes[0];
  };

  if (screen === 'editor') {
    return <QuizEditor quiz={getQuizData()} onSave={handleSaveQuiz} onCancel={() => onViewChange("games")} folders={folders} />;
  }

  return (
    <div id="game-container" className="h-[calc(100vh-2rem)] w-full -m-4 md:-m-8 bg-[#ccfbf1] text-slate-900 flex flex-col font-sans overflow-hidden relative selection:bg-teal-500/30 rounded-xl" 
         style={{ margin: '-1rem', height: 'calc(100% + 2rem)', backgroundImage: 'radial-gradient(#99f6e4 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
      
      <style>{\`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
            animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(20, 184, 166, 0.4); }
      \`}</style>

      <div className="absolute top-4 right-4 z-[70] flex gap-3 pointer-events-auto">
          <FullscreenButton targetId="game-container" className="bg-white/80 backdrop-blur border-teal-200 text-teal-700 hover:bg-teal-50" />
      </div>

      <YogaGame quiz={getQuizData()} onBack={() => onViewChange("games")} />
    </div>
  );
}

// --- Components ---`;
content = content.replace(oldYogaQuizRegex, newYogaQuiz);

// 5. Update QuizEditor definition
content = content.replace(
  "function QuizEditor({ quiz, onSave, onCancel }: { quiz: Quiz, onSave: (q: Quiz) => void, onCancel: () => void }) {",
  "function QuizEditor({ quiz, onSave, onCancel, folders = [] }: { quiz: Quiz, onSave: (q: Quiz) => void, onCancel: () => void, folders?: {id: string, name: string}[] }) {"
);

// 6. Add states to QuizEditor
content = content.replace(
  "const [topic, setTopic] = useState(quiz.topic || \"\");",
  `const [topic, setTopic] = useState(quiz.topic || "");
  const [folderId, setFolderId] = useState(quiz.folderId || "");
  const [showPublishModal, setShowPublishModal] = useState(false);`
);

// 7. Update handleSave in QuizEditor
content = content.replace(
  /const handleSave = \(\) => \{[\s\S]*?onSave\(\{[\s\S]*?\}\);\n  \};/,
  `const handleSave = () => {
    if(!title.trim()) {
      setErrorMsg("Please enter a title");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    const validQuestions = questions.filter(q => q.text.trim());
    if(validQuestions.length === 0) {
      setErrorMsg("Please add at least one complete question.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setShowPublishModal(true);
  };

  const confirmSave = (isPublic: boolean) => {
    const validQuestions = questions.filter(q => q.text.trim());
    onSave({
      ...quiz,
      title,
      subject,
      topic,
      classLevel,
      folderId,
      isPublic,
      questions: validQuestions
    });
    setShowPublishModal(false);
  };`
);

// 8. Add modal to QuizEditor JSX
content = content.replace(
  /return \(\n\s*<div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-2xl relative animate-pop-in">/,
  `return (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-2xl relative animate-pop-in">
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-pop">
            <div className="bg-teal-50 p-6 flex justify-between items-center border-b border-teal-100">
              <h3 className="text-2xl font-black text-teal-800">Save Quiz</h3>
              <button onClick={() => setShowPublishModal(false)} className="p-2 bg-white rounded-full text-teal-400 hover:text-teal-600 shadow-sm transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-teal-700">Save to Folder</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400">
                    <Folder size={20} />
                  </div>
                  <select 
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="w-full bg-teal-50/50 border-2 border-teal-100 text-teal-900 rounded-xl px-12 py-3 outline-none focus:border-teal-400 focus:bg-white transition-colors appearance-none font-medium cursor-pointer"
                  >
                    <option value="">No Folder (My Games)</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => confirmSave(false)} 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-colors cursor-pointer"
                >
                  Save as Private
                </button>
                <button 
                  onClick={() => confirmSave(true)} 
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 transition-colors cursor-pointer"
                >
                  Publish to Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}`
);

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log('Update complete.');
