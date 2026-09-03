const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// Add Settings to lucide-react import
content = content.replace(
    "Copy, Image as ImageIcon } from 'lucide-react';",
    "Copy, Image as ImageIcon, Settings } from 'lucide-react';"
);

// We need to move Exit and Fullscreen and add Settings.
// Let's first extract the buttons from the Center Controls.

// 1. Remove the old Fullscreen and Exit buttons from Center Controls
const oldCenterControls = `                              <div className="flex flex-wrap items-center justify-center gap-4">
                                <button onClick={toggleFullscreen} className="p-4 md:p-6 text-teal-600 hover:bg-teal-200 rounded-[2rem] transition-colors font-bold cursor-pointer bg-teal-100 shadow-sm" title="Fullscreen">
                                    {isFullscreen ? <Minimize size={36} /> : <Maximize size={36} />}
                                </button>
                                <button onClick={onBack} className="px-6 md:px-10 py-4 md:py-6 text-teal-600 hover:bg-teal-200 rounded-[2rem] transition-colors font-black cursor-pointer bg-teal-100 shadow-sm text-2xl uppercase tracking-widest">
                                  Exit
                                </button>
                                <button onClick={addTeam} className="px-6 md:px-10 py-4 md:py-6 text-teal-600 hover:bg-teal-200 rounded-[2rem] transition-colors font-black cursor-pointer bg-teal-100 shadow-sm flex items-center gap-3 text-2xl uppercase tracking-widest">
                                    <Plus size={36} /> Team
                                </button>
                              </div>`;

const newCenterControls = `                              <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                                <button onClick={addTeam} className="px-4 md:px-6 py-2 md:py-3 text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-black cursor-pointer bg-teal-100 shadow-sm flex items-center gap-2 text-xl uppercase tracking-widest">
                                    <Plus size={24} /> Team
                                </button>
                              </div>`;

content = content.replace(oldCenterControls, newCenterControls);

// 2. Add Top Controls inside the playing container
const headerTarget = `                      {/* Header with progress */}`;
const topControls = `                      {/* Absolute Top Controls */}
                      <button onClick={onBack} className="absolute top-4 md:top-6 left-4 md:left-6 px-4 md:px-6 py-2 md:py-3 text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-black cursor-pointer bg-teal-100 shadow-sm text-lg md:text-xl uppercase tracking-widest z-20 flex items-center gap-2">
                        <ArrowLeft size={24} /> Exit
                      </button>
                      <div className="absolute top-4 md:top-6 right-4 md:right-6 flex gap-3 z-20">
                        <button onClick={() => {}} className="p-3 md:p-4 text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-bold cursor-pointer bg-teal-100 shadow-sm flex items-center justify-center" title="Settings">
                            <Settings size={28} />
                        </button>
                        <button onClick={toggleFullscreen} className="p-3 md:p-4 text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-bold cursor-pointer bg-teal-100 shadow-sm flex items-center justify-center" title="Fullscreen">
                            {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
                        </button>
                      </div>
                      
                      {/* Header with progress */}`;

content = content.replace(headerTarget, topControls);

// 3. Resize Left Teams
content = content.replace(
    'className={`flex items-stretch rounded-[3rem] shadow-xl border-[12px]',
    'className={`flex items-stretch rounded-3xl shadow-xl border-[6px] md:border-[8px]'
);
content = content.replace(
    'className={`px-6 md:px-10 py-4 md:py-6 font-black text-white ${theme.bg} hover:brightness-110 transition-all flex items-center gap-4 md:gap-8 cursor-pointer`}',
    'className={`px-4 md:px-6 py-2 md:py-3 font-black text-white ${theme.bg} hover:brightness-110 transition-all flex items-center gap-3 md:gap-4 cursor-pointer`}'
);
content = content.replace(
    '<span className="text-3xl md:text-5xl">{team.name}</span>',
    '<span className="text-xl md:text-3xl">{team.name}</span>'
);
content = content.replace(
    '<span className="bg-white/20 px-6 md:px-8 py-2 md:py-4 rounded-[2rem] text-6xl md:text-8xl drop-shadow-xl leading-none">{team.score}</span>',
    '<span className="bg-white/20 px-4 md:px-5 py-1 md:py-2 rounded-xl text-4xl md:text-5xl drop-shadow-lg leading-none">{team.score}</span>'
);
content = content.replace(
    'className={`px-4 md:px-6 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-l-[12px] ${theme.borderLight} flex items-center justify-center cursor-pointer`}',
    'className={`px-3 md:px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-l-[6px] md:border-l-[8px] ${theme.borderLight} flex items-center justify-center cursor-pointer`}'
);
content = content.replace(
    '<span className="font-black text-5xl md:text-7xl leading-none opacity-40 hover:opacity-100">-</span>',
    '<span className="font-black text-4xl md:text-5xl leading-none opacity-40 hover:opacity-100">-</span>'
);


