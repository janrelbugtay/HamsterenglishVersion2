const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// 1. Update pointers structure
code = code.replace(
  `{ x: -100, y: -100, active: false, history: [] as any[], color: pointerColors[0] }`,
  `{ x: -100, y: -100, targetX: -100, targetY: -100, detected: false, history: [] as any[], color: pointerColors[0] }`
);
code = code.replace(
  `{ x: -100, y: -100, active: false, history: [] as any[], color: pointerColors[1] }`,
  `{ x: -100, y: -100, targetX: -100, targetY: -100, detected: false, history: [] as any[], color: pointerColors[1] }`
);

// 2. Add ambient particles to graphics state
code = code.replace(
  `floatingTexts: [] as any[],`,
  `floatingTexts: [] as any[],
    ambientParticles: [] as any[],`
);

// 3. Update onResults
const onResultsOrig = `  const onResults = (results: any) => {
    if (!gameState.current.isActive) return;
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        let detected = [];
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const tip = results.multiHandLandmarks[i][8];
            detected.push({ x: (1.0 - tip.x) * width, y: tip.y * height });
        }
        detected.sort((a, b) => a.x - b.x);

        if (gameState.current.numPlayers === 1 && detected.length > 0) {
            pointers.current[0].x = detected[0].x; pointers.current[0].y = detected[0].y;
            pointers.current[0].active = true;
        } else if (gameState.current.numPlayers === 2) {
            if (detected.length === 1) {
                const isLeft = detected[0].x < width / 2;
                pointers.current[isLeft ? 0 : 1].x = detected[0].x;
                pointers.current[isLeft ? 0 : 1].y = detected[0].y;
                pointers.current[isLeft ? 0 : 1].active = true;
            } else if (detected.length >= 2) {
                pointers.current[0].x = detected[0].x; pointers.current[0].y = detected[0].y; pointers.current[0].active = true;
                pointers.current[1].x = detected[1].x; pointers.current[1].y = detected[1].y; pointers.current[1].active = true;
            }
        }
    }
  };`;
const onResultsNew = `  const onResults = (results: any) => {
    if (!gameState.current.isActive) return;
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;

    pointers.current.forEach(p => p.detected = false);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        let detected = [];
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const tip = results.multiHandLandmarks[i][8];
            detected.push({ x: (1.0 - tip.x) * width, y: tip.y * height });
        }
        detected.sort((a, b) => a.x - b.x);

        if (gameState.current.numPlayers === 1 && detected.length > 0) {
            pointers.current[0].targetX = detected[0].x; 
            pointers.current[0].targetY = detected[0].y;
            pointers.current[0].detected = true;
        } else if (gameState.current.numPlayers === 2) {
            if (detected.length === 1) {
                const isLeft = detected[0].x < width / 2;
                const idx = isLeft ? 0 : 1;
                pointers.current[idx].targetX = detected[0].x;
                pointers.current[idx].targetY = detected[0].y;
                pointers.current[idx].detected = true;
            } else if (detected.length >= 2) {
                pointers.current[0].targetX = detected[0].x; 
                pointers.current[0].targetY = detected[0].y; 
                pointers.current[0].detected = true;
                
                pointers.current[1].targetX = detected[1].x; 
                pointers.current[1].targetY = detected[1].y; 
                pointers.current[1].detected = true;
            }
        }
    }
  };`;
code = code.replace(onResultsOrig, onResultsNew);

// 4. Update tracking options to 0.75 for better tracking filtering
const handsOptionsOrig = `hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });`;
const handsOptionsNew = `hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.75, minTrackingConfidence: 0.75 });`;
code = code.replace(handsOptionsOrig, handsOptionsNew);

// 5. Update runGameEngine to use targetX/targetY and add ambient particle spawner
const runGameEngineStart = `    graphicsState.current.floatingTexts = graphicsState.current.floatingTexts.filter(ft => ft.life > 0);
    graphicsState.current.floatingTexts.forEach(ft => { ft.update(); ft.draw(ctx); });

    pointers.current.forEach((pointer, pIndex) => {
        if (pointer.active) {
            pointer.history.push({x: pointer.x, y: pointer.y});
            if (pointer.history.length > 15) pointer.history.shift();

            if (graphicsState.current.isQuestionActive) {
                graphicsState.current.bubbles.forEach(b => {
                    if (b.checkCollision(pointer.x, pointer.y, pIndex)) handlePop(b, pIndex);
                });
            }
            pointer.active = false; 
        } else if (pointer.history.length > 0) {
            pointer.history.shift(); 
        }`;
        
