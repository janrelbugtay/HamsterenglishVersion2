const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /<div className="hidden"><\/div>/,
    '<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#dbeafe,#f8fafc)] dark:bg-[radial-gradient(circle_at_50%_100%,#1e3a8a,#0f172a)] -z-10 pointer-events-none"></div>'
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
