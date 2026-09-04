const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// Update Twist logic
content = content.replace(
    /if \(gameState\.current\.twist\) \{\s*this\.vx \+= Math\.sin\(this\.time\) \* 0\.2 \* \(gameState\.current\.speed \|\| 1\);\s*this\.x \+= this\.vx;\s*\} else \{/g,
    `if (gameState.current.twist) {
              this.vx += Math.sin(this.time * 1.5) * 0.5 * (gameState.current.speed || 1);
              this.x += this.vx + Math.sin(this.time * 3) * 3 * (gameState.current.speed || 1);
          } else {`
);

// Update Speed buttons in Modal
content = content.replace(/handleSetSpeed\(0\.5\)/g, "handleSetSpeed(0.25)");
content = content.replace(/speed === 0\.5/g, "speed === 0.25");
content = content.replace(/handleSetSpeed\(1\.5\)/g, "handleSetSpeed(2.5)");
content = content.replace(/speed === 1\.5/g, "speed === 2.5");

// Update Size buttons in Modal
content = content.replace(/handleSetBubbleSize\(0\.7\)/g, "handleSetBubbleSize(0.5)");
content = content.replace(/bubbleSize === 0\.7/g, "bubbleSize === 0.5");
content = content.replace(/handleSetBubbleSize\(1\.5\)/g, "handleSetBubbleSize(2)");
content = content.replace(/bubbleSize === 1\.5/g, "bubbleSize === 2");

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Fixed values.");
