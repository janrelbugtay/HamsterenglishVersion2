const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

const oldFloatingText = `class FloatingText {
      x: number; y: number; text: string; color: string; life: number; vy: number; size: number;
      constructor(x: number, y: number, text: string, color: string, isCombo = false) {
          this.x = x; this.y = y; this.text = text; this.color = color;
          this.life = 1.0; this.vy = -2; this.size = isCombo ? 100 : 40;
      }
      update() { this.y += this.vy; this.life -= 0.015; }
      draw(ctx: CanvasRenderingContext2D) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = this.life;
          ctx.font = \`900 \${this.size}px 'Fredoka', sans-serif\`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.lineWidth = 6; ctx.strokeStyle = '#000000';
          ctx.strokeText(this.text, this.x, this.y);
          ctx.fillStyle = this.color;
          ctx.fillText(this.text, this.x, this.y);
          ctx.restore();
      }
  }`;

const newFloatingText = `class FloatingText {
      x: number; y: number; text: string; color: string; life: number; vy: number; vx: number; size: number;
      constructor(x: number, y: number, text: string, color: string, isCombo = false, targetX?: number, targetY?: number) {
          this.x = x; this.y = y; this.text = text; this.color = color;
          this.life = 1.0; this.size = isCombo ? 100 : 40;
          if (targetX !== undefined && targetY !== undefined) {
              const dx = targetX - x;
              const dy = targetY - y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              this.vx = (dx / dist) * 20; // Fast travel to score
              this.vy = (dy / dist) * 20;
          } else {
              this.vx = 0;
              this.vy = -3;
          }
      }
      update() { 
          this.x += this.vx; 
          this.y += this.vy; 
          this.life -= 0.02; 
      }
      draw(ctx: CanvasRenderingContext2D) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = this.life;
          ctx.font = \`900 \${this.size}px 'Fredoka', sans-serif\`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.lineWidth = 6; ctx.strokeStyle = '#000000';
          ctx.strokeText(this.text, this.x, this.y);
          ctx.fillStyle = this.color;
          ctx.fillText(this.text, this.x, this.y);
          ctx.restore();
      }
  }`;

content = content.replace(oldFloatingText, newFloatingText);

const oldCorrectPop = `graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`+5\`, '#4ade80', true));`;
const newCorrectPop = `const w = containerRef.current?.clientWidth || 800;
            const targetX = playerIndex === 0 ? 100 : w - 100;
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`+5\`, '#4ade80', true, targetX, 80));`;

content = content.replace(oldCorrectPop, newCorrectPop);

const oldIncorrectPop = `graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`-5\`, '#ef4444', true));`;
const newIncorrectPop = `const w = containerRef.current?.clientWidth || 800;
            const targetX = playerIndex === 0 ? 100 : w - 100;
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`-5\`, '#ef4444', true, targetX, 80));`;

content = content.replace(oldIncorrectPop, newIncorrectPop);

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Updated floating text logic to be immersive!");
