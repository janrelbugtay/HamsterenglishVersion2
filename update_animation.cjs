const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

const oldClass = `class FloatingText {
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

const newClass = `class FloatingText {
      x: number; y: number; text: string; color: string; life: number; vy: number; vx: number; size: number;
      targetX?: number; targetY?: number; delay: number;
      
      constructor(x: number, y: number, text: string, color: string, isCombo = false, targetX?: number, targetY?: number) {
          this.x = x; this.y = y; this.text = text; this.color = color;
          this.life = 1.5; // Longer life
          this.size = isCombo ? 100 : 40;
          this.targetX = targetX;
          this.targetY = targetY;
          this.delay = 45; // wait ~0.75s floating up before moving to target
          this.vx = 0;
          this.vy = -1.5; // Float up slowly initially
      }
      update() { 
          if (this.targetX !== undefined && this.targetY !== undefined) {
              if (this.delay > 0) {
                  this.delay--;
                  this.y += this.vy;
              } else {
                  const dx = this.targetX - this.x;
                  const dy = this.targetY - this.y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  if (dist > 15) {
                      this.vx = (dx / dist) * 25;
                      this.vy = (dy / dist) * 25;
                      this.x += this.vx;
                      this.y += this.vy;
                  }
              }
          } else {
              this.y += this.vy;
          }
          this.life -= 0.015; 
      }
      draw(ctx: CanvasRenderingContext2D) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = Math.min(1, this.life); // Cap at 1
          ctx.font = \`900 \${this.size}px 'Fredoka', sans-serif\`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.lineWidth = 6; ctx.strokeStyle = '#000000';
          ctx.strokeText(this.text, this.x, this.y);
          ctx.fillStyle = this.color;
          ctx.fillText(this.text, this.x, this.y);
          ctx.restore();
      }
  }`;

content = content.replace(oldClass, newClass);
fs.writeFileSync('src/views/BubblePop.tsx', content);
