const fs = require('fs');

let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf-8');

const availablePosesArr = `const fallbackEmojis = ['🧘‍♀️', '🙆‍♀️', '🧎‍♀️', '🧍‍♀️', '🚶‍♀️', '🏃‍♀️', '🤸‍♀️', '🤸‍♂️'];
const AVAILABLE_POSES = [
    ...fallbackEmojis.map(e => ({ type: 'emoji', value: e })),
    { type: 'image', value: 'Gemini_Generated_Image_8sdnyn8sdnyn8sdn.png' },
    { type: 'image', value: 'Gemini_Generated_Image_40k1j140k1j140k1.png' },
    { type: 'image', value: 'Gemini_Generated_Image_f2iu2ef2iu2ef2iu.png' },
    { type: 'image', value: 'Gemini_Generated_Image_fdwj35fdwj35fdwj.png' },
    { type: 'image', value: 'Gemini_Generated_Image_hdkz3whdkz3whdkz.png' },
    { type: 'image', value: 'Gemini_Generated_Image_l660sql660sql660.png' }
];`;

content = content.replace(/const fallbackEmojis = \['\🧘‍♀️'.*?\];/s, availablePosesArr);

// Replace state
const stateRegex = /const \[galleryPoses, setGalleryPoses\].*?const \[activePoseSettingsIndex, setActivePoseSettingsIndex\] = useState<number \| null>\(null\);\s*useEffect\(\(\) => \{\s*localStorage\.setItem\('yogaPoseImages_v2', JSON\.stringify\(poseImages\)\);\s*\}, \[poseImages\]\);/s;

const newState = `const [activePoses, setActivePoses] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('yogaActivePoses_v1');
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return AVAILABLE_POSES.map(p => p.value); // Select all by default
    });

    useEffect(() => {
        localStorage.setItem('yogaActivePoses_v1', JSON.stringify(activePoses));
    }, [activePoses]);

    const togglePose = (val: string) => {
        setActivePoses(prev => {
            if (prev.includes(val)) {
                if (prev.length <= 1) return prev; // prevent deselecting all
                return prev.filter(p => p !== val);
            }
            return [...prev, val];
        });
    };`;

content = content.replace(stateRegex, newState);

// Replace Settings UI
const settingsUiRegex = /<label className="block text-teal-700 font-bold mb-4 text-2xl">Custom Poses \(1-6\).*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="flex justify-between items-center bg-teal-50 rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-teal-100">)/s;

const newSettingsUi = `<label className="block text-teal-700 font-bold mb-4 text-2xl">Active Poses</label>
                              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-4">
                                  {AVAILABLE_POSES.map((pose, i) => {
                                      const isSelected = activePoses.includes(pose.value);
                                      return (
                                          <button 
                                              key={i}
                                              onClick={() => togglePose(pose.value)}
                                              className={\`aspect-square rounded-2xl flex items-center justify-center border-4 transition-all relative overflow-hidden \${isSelected ? 'border-teal-500 bg-teal-100 scale-105 shadow-md' : 'border-slate-200 bg-slate-50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}\`}
                                          >
                                              {pose.type === 'emoji' ? (
                                                  <span className="text-4xl drop-shadow-sm">{pose.value}</span>
                                              ) : (
                                                  <img src={pose.value} alt="Pose" className="w-full h-full object-cover rounded-xl" />
                                              )}
                                              {isSelected && (
                                                  <div className="absolute top-1 right-1 bg-teal-500 text-white rounded-full p-0.5">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                  </div>
                                              )}
                                          </button>
                                      );
                                  })}
                              </div>
                          </div>`;

content = content.replace(settingsUiRegex, newSettingsUi + '\n\n                          ');

// Replace Game Loop rendering
// Previously it was poseImages[opt.poseIndex]
const renderRegex = /\{poseImages\[opt\.poseIndex\] \? \(\s*<img src=\{poseImages\[opt\.poseIndex\]\}.*?\/>\s*\) : \(\s*<span className=\{`\$\{optionEmojiClass\} drop-shadow-sm leading-none`\}>\{fallbackEmojis\[opt\.poseIndex\]\}<\/span>\s*\)\}/s;

const newRender = `{(() => {
                                                  const activePoseValue = activePoses[index % activePoses.length] || AVAILABLE_POSES[0].value;
                                                  const poseObj = AVAILABLE_POSES.find(p => p.value === activePoseValue) || { type: 'emoji', value: activePoseValue };
                                                  
                                                  if (poseObj.type === 'image') {
                                                      return <img src={poseObj.value} alt="Pose" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />;
                                                  } else {
                                                      return <span className={\`\${optionEmojiClass} drop-shadow-sm leading-none\`}>{poseObj.value}</span>;
                                                  }
                                              })()}`;

content = content.replace(renderRegex, newRender);

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Patched correctly");
