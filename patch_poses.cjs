const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// 1. Add states for pose images and active settings picker
const stateHook = `const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');`;
const newStates = `const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [poseImages, setPoseImages] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('yogaPoseImages');
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return Array(6).fill('');
    });
    const [activePoseSettingsIndex, setActivePoseSettingsIndex] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem('yogaPoseImages', JSON.stringify(poseImages));
    }, [poseImages]);`;
content = content.replace(stateHook, newStates);

// 2. Add the custom poses section to settings
const settingsMarker = `                          <div>
                              <label className="block text-teal-700 font-bold mb-4 text-2xl">Auto-advance Delay</label>`;
const customPosesUI = `                          <div>
                              <label className="block text-teal-700 font-bold mb-4 text-2xl">Custom Poses (1-6)</label>
                              <div className="grid grid-cols-3 gap-4">
                                  {poseImages.map((img, i) => (
                                      <div key={i} className="aspect-square bg-teal-50 border-4 border-teal-100 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                          {img ? (
                                              <img src={img} alt={\`Pose \${i+1}\`} className="w-full h-full object-cover" />
                                          ) : (
                                              <span className="text-4xl opacity-50">{fallbackEmojis[i]}</span>
                                          )}
                                          <button 
                                              onClick={() => setActivePoseSettingsIndex(i)}
                                              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                          >
                                              <ImageIcon className="text-white mb-2" size={32} />
                                              <span className="text-white font-bold text-sm">Change</span>
                                          </button>
                                          {img && (
                                              <button
                                                  onClick={(e) => { 
                                                      e.stopPropagation(); 
                                                      const newPoses = [...poseImages]; 
                                                      newPoses[i] = ''; 
                                                      setPoseImages(newPoses); 
                                                  }}
                                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                              >
                                                  <X size={16} />
                                              </button>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>

                          <div>
                              <label className="block text-teal-700 font-bold mb-4 text-2xl">Auto-advance Delay</label>`;
content = content.replace(settingsMarker, customPosesUI);

// 3. Make options use modulo 6 for poses instead of fallbackEmojis.length
const oldMap = `.map((opt, i) => ({ text: opt, isCorrect: currentItem.answerIndex === i, poseIndex: i % fallbackEmojis.length }))`;
const newMap = `.map((opt, i) => ({ text: opt, isCorrect: currentItem.answerIndex === i, poseIndex: i % 6 }))`;
content = content.replace(oldMap, newMap);

// 4. Update the rendering of options to show the image if it exists
const oldRender = `<span className={\`\${optionEmojiClass} leading-none mb-2 md:mb-6 select-none group-hover:scale-110 transition-transform duration-300\`}>{fallbackEmojis[opt.poseIndex]}</span>`;
const newRender = `{poseImages[opt.poseIndex] ? (
                                              <img src={poseImages[opt.poseIndex]} alt="Pose" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                          ) : (
                                              <span className={\`\${optionEmojiClass} leading-none mb-2 md:mb-6 select-none group-hover:scale-110 transition-transform duration-300\`}>{fallbackEmojis[opt.poseIndex]}</span>
                                          )}`;
content = content.replace(oldRender, newRender);

// 5. Render MediaPickerModal for activePoseSettingsIndex
// The existing MediaPickerModal for Giphy input is around line 624 (outside YogaGame but inside YogaQuiz)
// Actually wait! The MediaPickerModal for activeGiphyInput is part of the Editor, not the Game!
// Settings is inside YogaGame. We should add a MediaPickerModal inside YogaGame for activePoseSettingsIndex.

// Let's add it right before the final closing div of YogaGame
const gameEndDiv = `          <div className={\`bg-white shadow-2xl w-full overflow-hidden border-8 border-teal-500 relative flex flex-col \${isFullscreen ? 'h-full rounded-none border-0' : 'min-h-[75vh] rounded-[3rem]'}\`}>`;

const modalAdd = `          <MediaPickerModal 
              isOpen={activePoseSettingsIndex !== null}
              onClose={() => setActivePoseSettingsIndex(null)}
              onSelect={(url) => {
                  if (activePoseSettingsIndex !== null) {
                      const newPoses = [...poseImages];
                      newPoses[activePoseSettingsIndex] = url;
                      setPoseImages(newPoses);
                      setActivePoseSettingsIndex(null);
                  }
              }}
          />

          <div className={\`bg-white shadow-2xl w-full overflow-hidden border-8 border-teal-500 relative flex flex-col \${isFullscreen ? 'h-full rounded-none border-0' : 'min-h-[75vh] rounded-[3rem]'}\`}>`;
content = content.replace(gameEndDiv, modalAdd);

// The settings overlay needs to be fixed: make sure it's scrollable if it gets too tall
content = content.replace(
    `<div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl relative border-8 border-teal-100">`,
    `<div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl relative border-8 border-teal-100 max-h-[90vh] overflow-y-auto">`
);

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Patched YogaQuiz.tsx with pose customizer");
