const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// Change the video to be visibly under the canvas and flipped
code = code.replace(
    /className="absolute inset-0 w-full h-full object-cover z-0"/,
    'className="absolute inset-0 w-full h-full object-cover z-0 -scale-x-100"'
);

// Remove the drawing logic for the video to the canvas (saves CPU!)
code = code.replace(
    /if \(videoRef\.current && videoRef\.current\.readyState >= 2[\s\S]*?ctx\.restore\(\);\n    \}/,
    '// Video rendering handled by DOM element underneath the canvas now.'
);

// Remove the debug info
code = code.replace(
    /\/\/ Debug info[\s\S]*?ctx\.fillText\("No videoRef", 20, 50\);\n    \}/,
    ''
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
