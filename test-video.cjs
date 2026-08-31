const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"/,
    'className="absolute inset-0 w-full h-full object-cover z-0"' // Make it visible underneath canvas
);
code = code.replace(
    /className="absolute inset-0 bg-\[radial-gradient[^"]+"/,
    'className="hidden"' // Hide the gradient
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