// 4. Resize Right Teams
content = content.replace(
    'className={`flex items-stretch rounded-[3rem] shadow-xl border-[12px]',
    'className={`flex items-stretch rounded-3xl shadow-xl border-[6px] md:border-[8px]'
);
content = content.replace(
    'className={`px-4 md:px-6 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-r-[12px] ${theme.borderLight} flex items-center justify-center cursor-pointer`}',
    'className={`px-3 md:px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-r-[6px] md:border-r-[8px] ${theme.borderLight} flex items-center justify-center cursor-pointer`}'
);
content = content.replace(
    '<span className="font-black text-5xl md:text-7xl leading-none opacity-40 hover:opacity-100">-</span>',
    '<span className="font-black text-4xl md:text-5xl leading-none opacity-40 hover:opacity-100">-</span>'
);
content = content.replace(
    'className={`px-6 md:px-10 py-4 md:py-6 font-black text-white ${theme.bg} hover:brightness-110 transition-all flex items-center gap-4 md:gap-8 cursor-pointer`}',
    'className={`px-4 md:px-6 py-2 md:py-3 font-black text-white ${theme.bg} hover:brightness-110 transition-all flex items-center gap-3 md:gap-4 cursor-pointer`}'
);
content = content.replace(
    '<span className="bg-white/20 px-6 md:px-8 py-2 md:py-4 rounded-[2rem] text-6xl md:text-8xl drop-shadow-xl leading-none">{team.score}</span>',
    '<span className="bg-white/20 px-4 md:px-5 py-1 md:py-2 rounded-xl text-4xl md:text-5xl drop-shadow-lg leading-none">{team.score}</span>'
);
content = content.replace(
    '<span className="text-3xl md:text-5xl">{team.name}</span>',
    '<span className="text-xl md:text-3xl">{team.name}</span>'
);

// Let's adjust Question Size (Make them bigger)
content = content.replace(
    'text-3xl md:text-5xl xl:text-6xl font-black text-indigo-900 bg-indigo-50 py-10 px-8 md:px-16',
    'text-4xl md:text-6xl xl:text-7xl font-black text-indigo-900 bg-indigo-50 py-12 md:py-20 px-10 md:px-20'
);

// Let's adjust Option Size (Make them bigger)
content = content.replace(
    'isMany ? \'text-sm sm:text-base md:text-lg xl:text-xl\' : \'text-lg sm:text-xl md:text-2xl xl:text-3xl\'',
    'isMany ? \'text-lg sm:text-xl md:text-2xl xl:text-3xl\' : \'text-2xl sm:text-3xl md:text-4xl xl:text-5xl\''
);
content = content.replace(
    'isMany ? \'text-[3rem] md:text-[5rem] xl:text-[6rem]\' : \'text-[4rem] md:text-[6rem] xl:text-[9rem]\'',
    'isMany ? \'text-[4rem] md:text-[6rem] xl:text-[7rem]\' : \'text-[6rem] md:text-[8rem] xl:text-[11rem]\''
);
content = content.replace(
    'isMany ? \'md:h-28 xl:h-40\' : \'md:h-40 xl:h-56\'',
    'isMany ? \'md:h-36 xl:h-48\' : \'md:h-56 xl:h-72\''
);

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Replaced");
