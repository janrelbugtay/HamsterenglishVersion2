const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// The logic should be: if Twist Mode, they bounce and spin wildly side-to-side. 
// "the options should move side to side following the speed slow normal or fast and the option will spin"
const targetUpdate = `if (gameState.current.twist) {
              this.vx += Math.sin(this.time * 1.5) * 0.5 * (gameState.current.speed || 1);
              this.x += this.vx + Math.sin(this.time * 3) * 3 * (gameState.current.speed || 1);
          } else {
              this.x += this.vx + Math.sin(this.time) * 1.5 * (gameState.current.speed || 1);
          }`;

const replaceUpdate = `if (gameState.current.twist) {
              this.vx = Math.sin(this.time * 2) * 5 * (gameState.current.speed || 1);
              this.x += this.vx;
          } else {
              this.x += this.vx + Math.sin(this.time) * 1.5 * (gameState.current.speed || 1);
          }`;


const targetDraw = `const wobble = 1 + Math.sin(this.time * 2) * 0.03;
          let finalScale = this.scale * wobble;
          if(this.state === 'shaking') finalScale += (Math.random() - 0.5) * 0.1;
          ctx.scale(finalScale, 1/finalScale);`;

const replaceDraw = `const wobble = 1 + Math.sin(this.time * 2) * 0.03;
          let finalScale = this.scale * wobble;
          if(this.state === 'shaking') finalScale += (Math.random() - 0.5) * 0.1;
          ctx.scale(finalScale, 1/finalScale);
          if (gameState.current.twist) {
              ctx.rotate(this.time * 2 * (gameState.current.speed || 1));
          }`;

content = content.replace(targetUpdate, replaceUpdate);
content = content.replace(targetDraw, replaceDraw);

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Twist logic updated.");
