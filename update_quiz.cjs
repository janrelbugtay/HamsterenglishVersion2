const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(/isFavorite\?: boolean;\n}/, 'isFavorite?: boolean;\n  isPublic?: boolean;\n}');
fs.writeFileSync('src/views/BubblePop.tsx', code);
