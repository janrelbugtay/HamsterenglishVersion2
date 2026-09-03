const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

content = content.replace(
    "const [teams, setTeams] = useState<{id: string, name: string, score: number, colorIdx: number}[]>([\n        { id: '1', name: 'Team 1', score: 0, colorIdx: 0 },\n        { id: '2', name: 'Team 2', score: 0, colorIdx: 1 }\n    ]);",
    "const [teams, setTeams] = useState<{id: string, name: string, score: number, colorIdx: number}[]>([\n        { id: '1', name: 'Player 1', score: 0, colorIdx: 0 }\n    ]);"
);

content = content.replace(
    "setTeams([...teams, { id: newId, name: \`Team \${teams.length + 1}\`, score: 0, colorIdx: teams.length % teamColors.length }]);",
    "setTeams([...teams, { id: newId, name: \`Player \${teams.length + 1}\`, score: 0, colorIdx: teams.length % teamColors.length }]);"
);

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Fixed teams.");