const runGameEngineStartNew = `    graphicsState.current.floatingTexts = graphicsState.current.floatingTexts.filter(ft => ft.life > 0);
    graphicsState.current.floatingTexts.forEach(ft => { ft.update(); ft.draw(ctx); });

    // Ambient background particles
    if (Math.random() < 0.2) {
        graphicsState.current.ambientParticles.push({
            x: Math.random() * width,
            y: height + 20,
            vy: -1 - Math.random() * 2,
            size: Math.random() * 4 + 1,
            alpha: Math.random() * 0.5 + 0.1
        });
    }
    
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    graphicsState.current.ambientParticles = graphicsState.current.ambientParticles.filter(p => p.y > -20);
    graphicsState.current.ambientParticles.forEach(p => {
        p.y += p.vy;
        p.x += Math.sin(p.y * 0.01) * 0.5;
        ctx.fillStyle = \`rgba(255, 255, 255, \${p.alpha})\`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();

    pointers.current.forEach((pointer, pIndex) => {
        if (pointer.detected) {
            if (pointer.x === -100) { pointer.x = pointer.targetX; pointer.y = pointer.targetY; }
            pointer.x += (pointer.targetX - pointer.x) * 0.5;
            pointer.y += (pointer.targetY - pointer.y) * 0.5;
            
            pointer.history.push({x: pointer.x, y: pointer.y});
            if (pointer.history.length > 20) pointer.history.shift();

            if (graphicsState.current.isQuestionActive) {
                graphicsState.current.bubbles.forEach(b => {
                    // Make it slightly easier to pop by allowing collision across history points
                    const isHitting = b.checkCollision(pointer.x, pointer.y, pIndex) ||
                                      (pointer.history.length > 5 && b.checkCollision(pointer.history[pointer.history.length - 5].x, pointer.history[pointer.history.length - 5].y, pIndex));
                    if (isHitting) handlePop(b, pIndex);
                });
            }
        } else if (pointer.history.length > 0) {
            pointer.history.shift(); 
            if (pointer.history.length === 0) {
                pointer.x = -100; pointer.y = -100;
            }
        }`;
code = code.replace(runGameEngineStart, runGameEngineStartNew);

// 6. Enhance pointer visuals
const pointerDrawOrig = `            const tip = pointer.history[pointer.history.length - 1];
            ctx.save();
            ctx.translate(tip.x, tip.y);
            ctx.rotate(Date.now() * 0.005);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = pointer.color.main;
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.moveTo(0, -20); ctx.quadraticCurveTo(5, -5, 20, 0);
            ctx.quadraticCurveTo(5, 5, 0, 20); ctx.quadraticCurveTo(-5, 5, -20, 0);
            ctx.quadraticCurveTo(-5, -5, 0, -20);
            ctx.fill();
            ctx.restore();`;
            
const pointerDrawNew = `            const tip = pointer.history[pointer.history.length - 1];
            ctx.save();
            ctx.translate(tip.x, tip.y);
            
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.2;
            
            ctx.rotate(Date.now() * 0.003);
            ctx.scale(pulse, pulse);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = pointer.color.main;
            ctx.shadowBlur = 25;
            
            // Draw a more intricate magic star cursor
            ctx.beginPath();
            ctx.moveTo(0, -25); ctx.quadraticCurveTo(6, -6, 25, 0);
            ctx.quadraticCurveTo(6, 6, 0, 25); ctx.quadraticCurveTo(-6, 6, -25, 0);
            ctx.quadraticCurveTo(-6, -6, 0, -25);
            ctx.fill();
            
            // Inner core
            ctx.fillStyle = pointer.color.main;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();`;
code = code.replace(pointerDrawOrig, pointerDrawNew);

fs.writeFileSync('src/views/BubblePop.tsx', code);
console.log('Tracking patched.');
