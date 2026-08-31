const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /<video ref=\{videoRef\} className="absolute w-0 h-0 opacity-0 pointer-events-none" autoPlay playsInline><\/video>/,
    '<video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none" autoPlay playsInline muted></video>'
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
