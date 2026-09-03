const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

const oldBlock = `                      {/* Absolute Top Controls */}
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
                      
                      {/* Header with progress */}
                      <div className="bg-teal-50 p-4 md:p-8 border-b-8 border-teal-100 flex flex-row justify-between items-start shrink-0 gap-4">
                          {/* Left Teams */}
                          <div className="flex flex-col items-start gap-4 flex-1">
                              {teams.slice(0, Math.ceil(teams.length / 2)).map(team => {
                                  const theme = teamColors[team.colorIdx];
                                  return (
                                      <div key={team.id} className={\`flex items-stretch rounded-3xl shadow-xl border-[6px] md:border-[8px] \${theme.border} overflow-hidden shrink-0 transform transition-transform hover:scale-105\`}>
                                          <button onClick={() => updateTeamScore(team.id, 1)} className={\`px-4 md:px-6 py-2 md:py-3 font-black text-white \${theme.bg} hover:brightness-110 transition-all flex items-center gap-3 md:gap-4 cursor-pointer\`}>
                                              <span className="text-xl md:text-3xl">{team.name}</span>
                                              <span className="bg-white/20 px-4 md:px-5 py-1 md:py-2 rounded-xl text-4xl md:text-5xl drop-shadow-lg leading-none">{team.score}</span>
                                          </button>
                                          <button onClick={() => updateTeamScore(team.id, -1)} className={\`px-3 md:px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-l-[6px] md:border-l-[8px] \${theme.borderLight} flex items-center justify-center cursor-pointer\`}>
                                              <span className="font-black text-4xl md:text-5xl leading-none opacity-40 hover:opacity-100">-</span>
                                          </button>
                                      </div>
                                  );
                              })}
                          </div>
                          
                          {/* Center Controls */}
                          <div className="flex flex-col items-center gap-6 shrink-0 z-10">
                              <div className="font-bold text-teal-800 bg-teal-200/50 px-8 md:px-12 py-4 md:py-6 rounded-[3rem] shadow-sm border-8 border-teal-200 text-center flex items-center justify-center gap-4">
                                  <span className="text-2xl md:text-4xl">Q <span className="text-5xl md:text-7xl font-black">{currentIdx + 1}</span> / {quiz.questions.length}</span>
                              </div>
                              <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                                <button onClick={addTeam} className="px-4 md:px-6 py-2 md:py-3 text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-black cursor-pointer bg-teal-100 shadow-sm flex items-center gap-2 text-xl uppercase tracking-widest">
                                    <Plus size={24} /> Team
                                </button>
                              </div>
                          </div>
                          
                          {/* Right Teams */}
                          <div className="flex flex-col items-end gap-4 flex-1">
                              {teams.slice(Math.ceil(teams.length / 2)).map(team => {
                                  const theme = teamColors[team.colorIdx];
                                  return (
                                      <div key={team.id} className={\`flex items-stretch rounded-3xl shadow-xl border-[6px] md:border-[8px] \${theme.border} overflow-hidden shrink-0 transform transition-transform hover:scale-105\`}>
                                          <button onClick={() => updateTeamScore(team.id, -1)} className={\`px-3 md:px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-r-[6px] md:border-r-[8px] \${theme.borderLight} flex items-center justify-center cursor-pointer\`}>
                                              <span className="font-black text-4xl md:text-5xl leading-none opacity-40 hover:opacity-100">-</span>
                                          </button>
                                          <button onClick={() => updateTeamScore(team.id, 1)} className={\`px-4 md:px-6 py-2 md:py-3 font-black text-white \${theme.bg} hover:brightness-110 transition-all flex items-center gap-3 md:gap-4 cursor-pointer\`}>
                                              <span className="bg-white/20 px-4 md:px-5 py-1 md:py-2 rounded-xl text-4xl md:text-5xl drop-shadow-lg leading-none">{team.score}</span>
                                              <span className="text-xl md:text-3xl">{team.name}</span>
                                          </button>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>`;

const newBlock = `                      {/* Absolute Top Controls */}
                      <div className="absolute top-4 md:top-6 left-0 right-0 px-4 md:px-6 flex justify-between items-start z-20 pointer-events-none">
                          <button onClick={onBack} className="pointer-events-auto px-4 md:px-6 py-2 md:py-3 text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-black cursor-pointer bg-teal-100 shadow-sm text-lg md:text-xl uppercase tracking-widest flex items-center gap-2">
                            <ArrowLeft size={24} /> Exit
                          </button>
                          
                          <div className="flex items-center gap-3 pointer-events-auto">
                            <div className="font-bold text-teal-800 bg-teal-200/50 px-4 md:px-6 py-2 rounded-2xl shadow-sm border-[4px] border-teal-200 text-center flex items-center justify-center gap-2 h-[52px] md:h-[60px]">
                                <span className="text-3xl md:text-4xl font-black">{currentIdx + 1}</span> 
                                <span className="text-xl md:text-2xl opacity-70">/ {quiz.questions.length}</span>
                            </div>
                            <button onClick={() => {}} className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-bold cursor-pointer bg-teal-100 shadow-sm flex items-center justify-center" title="Settings">
                                <Settings size={28} />
                            </button>
                            <button onClick={toggleFullscreen} className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-bold cursor-pointer bg-teal-100 shadow-sm flex items-center justify-center" title="Fullscreen">
                                {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
                            </button>
                          </div>
                      </div>
                      
                      {/* Header with progress */}
                      <div className="bg-teal-50 pt-24 md:pt-28 pb-4 md:pb-8 px-4 border-b-8 border-teal-100 flex flex-col items-center shrink-0 gap-6">
                          {/* Center Teams */}
                          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 w-full max-w-6xl">
                              {teams.map((team, index) => {
                                  const theme = teamColors[team.colorIdx];
                                  // Alternate layout for variety, or just keep consistent. Let's make minus on left, plus on right for all in the middle
                                  return (
                                      <div key={team.id} className={\`flex items-stretch rounded-3xl shadow-xl border-[6px] md:border-[8px] \${theme.border} overflow-hidden shrink-0 transform transition-transform hover:scale-105\`}>
                                          <button onClick={() => updateTeamScore(team.id, -1)} className={\`px-3 md:px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors border-r-[6px] md:border-r-[8px] \${theme.borderLight} flex items-center justify-center cursor-pointer\`}>
                                              <span className="font-black text-3xl md:text-4xl leading-none opacity-40 hover:opacity-100">-</span>
                                          </button>
                                          <button onClick={() => updateTeamScore(team.id, 1)} className={\`px-4 md:px-6 py-2 md:py-3 font-black text-white \${theme.bg} hover:brightness-110 transition-all flex items-center gap-3 md:gap-4 cursor-pointer\`}>
                                              <span className="text-xl md:text-2xl">{team.name}</span>
                                              <span className="bg-white/20 px-4 md:px-5 py-1 md:py-2 rounded-xl text-3xl md:text-4xl drop-shadow-lg leading-none">{team.score}</span>
                                          </button>
                                      </div>
                                  );
                              })}
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-center gap-4">
                            <button onClick={addTeam} className="px-4 md:px-6 py-2 md:py-3 text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-black cursor-pointer bg-teal-100 shadow-sm flex items-center gap-2 text-lg uppercase tracking-widest">
                                <Plus size={20} /> Team
                            </button>
                          </div>
                      </div>`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/views/YogaQuiz.tsx', content);
    console.log("Successfully replaced the header block.");
} else {
    console.log("Could not find the exact oldBlock in the file.");
}
