const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// I also need to make sure the lucide-react icons I use are imported, like User and Pencil.
if (!content.includes('User,')) {
    content = content.replace(
        "Copy, Image as ImageIcon, Settings } from 'lucide-react';",
        "Copy, Image as ImageIcon, Settings, User, Pencil } from 'lucide-react';"
    );
}

const oldBlock = `              {gameState === 'start' && (
                  <div className="p-4 md:p-8 xl:p-12 text-center flex flex-col items-center justify-start flex-grow overflow-y-auto">
                      <div className="text-[4rem] md:text-[6rem] mb-6 p-4 bg-teal-50 border-4 border-teal-100 shadow-inner rounded-[2rem] w-full max-w-2xl flex justify-around items-center shrink-0">
                          <span>🧘‍♀️</span> <span>🙆‍♀️</span> <span>🧎‍♀️</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-teal-800 mb-4 tracking-tight drop-shadow-sm shrink-0">{quiz.title}</h1>
                      <p className="text-lg md:text-2xl text-teal-600/80 mb-8 font-bold max-w-3xl leading-relaxed shrink-0">
                          Test your knowledge! Choose the correct answer by picking one of the yoga poses.
                      </p>
                      
                      <div className="flex gap-4 w-full max-w-2xl shrink-0 mt-auto md:mt-0 pb-4">
                          <button onClick={onBack} className="bg-teal-100 hover:bg-teal-200 text-teal-700 font-black py-6 px-8 rounded-full text-2xl transition transform hover:scale-105 shadow-[0_8px_0_#99f6e4] hover:translate-y-1 active:shadow-none active:translate-y-3 cursor-pointer shrink-0">
                              <ArrowLeft size={32} />
                          </button>
                          <button onClick={startGame} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-black py-6 px-16 rounded-full text-3xl md:text-4xl transition transform hover:scale-105 shadow-[0_12px_0_#0f766e] hover:shadow-[0_6px_0_#0f766e] hover:translate-y-2 active:shadow-none active:translate-y-4 cursor-pointer">
                              START GAME
                          </button>
                      </div>
                  </div>
              )}`;

const newBlock = `              {gameState === 'start' && (
                  <div className="flex flex-col h-full flex-grow relative bg-slate-500 overflow-y-auto items-center justify-center p-4 md:p-8">
                      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl relative flex flex-col items-center p-8 md:p-12">
                          <button onClick={onBack} className="absolute top-6 right-8 text-pink-400 hover:text-pink-500 transition-colors cursor-pointer">
                              <X size={48} strokeWidth={4} />
                          </button>
                          
                          <h1 className="text-5xl md:text-6xl font-black text-slate-700 mt-4 mb-4 tracking-tight">Game Setup Lobby</h1>
                          
                          <div className="flex gap-6 mb-12 text-lg md:text-xl font-bold">
                              <span className="text-blue-300">Best Score: 0</span>
                              <span className="text-amber-400">Stars: 3</span>
                          </div>
                          
                          <div className="w-full max-w-xl flex flex-col gap-6">
                              <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
                                  <div className="flex items-center gap-3 text-blue-600 font-bold text-xl md:text-2xl">
                                      <User className="text-purple-500" size={32} strokeWidth={3} />
                                      <span>Number of players: {teams.length}</span>
                                  </div>
                                  <button onClick={addTeam} className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-md hover:scale-105 transition-transform cursor-pointer">
                                      <Plus size={24} strokeWidth={4} className="text-pink-300" />
                                      <span className="text-lg">Add Player</span>
                                  </button>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 mt-2 mb-4 w-full justify-start min-h-[100px]">
                                  {teams.map((team) => (
                                      <button 
                                          key={team.id}
                                          onClick={() => {
                                              const newName = window.prompt("Enter new player name:", team.name);
                                              if (newName && newName.trim() !== '') {
                                                  setTeams(teams.map(t => t.id === team.id ? { ...t, name: newName.trim() } : t));
                                              }
                                          }}
                                          className="bg-sky-400 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md hover:bg-sky-500 transition-colors text-xl cursor-pointer"
                                      >
                                          {team.name} <Pencil size={20} className="text-yellow-200" />
                                      </button>
                                  ))}
                              </div>
                              
                              <p className="text-cyan-200 italic font-bold text-center mb-8">Tip: Click a player name to edit it!</p>
                          </div>
                          
                          <button onClick={startGame} className="w-full max-w-xl bg-gradient-to-r from-[#4ff0b4] to-[#46e6a5] text-white font-black text-3xl md:text-4xl py-6 rounded-full shadow-[0_8px_0_#23c483] hover:shadow-[0_4px_0_#23c483] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4 cursor-pointer mt-4">
                              🚀 START GAME
                          </button>
                      </div>
                  </div>
              )}`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/views/YogaQuiz.tsx', content);
    console.log("Successfully replaced the Game Setup Lobby.");
} else {
    console.log("Could not find the exact oldBlock in the file.");
}
