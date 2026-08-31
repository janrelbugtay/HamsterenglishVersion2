const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /-scale-x-100/,
    'scale-x-[-1]'
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
