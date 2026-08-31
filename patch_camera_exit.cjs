const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
  'if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();',
  'if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();\n            setIsCameraActive(false);'
);

// Do it again globally in case it missed some
code = code.replace(
  /if \(cameraRef.current && cameraRef.current.stop\) cameraRef.current.stop\(\);/g,
  'if (cameraRef.current && cameraRef.current.stop) { cameraRef.current.stop(); setIsCameraActive(false); }'
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
