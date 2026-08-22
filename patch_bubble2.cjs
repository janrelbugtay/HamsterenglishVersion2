const fs = require('fs');
let code = fs.readFileSync('src/views/BubbleSentencePro.tsx', 'utf8');

// 1. Add isPublic to GameData
code = code.replace(
    /sentences: Sentence\[\];/,
    "sentences: Sentence[];\n  isPublic?: boolean;"
);

// 2. Add isPublic to saveGame
code = code.replace(
    /customSentences: gameData\.sentences,/,
    "customSentences: gameData.sentences,\n        isPublic: gameData.isPublic ?? false,"
);

// 3. Add state and logic to GameEditor
const editorStateTarget = /const \[errorMsg, setErrorMsg\] = useState\(""\);/;
const editorStateReplacement = `const [errorMsg, setErrorMsg] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);`;
code = code.replace(editorStateTarget, editorStateReplacement);

const handleSaveTarget = /const handleSave = \(\) => \{[\s\S]*?onSave\(\{[\s\S]*?\}\);\n  \};/;
const handleSaveReplacement = `const initiateSave = () => {
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
      isPublic
    });
  };`;
code = code.replace(handleSaveTarget, handleSaveReplacement);

// 4. Change Save Game button in GameEditor to initiateSave
code = code.replace(
    /<button onClick=\{handleSave\} className="flex items-center gap-2 px-6 py-2\.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500\/30 cursor-pointer">/g,
    '<button onClick={initiateSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer">'
);

// 5. Add Modal to GameEditor return
const returnTarget = /<div className="bg-white dark:bg-slate-800 p-8 flex flex-col gap-6 border-b-2 border-cyan-500\/50">/;
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
      <div className="bg-white dark:bg-slate-800 p-8 flex flex-col gap-6 border-b-2 border-cyan-500/50">`;
code = code.replace(returnTarget, returnReplacement);

fs.writeFileSync('src/views/BubbleSentencePro.tsx', code);
console.log("Patch BubbleSentencePro applied.");
