const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// Remove shadowBlur from Particle draw
const particleDrawOrig = `      draw(ctx: CanvasRenderingContext2D) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = this.life;
          if (this.isSparkle) {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
              ctx.fill();
          } else {
              ctx.fillStyle = this.color;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
              ctx.fill();
          }
          ctx.restore();
      }`;
const particleDrawNew = `      draw(ctx: CanvasRenderingContext2D) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = this.life;
          if (this.isSparkle) {
              ctx.fillStyle = '#ffffff';
              // Removed shadowBlur to fix heavy lag during multi-explosions
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
              ctx.fill();
          } else {
              ctx.fillStyle = this.color;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
              ctx.fill();
          }
          ctx.restore();
      }`;
code = code.replace(particleDrawOrig, particleDrawNew);

// Update createExplosion definition and usage
const explodeOrig = `  const createExplosion = (x: number, y: number, color: string) => {
      graphicsState.current.shockwaves.push(new Shockwave(x, y, color));
      for (let i=0; i<20; i++) graphicsState.current.particles.push(new Particle(x, y, color, false)); 
      for (let i=0; i<15; i++) graphicsState.current.particles.push(new Particle(x, y, color, true));  
  };`;
const explodeNew = `  const createExplosion = (x: number, y: number, color: string, isPrimary = true) => {
      graphicsState.current.shockwaves.push(new Shockwave(x, y, color));
      const pCount = isPrimary ? 12 : 5;
      const sCount = isPrimary ? 8 : 3;
      for (let i=0; i<pCount; i++) graphicsState.current.particles.push(new Particle(x, y, color, false)); 
      for (let i=0; i<sCount; i++) graphicsState.current.particles.push(new Particle(x, y, color, true));  
  };`;
code = code.replace(explodeOrig, explodeNew);

// Update secondary explosions in handlePop
const secPopOrig = `                        createExplosion(b.x, b.y, b.color);
                        playSound('pop');
                    }, Math.random() * 300);`;
const secPopNew = `                        createExplosion(b.x, b.y, b.color, false);
                        playSound('pop');
                    }, Math.random() * 300);`;
code = code.replace(secPopOrig, secPopNew);

fs.writeFileSync('src/views/BubblePop.tsx', code);
console.log('Lag patch applied.');
