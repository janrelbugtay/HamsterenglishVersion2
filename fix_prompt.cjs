const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// Inject the state variable
const stateHook = "const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');\n    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);";
content = content.replace("const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');", stateHook);

// Replace the map block
const oldMap = `{teams.map((team) => (
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
                                  ))}`;

const newMap = `{teams.map((team) => (
                                      <div key={team.id} className="relative">
                                          {editingTeamId === team.id ? (
                                              <input
                                                  autoFocus
                                                  defaultValue={team.name}
                                                  onBlur={(e) => {
                                                      const newName = e.target.value.trim();
                                                      if (newName) {
                                                          setTeams(teams.map(t => t.id === team.id ? { ...t, name: newName } : t));
                                                      }
                                                      setEditingTeamId(null);
                                                  }}
                                                  onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                          e.currentTarget.blur();
                                                      }
                                                  }}
                                                  className="bg-white text-sky-500 font-bold py-3 px-6 rounded-full shadow-inner border-2 border-sky-400 focus:outline-none text-xl w-48"
                                              />
                                          ) : (
                                              <button 
                                                  onClick={() => setEditingTeamId(team.id)}
                                                  className="bg-sky-400 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-md hover:bg-sky-500 transition-colors text-xl cursor-pointer"
                                              >
                                                  {team.name} <Pencil size={20} className="text-yellow-200" />
                                              </button>
                                          )}
                                      </div>
                                  ))}`;

if (content.includes(oldMap)) {
    content = content.replace(oldMap, newMap);
} else {
    console.log("Could not find the map block.");
}

// Fix the initial state
const oldInitState = `const [teams, setTeams] = useState([
        { id: '1', name: 'Team 1', score: 0, colorIdx: 0 },
        { id: '2', name: 'Team 2', score: 0, colorIdx: 1 }
    ]);`;
const newInitState = `const [teams, setTeams] = useState([
        { id: '1', name: 'Player 1', score: 0, colorIdx: 0 }
    ]);`;
if (content.includes(oldInitState)) {
    content = content.replace(oldInitState, newInitState);
} else {
    console.log("Could not find old init state");
}

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Fixes applied successfully.");
