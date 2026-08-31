const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// 1. Update Bubble constructor definition and body
code = code.replace(
  `class Bubble {\n      index: number; text: string; isCorrect: boolean; color: string;\n      radius: number; scale: number; targetScale: number;\n      x: number; y: number; baseVy: number; vy: number; vx: number;\n      time: number; popped: boolean; state: string; width: number; height: number;\n      imageElement?: HTMLImageElement;\n\n      constructor(index: number, text: string, isCorrect: boolean, totalOptions: number, w: number, h: number) {`,
  `class Bubble {
      index: number; text: string; isCorrect: boolean; color: string;
      radius: number; scale: number; targetScale: number;
      x: number; y: number; baseVy: number; vy: number; vx: number;
      time: number; popped: boolean; state: string; width: number; height: number;
      imageElement?: HTMLImageElement;
      playerId?: number;

      constructor(index: number, text: string, isCorrect: boolean, totalOptions: number, w: number, h: number, playerId?: number) {
          this.playerId = playerId;`
);

// 2. Update Bubble constructor x assignment
const bubbleXOrig = `          const sectionWidth = w / totalOptions;\n          this.x = (sectionWidth * index) + (sectionWidth / 2) + ((Math.random() - 0.5) * sectionWidth * 0.4);`;
const bubbleXNew = `          let usableW = w;
          let xOffset = 0;
          if (playerId === 0) { usableW = w / 2; xOffset = 0; }
          else if (playerId === 1) { usableW = w / 2; xOffset = w / 2; }
          
          const sectionWidth = usableW / totalOptions;
          this.x = xOffset + (sectionWidth * index) + (sectionWidth / 2) + ((Math.random() - 0.5) * sectionWidth * 0.4);`;
code = code.replace(bubbleXOrig, bubbleXNew);

// 3. Update Bubble update() boundaries
const bubbleUpdateOrig = `          if (this.y > this.height + this.radius) {
              this.y = -this.radius;
              this.x = (this.width * 0.15) + (Math.random() * this.width * 0.7);
          }
          if (this.x < this.radius || this.x > this.width - this.radius) this.vx *= -1;`;
const bubbleUpdateNew = `          if (this.y > this.height + this.radius) {
              this.y = -this.radius;
              let usableW = this.width;
              let xOffset = 0;
              if (this.playerId === 0) { usableW = this.width / 2; xOffset = 0; }
              else if (this.playerId === 1) { usableW = this.width / 2; xOffset = this.width / 2; }
              this.x = xOffset + (usableW * 0.15) + (Math.random() * usableW * 0.7);
          }
          
          let minX = this.radius;
          let maxX = this.width - this.radius;
          if (this.playerId === 0) maxX = (this.width / 2) - this.radius;
          if (this.playerId === 1) minX = (this.width / 2) + this.radius;
          
          if (this.x < minX || this.x > maxX) {
              this.vx *= -1;
              if (this.x < minX) this.x = minX;
              if (this.x > maxX) this.x = maxX;
          }`;
code = code.replace(bubbleUpdateOrig, bubbleUpdateNew);

// 4. Update checkCollision
const collisionOrig = `      checkCollision(px: number, py: number) {
          if (this.popped || this.scale < 0.8) return false;
          const dx = this.x - px;
          const dy = this.y - py;
          return (dx*dx + dy*dy) < (this.radius * this.radius);
      }`;
const collisionNew = `      checkCollision(px: number, py: number, pIndex?: number) {
          if (this.popped || this.scale < 0.8) return false;
          if (this.playerId !== undefined && pIndex !== undefined && this.playerId !== pIndex) return false;
          const dx = this.x - px;
          const dy = this.y - py;
          return (dx*dx + dy*dy) < (this.radius * this.radius);
      }`;
code = code.replace(collisionOrig, collisionNew);

// 5. Call checkCollision with pIndex
const collisionCallOrig = `if (b.checkCollision(pointer.x, pointer.y)) handlePop(b, pIndex);`;
const collisionCallNew = `if (b.checkCollision(pointer.x, pointer.y, pIndex)) handlePop(b, pIndex);`;
code = code.replace(collisionCallOrig, collisionCallNew);

// 6. Spawn bubbles depending on numPlayers
const spawnOrig = `            q.options.forEach((optText, i) => {
                graphicsState.current.bubbles.push(new Bubble(i, optText, i === q.answerIndex, q.options.length, w, h));
            });`;
const spawnNew = `            q.options.forEach((optText, i) => {
                if (gameState.current.numPlayers === 2) {
                    graphicsState.current.bubbles.push(new Bubble(i, optText, i === q.answerIndex, q.options.length, w, h, 0));
                    graphicsState.current.bubbles.push(new Bubble(i, optText, i === q.answerIndex, q.options.length, w, h, 1));
                } else {
                    graphicsState.current.bubbles.push(new Bubble(i, optText, i === q.answerIndex, q.options.length, w, h));
                }
            });`;
code = code.replace(spawnOrig, spawnNew);

fs.writeFileSync('src/views/BubblePop.tsx', code);
console.log('Bubbles pathed successfully.');
