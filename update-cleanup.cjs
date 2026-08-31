const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    'if (questionTimerRef.current) clearInterval(questionTimerRef.current);',
    `if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      if (cameraRef.current && cameraRef.current.stop) {
          cameraRef.current.stop();
      }
      if (handsRef.current && handsRef.current.close) {
          handsRef.current.close();
      }`
);

// We should also do this when clicking "Back to Games" from setup, or exiting the game.
// Look for where screen is set, or just rely on unmount hook. But BubblePop is unmounted when going back.
// The user has a "Back button overlay"
// Let's check the back button.

fs.writeFileSync('src/views/BubblePop.tsx', code);
