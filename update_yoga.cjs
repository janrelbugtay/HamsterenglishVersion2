const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// 1. Remove the outer FullscreenButton
const outerFullscreenBlock = `      <div className="absolute top-4 right-4 z-[70] flex gap-3 pointer-events-auto">
          <FullscreenButton targetId="game-container" className="bg-white/80 backdrop-blur border-teal-200 text-teal-700 hover:bg-teal-50" />
      </div>`;

if (content.includes(outerFullscreenBlock)) {
    content = content.replace(outerFullscreenBlock, '');
}

// 2. Modify teams container
const teamsBlockOld = `<div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 w-full max-w-6xl">`;
const teamsBlockNew = `<div className="w-full max-w-[95vw] overflow-x-auto custom-scrollbar px-4 pb-4">
                              <div className="flex flex-nowrap justify-start lg:justify-center items-center gap-4 md:gap-6 min-w-full w-max mx-auto">`;

if (content.includes(teamsBlockOld)) {
    content = content.replace(teamsBlockOld, teamsBlockNew);
    
    // We also need to add the closing div for the new wrapper.
    // Let's find where the map ends.
    const mapEndOld = `                              })}
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-center gap-4">
                            <button onClick={addTeam} className="px-4 md:px-6 py-2 md:py-3 text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-black cursor-pointer bg-teal-100 shadow-sm flex items-center gap-2 text-lg uppercase tracking-widest">
                                <Plus size={20} /> Team
                            </button>
                          </div>`;
                          
    const mapEndNew = `                              })}
                              </div>
                          </div>`;
                          
    if (content.includes(mapEndOld)) {
        content = content.replace(mapEndOld, mapEndNew);
    }
}

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Updated YogaQuiz.tsx");
