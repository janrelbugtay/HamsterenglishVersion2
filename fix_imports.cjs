const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

code = code.replace("from '../firebase'", "from '../lib/firebase'");
code = code.replace("from '../context/AuthContext'", "from '../contexts/AuthContext'");

fs.writeFileSync('src/views/GamesLibrary.tsx', code);
console.log("Fixed imports in GamesLibrary.tsx");
