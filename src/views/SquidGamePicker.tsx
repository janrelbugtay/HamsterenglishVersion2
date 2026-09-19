import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import {
    Users, Play, Check, MousePointerClick, Skull, UserRound, VolumeX,
    Volume2, Power, Crown, RotateCcw, Square, Circle, Triangle, Gamepad2, ClipboardList,
    Maximize, Minimize
} from 'lucide-react';

const generateSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return hash;
};

const randomSeeded = (seed: number) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

const getSavedRoster = () => {
    const saved = localStorage.getItem('squid_roster');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
    }
    return Array.from({ length: 30 }, (_, i) => `Player ${i + 1}`);
};





class AudioEngine {
    ctx: AudioContext;
    muted: boolean;
    bgmGain: GainNode;

    constructor() {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.muted = false;
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.connect(this.ctx.destination);
        this.bgmGain.gain.value = 0.05;
    }
    play(type = 'click', freq = 400) {
        if (this.muted || this.ctx.state === 'suspended') return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            osc.start(); osc.stop(this.ctx.currentTime + 0.1);
        } else if (type === 'pop') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            osc.start(); osc.stop(this.ctx.currentTime + 0.1);
        } else if (type === 'boom') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.6);
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
            osc.start(); osc.stop(this.ctx.currentTime + 0.6);
        } else if (type === 'spin') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(100, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 3);
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 1);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 3);
            osc.start(); osc.stop(this.ctx.currentTime + 3);
        } else if (type === 'alarm') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.setValueAtTime(600, this.ctx.currentTime + 0.2);
            osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
            osc.start(); osc.stop(this.ctx.currentTime + 0.6);
        } else if (type === 'win') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, this.ctx.currentTime);
            osc.frequency.setValueAtTime(600, this.ctx.currentTime + 0.2);
            osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.4);
            osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.6);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.0);
            osc.start(); osc.stop(this.ctx.currentTime + 2.0);
        }
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
    }
    toggleMute() { this.muted = !this.muted; return this.muted; }
    resume() { if(this.ctx.state === 'suspended') this.ctx.resume(); }
}
let globalAudio: AudioEngine | null = null;

const announce = (text: string) => {
    if (globalAudio?.muted) return;
    
    // Attempt to grab voices
    let voices = window.speechSynthesis.getVoices();
    
    const speak = () => {
        voices = window.speechSynthesis.getVoices();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find a female voice
        const femaleVoice = voices.find(v => 
            v.name.includes('Female') || 
            v.name.includes('Samantha') || 
            v.name.includes('Zira') || 
            v.name.includes('Google UK English Female') ||
            (v.name.includes('Google US English') && v.name.includes('Female')) ||
            v.name.includes('Microsoft Hazel') ||
            v.name.includes('Microsoft Zira') ||
            v.name.includes('Karen') ||
            v.name.includes('Tessa') ||
            v.name.includes('Moira')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        } else if (voices.length > 0) {
            // Fallback to first voice, maybe modify pitch to simulate female
            utterance.pitch = 1.4;
        }
        
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.onvoiceschanged = null;
            speak();
        };
    } else {
        speak();
    }
};


const GameEngine = {
    generateGameSequence: (studentNames: string[], mode = 'picker', pickCount = 1) => {
        let activePlayers = [...studentNames];
        let rounds = [];

        if (mode === 'picker') {
            let shuffled = [...activePlayers].sort(() => 0.5 - Math.random());
            let eliminated = shuffled.slice(0, pickCount);
            let survivors = shuffled.slice(pickCount);
            
            let numDoors = Math.min(5, Math.max(1, activePlayers.length - 1)); 
            
            let distribution: string[][] = Array.from({length: numDoors}, () => []);
            let safeDoors: number[] = [];
            let trapDoors: number[] = [];
            
            for (let i = 0; i < numDoors; i++) safeDoors.push(i);

            // Guarantee at least 1 player per door to ensure no doors are empty
            for (let i = 0; i < numDoors; i++) {
                distribution[i].push(shuffled[i]);
            }
            // Distribute the rest randomly across all doors
            for (let i = numDoors; i < shuffled.length; i++) {
                distribution[Math.floor(Math.random() * numDoors)].push(shuffled[i]);
            }

            rounds.push({
                roundNum: 1, activePlayers: [...activePlayers], numDoors, distribution, survivors, eliminated, safeDoors, trapDoors
            });
            
            return { chosenOnes: eliminated, rounds: rounds, mode: mode };
        } else {
            let roundNum = 1;
            let maxSafetyRounds = 15; 

            while(activePlayers.length > 1 && maxSafetyRounds > 0) {
                let numDoors = 3;
                if(activePlayers.length <= 3) numDoors = 2;
                else if(activePlayers.length <= 6) numDoors = 3;
                else if(activePlayers.length <= 12) numDoors = 4;
                else numDoors = 6;

                let distribution: string[][] = Array.from({length: numDoors}, () => []);
                let shuffled = [...activePlayers].sort(() => 0.5 - Math.random());
                
                shuffled.forEach(p => {
                    let doorIdx = Math.floor(Math.random() * numDoors);
                    distribution[doorIdx].push(p);
                });
                
                let safeDoors: number[] = [];
                let trapDoors: number[] = [];
                let occupiedDoors = distribution.map((d, i) => d.length > 0 ? i : -1).filter(i => i !== -1);
                
                let survivors: string[] = [];
                let eliminated: string[] = [];

                if (occupiedDoors.length === 1) {
                    let onlyDoor = occupiedDoors[0];
                    safeDoors.push(onlyDoor);
                    let roomPlayers = distribution[onlyDoor];
                    
                    let eliminatedIdx = Math.floor(Math.random() * roomPlayers.length);
                    let eliminatedPlayer = roomPlayers[eliminatedIdx];
                    
                    survivors = roomPlayers.filter(p => p !== eliminatedPlayer);
                    eliminated = [eliminatedPlayer];
                } else {
                    let trapDoor = occupiedDoors[Math.floor(Math.random() * occupiedDoors.length)];
                    trapDoors.push(trapDoor);
                    
                    for(let i=0; i<numDoors; i++) {
                        if(i !== trapDoor) safeDoors.push(i);
                    }
                    
                    distribution.forEach((roomPlayers, idx) => {
                        if(safeDoors.includes(idx)) survivors.push(...roomPlayers);
                        else eliminated.push(...roomPlayers);
                    });
                }

                rounds.push({
                    roundNum, activePlayers: [...activePlayers], numDoors, distribution, survivors, eliminated, safeDoors, trapDoors
                });
                activePlayers = survivors;
                roundNum++;
                maxSafetyRounds--;
            }

            return { chosenOnes: [activePlayers[0]], rounds: rounds, mode: mode };
        }
    }
};

class ThreeManager {
    containerId: string;
    scene: THREE.Scene | null = null;
    camera: THREE.PerspectiveCamera | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    characters: any = {};
    doors: any[] = [];
    innerPlatform: any = null; 
    isAnimating = false;
    labels: any = {}; 
    labelContainer: HTMLDivElement | null = null;
    currentRoundData: any = null;
    onStateChange: any = null; 
    uniformTextures: any = {}; 
    baseLightIntensity = 0.8;
    ambientLight: any = null;
    dirLight: any = null;
    spotLight: any = null;
    alarmLight: any = null;
    shapes = ['star', 'triangle', 'umbrella', 'circle', 'square'];
    currentDoorRadius = 20;
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    spinTarget = 0;
    spinTimeout: any = null;
    waitingForSpinResolve: any = null;
    clickHandler: ((e: MouseEvent) => void) | null = null;

    constructor(containerId: string) {
        this.containerId = containerId;
    }

    init(onStateChangeCallback: any) {
        this.onStateChange = onStateChangeCallback;
        const container = document.getElementById(this.containerId);
        if(!container) return;
        
        this.labelContainer = document.createElement('div');
        this.labelContainer.style.position = 'absolute';
        this.labelContainer.style.top = '0';
        this.labelContainer.style.left = '0';
        this.labelContainer.style.width = '100%';
        this.labelContainer.style.height = '100%';
        this.labelContainer.style.pointerEvents = 'none';
        container.appendChild(this.labelContainer);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#87CEEB'); 
        this.scene.fog = new THREE.FogExp2('#87CEEB', 0.015);

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, Math.max(20, this.currentDoorRadius * 1.2), Math.max(35, this.currentDoorRadius * 1.8));
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        this.setupLights();
        this.setupEnvironment();
        this.setupInteraction();

        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        this.animate = this.animate.bind(this);
        this.isAnimating = true;
        requestAnimationFrame(this.animate);
    }

    setupLights() {
        if(!this.scene) return;
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(this.ambientLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff, this.baseLightIntensity);
        this.dirLight.position.set(20, 40, 20);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.near = 0.5;
        this.dirLight.shadow.camera.far = 150;
        this.scene.add(this.dirLight);
        
        this.spotLight = new THREE.SpotLight(0xffaa00, 0); 
        this.spotLight.position.set(0, 30, 0);
        this.spotLight.angle = Math.PI / 6;
        this.spotLight.penumbra = 0.5;
        this.scene.add(this.spotLight);

        this.alarmLight = new THREE.PointLight(0xff0000, 0, 100);
        this.alarmLight.position.set(0, 15, 0);
        this.scene.add(this.alarmLight);
    }

    setupEnvironment() {
        if(!this.scene) return;
        const envGroup = new THREE.Group();

        const outerFloorGeo = new THREE.RingGeometry(18.5, 40, 64);
        const outerFloorMat = new THREE.MeshStandardMaterial({ color: 0xebd5b3, roughness: 0.9 });
        const outerFloor = new THREE.Mesh(outerFloorGeo, outerFloorMat);
        outerFloor.rotation.x = -Math.PI / 2;
        outerFloor.position.y = -0.5; 
        outerFloor.receiveShadow = true;
        envGroup.add(outerFloor);
        
        const centerBaseGeo = new THREE.CylinderGeometry(18.5, 18.5, 0.9, 64);
        const centerBaseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
        const centerBase = new THREE.Mesh(centerBaseGeo, centerBaseMat);
        centerBase.position.y = -0.95;
        envGroup.add(centerBase);

        const numGuards = 12;
        for(let i=0; i<numGuards; i++) {
            const angle = (Math.PI * 2 / numGuards) * i;
            const radius = 32; 
            const shape = this.shapes[i % 3]; 
            const guard = this.createGuard(shape, angle, radius);
            envGroup.add(guard);
        }

        this.scene.add(envGroup);

        const innerPlatformGroup = new THREE.Group();
        const innerFloorGeo = new THREE.CylinderGeometry(18, 18, 1, 64);
        const innerFloorMat = new THREE.MeshStandardMaterial({ color: 0xebd5b3, roughness: 0.9 });
        const innerFloor = new THREE.Mesh(innerFloorGeo, innerFloorMat);
        innerFloor.position.y = -0.5;
        innerFloor.receiveShadow = true;
        innerPlatformGroup.add(innerFloor);

        const ringGeo = new THREE.RingGeometry(17.5, 18, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.01;
        innerPlatformGroup.add(ring);
        
        this.scene.add(innerPlatformGroup);
        this.innerPlatform = innerPlatformGroup;
    }

    
    setupInteraction() {
        const container = document.getElementById(this.containerId);
        if(!container) return;

        this.clickHandler = (event: MouseEvent) => {
            if (!this.camera || !this.innerPlatform) return;
            
            const rect = container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(this.innerPlatform, true);
            
            if (intersects.length > 0) {
                this.manualSpin();
            }
        };

        container.addEventListener('click', this.clickHandler);
    }

    manualSpin() {
        if (!this.innerPlatform) return;
        
        if (!this.spinTarget || isNaN(this.spinTarget)) {
            this.spinTarget = this.innerPlatform.rotation.y;
        }
        
        this.spinTarget += Math.PI * 4; 
        
        const ytPlayer = document.getElementById('yt-player') as HTMLIFrameElement;
        if (ytPlayer && ytPlayer.contentWindow) {
             ytPlayer.contentWindow.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
        }
        
        if (this.spinTimeout) {
            clearTimeout(this.spinTimeout);
            this.spinTimeout = null;
        }
        
        gsap.to(this.innerPlatform.rotation, {
            y: this.spinTarget,
            duration: 2.5,
            ease: "power2.out",
            overwrite: true,
            onComplete: () => {
                if (this.waitingForSpinResolve) {
                    this.spinTimeout = setTimeout(() => {
                        if (this.waitingForSpinResolve) {
                            if (ytPlayer && ytPlayer.contentWindow) {
                                ytPlayer.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*");
                            }
                            this.waitingForSpinResolve();
                            this.waitingForSpinResolve = null;
                        }
                    }, 1000);
                } else {
                    setTimeout(() => {
                        if (ytPlayer && ytPlayer.contentWindow) {
                            ytPlayer.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*");
                        }
                    }, 500);
                }
            }
        });
    }

    createPlayerTexture(name: string, numberStr: string) {
        const playerNum = numberStr;
        if (this.uniformTextures[playerNum]) return this.uniformTextures[playerNum];

        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if(!ctx) return null;
        
        ctx.fillStyle = '#2d6a4f'; 
        ctx.fillRect(0, 0, 512, 512);
        
        ctx.fillStyle = 'white';
        ctx.fillRect(246, 0, 20, 512); 
        
        ctx.fillStyle = 'white';
        ctx.fillRect(60, 100, 160, 100);
        
        ctx.fillStyle = '#2d6a4f';
        ctx.font = 'bold 65px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(playerNum, 140, 150);

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        this.uniformTextures[playerNum] = tex;
        return tex;
    }

    createCharacter(name: string, numberStr: string) {
        const seed = generateSeed(name);
        const group = new THREE.Group();
        group.rotation.order = 'YXZ';
        
        const skinTone = new THREE.Color().setHSL(0.08, 0.6, 0.3 + (randomSeeded(seed)*0.5));
        const uniformColor = new THREE.Color(0x2d6a4f);

        const matSkin = new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.7 });
        const matUniform = new THREE.MeshStandardMaterial({ color: uniformColor, roughness: 0.9 });
        const matTorso = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, map: this.createPlayerTexture(name, numberStr), roughness: 0.9 
        });
        const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });

        const headGroup = new THREE.Group();
        headGroup.position.y = 2.6;
        const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), matSkin);
        head.castShadow = true;
        headGroup.add(head);

        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.1), eyeMat);
        eyeL.position.set(-0.25, 0.1, -0.61);
        const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.1), eyeMat);
        eyeR.position.set(0.25, 0.1, -0.61);
        headGroup.add(eyeL, eyeR);

        const noseTone = skinTone.clone().multiplyScalar(0.9);
        const noseMat = new THREE.MeshStandardMaterial({ color: noseTone, roughness: 0.8 });
        const nose = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.15), noseMat);
        nose.position.set(0, -0.1, -0.62);
        headGroup.add(nose);

        const mouthMat = new THREE.MeshBasicMaterial({ color: 0x221111 });
        const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.1), mouthMat);
        mouth.position.set(0, -0.3, -0.61);
        headGroup.add(mouth);

        group.add(headGroup);

        const torso = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.8), [
            matUniform, matUniform, matUniform, matUniform, matUniform, matTorso
        ]);
        torso.position.y = 1.2; torso.castShadow = true; group.add(torso);

        const armGeo = new THREE.BoxGeometry(0.4, 1.6, 0.4);
        armGeo.translate(0, -0.6, 0);
        const armL = new THREE.Mesh(armGeo, matUniform);
        armL.position.set(-0.9, 1.8, 0); armL.castShadow = true; group.add(armL);
        const armR = new THREE.Mesh(armGeo, matUniform);
        armR.position.set(0.9, 1.8, 0); armR.castShadow = true; group.add(armR);

        const legGeo = new THREE.BoxGeometry(0.5, 1.2, 0.5);
        legGeo.translate(0, -0.6, 0);
        const shoeGeo = new THREE.BoxGeometry(0.55, 0.2, 0.6);
        
        const legLGroup = new THREE.Group();
        const legL = new THREE.Mesh(legGeo, matUniform);
        const shoeL = new THREE.Mesh(shoeGeo, matWhite);
        shoeL.position.set(0, -1.3, 0.05);
        legLGroup.add(legL); legLGroup.add(shoeL);
        legLGroup.position.set(-0.4, 0.4, 0); legLGroup.castShadow = true; group.add(legLGroup);

        const legRGroup = new THREE.Group();
        const legR = new THREE.Mesh(legGeo, matUniform);
        const shoeR = new THREE.Mesh(shoeGeo, matWhite);
        shoeR.position.set(0, -1.3, 0.05);
        legRGroup.add(legR); legRGroup.add(shoeR);
        legRGroup.position.set(0.4, 0.4, 0); legRGroup.castShadow = true; group.add(legRGroup);

        group.userData = { 
            name, isAlive: true, isMoving: false, moveTime: randomSeeded(seed) * 10,
            parts: { head, torso, armL, armR, legLGroup, legRGroup },
            localAngle: 0, localRadius: 0
        };
        return group;
    }

    createGuard(shapeType: string, angle: number, radius: number) {
        const group = new THREE.Group();
        const suitColor = new THREE.Color(0xef233c); 
        const maskColor = new THREE.Color(0x111111);
        
        const matSuit = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.9 });
        const matMask = new THREE.MeshStandardMaterial({ color: maskColor, roughness: 0.5 });
        const matWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const head = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), matMask);
        head.position.y = 2.65;
        
        let shapeMesh;
        if (shapeType === 'circle') shapeMesh = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 24), matWhite);
        else if (shapeType === 'triangle') {
            shapeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 3), matWhite);
            shapeMesh.rotation.x = Math.PI / 2; shapeMesh.rotation.y = Math.PI; 
        } else { 
            shapeMesh = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 4, 4), matWhite);
            shapeMesh.rotation.z = Math.PI / 4;
        }
        shapeMesh.position.z = 0.66; 
        head.add(shapeMesh); group.add(head);

        const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 0.9), matSuit);
        body.position.y = 1.2; group.add(body);

        const armGeo = new THREE.BoxGeometry(0.45, 1.6, 0.45);
        const armL = new THREE.Mesh(armGeo, matSuit);
        armL.position.set(-0.9, 1.2, 0.5); armL.rotation.x = -Math.PI / 2.2; group.add(armL);
        const armR = new THREE.Mesh(armGeo, matSuit);
        armR.position.set(0.9, 1.2, 0.5); armR.rotation.x = -Math.PI / 2.2; group.add(armR);

        const legGeo = new THREE.BoxGeometry(0.55, 1.2, 0.55);
        const legL = new THREE.Mesh(legGeo, matSuit);
        legL.position.set(-0.4, -0.2, 0); group.add(legL);
        const legR = new THREE.Mesh(legGeo, matSuit);
        legR.position.set(0.4, -0.2, 0); group.add(legR);
        
        const gunMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const gun = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 1.8), gunMat);
        gun.position.set(0, 1.1, 1.0); group.add(gun);

        group.position.set(Math.cos(angle) * radius, 1, Math.sin(angle) * radius);
        group.lookAt(0, 1, 0); 
        group.traverse(child => { if ((child as THREE.Mesh).isMesh) child.castShadow = true; });
        return group;
    }

    createDoors(numDoors: number) {
        if(!this.scene) return;
        this.doors.forEach(d => {
             if (d.group && d.group.parent) d.group.parent.remove(d.group);
        });
        this.doors = [];

        const radius = Math.max(20, (numDoors * 8) / (Math.PI * 2));
        this.currentDoorRadius = radius; 
        const angleStep = (Math.PI * 2) / numDoors;

        for(let i=0; i<numDoors; i++) {
            const angle = i * angleStep;
            const doorGroup = new THREE.Group();
            
            const frameGeo = new THREE.BoxGeometry(6, 9, 1);
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
            const frame = new THREE.Mesh(frameGeo, frameMat);
            doorGroup.add(frame);

            const panelGeo = new THREE.BoxGeometry(5, 8, 1.2);
            const doorColor = new THREE.Color().setHSL(i/numDoors, 0.8, 0.5);
            const panelMat = new THREE.MeshStandardMaterial({ color: doorColor, emissive: doorColor, emissiveIntensity: 0.2 });
            panelGeo.translate(2.5, 0, 0); const panel = new THREE.Mesh(panelGeo, panelMat);
            panel.position.set(-2.5, 0, 0.1);
            
            const shapeType = this.shapes[i % this.shapes.length];
            const matWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
            let doorShape;
            if (shapeType === 'circle') {
                doorShape = new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 8, 24), matWhite);
            } else if (shapeType === 'triangle') {
                doorShape = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.3, 3), matWhite);
                doorShape.rotation.x = Math.PI / 2; doorShape.rotation.y = Math.PI;
            } else if (shapeType === 'square') {
                doorShape = new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 4, 4), matWhite);
                doorShape.rotation.z = Math.PI / 4;
            } else if (shapeType === 'star') {
                const starShape = new THREE.Shape();
                const outerRadius = 1.2;
                const innerRadius = 0.5;
                for (let j = 0; j < 10; j++) {
                    const a = (j * Math.PI) / 5;
                    const r = (j % 2 === 0) ? outerRadius : innerRadius;
                    if (j === 0) starShape.moveTo(Math.sin(a) * r, Math.cos(a) * r);
                    else starShape.lineTo(Math.sin(a) * r, Math.cos(a) * r);
                }
                const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.2, bevelEnabled: false });
                starGeo.center();
                doorShape = new THREE.Mesh(starGeo, matWhite);
            } else if (shapeType === 'umbrella') {
                doorShape = new THREE.Group();
                const domeGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32, 1, false, 0, Math.PI);
                const dome = new THREE.Mesh(domeGeo, matWhite);
                dome.rotation.x = Math.PI / 2;
                const stickGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.0);
                const stick = new THREE.Mesh(stickGeo, matWhite);
                stick.position.y = -0.5;
                const hookGeo = new THREE.TorusGeometry(0.25, 0.1, 8, 16, Math.PI);
                const hook = new THREE.Mesh(hookGeo, matWhite);
                hook.position.set(0.25, -1.0, 0);
                hook.rotation.z = Math.PI;
                doorShape.add(dome); doorShape.add(stick); doorShape.add(hook);
                doorShape.scale.set(0.8, 0.8, 0.8);
            }
            doorShape.position.set(2.5, 1, 0.65);
            panel.add(doorShape);

            doorGroup.add(panel);
            doorGroup.position.set(Math.cos(angle) * radius, 4.5, Math.sin(angle) * radius);
            doorGroup.lookAt(0, 4.5, 0);

            this.scene.add(doorGroup);
            this.doors.push({ group: doorGroup, panel, angle, color: doorColor });
        }
    }

    spawnPlayers(players: string[]) {
        Object.values(this.characters).forEach((c: any) => {
            if (c && c.parent) c.parent.remove(c);
        });
        this.characters = {};
        if(this.labelContainer) this.labelContainer.innerHTML = '';
        this.labels = {};

        let currentRing = 0;
        let playersPlaced = 0;
        let baseRadius = 5;

        while (playersPlaced < players.length) {
            let capacity = 8 + currentRing * 7; 
            let playersInRing = Math.min(capacity, players.length - playersPlaced);
            let radius = baseRadius + currentRing * 3;
            let angleStep = (Math.PI * 2) / playersInRing;

            for (let i = 0; i < playersInRing; i++) {
                const name = players[playersPlaced];
                const numberStr = (playersPlaced + 1).toString();
                const char = this.createCharacter(name, numberStr);
                const angle = i * angleStep;
                
                char.userData.localAngle = angle;
                char.userData.localRadius = radius;
                
                char.position.set(Math.cos(angle) * radius, 1, Math.sin(angle) * radius);
                char.lookAt(0, 1, 0); 

                if(this.innerPlatform) this.innerPlatform.add(char);
                this.characters[name] = char;

                if(this.labelContainer) {
                    const label = document.createElement('div');
                    label.className = 'character-label';
                    label.innerHTML = `<span style="color:#10b981">#${numberStr}</span> ${name}`;
                    label.style.position = 'absolute';
                    label.style.background = 'rgba(15, 23, 42, 0.8)';
                    label.style.border = '2px solid #10b981';
                    label.style.color = 'white';
                    label.style.padding = '2px 8px';
                    label.style.borderRadius = '8px';
                    label.style.fontFamily = "'Fredoka', sans-serif";
                    label.style.fontSize = '14px';
                    label.style.fontWeight = '600';
                    label.style.pointerEvents = 'none';
                    label.style.transform = 'translate(-50%, -100%)';
                    label.style.transition = 'opacity 0.3s';
                    label.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
                    label.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
                    label.style.zIndex = '5';
                    label.style.whiteSpace = 'nowrap';
                    this.labelContainer.appendChild(label);
                    this.labels[name] = label;
                }
                playersPlaced++;
            }
            currentRing++;
        }

        if(this.camera) {
            const targetY = Math.max(20, 10 + currentRing * 2);
            const targetZ = Math.max(35, 20 + currentRing * 4);

            gsap.fromTo(this.camera.position, 
                { x: 0, y: targetY + 20, z: targetZ + 25 },
                { x: 0, y: targetY, z: targetZ, duration: 2, ease: "power2.out" }
            );
        }
    }

    updateLabels() {
        if(!this.camera) return;
        
        Object.keys(this.characters).forEach(name => {
            const char = this.characters[name];
            const label = this.labels[name];
            if(!char || !label) return;

            if(char.userData.isAlive) {
                const vector = new THREE.Vector3();
                char.getWorldPosition(vector);
                vector.y += 4.5; 
                vector.project(this.camera!);

                const width = this.renderer?.domElement.clientWidth || window.innerWidth;
                const height = this.renderer?.domElement.clientHeight || window.innerHeight;

                const x = (vector.x * .5 + .5) * width;
                const y = (vector.y * -.5 + .5) * height;

                if (vector.z > 1) {
                    label.style.opacity = '0';
                } else {
                    label.style.opacity = '1';
                    label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
                }
            } else {
                label.style.opacity = '0';
            }
        });
    }
    
    async playRound(roundData: any) {
        if(!globalAudio) return;
        this.currentRoundData = roundData;
        this.createDoors(roundData.numDoors);
        
        // Zoom camera to see all doors
        if (this.camera) {
            gsap.to(this.camera.position, {
                x: 0,
                y: Math.max(20, this.currentDoorRadius * 1.2),
                z: Math.max(35, this.currentDoorRadius * 1.8),
                duration: 2,
                ease: "power2.out"
            });
        }
        
        this.onStateChange({ phase: 'SPINNING', round: roundData.roundNum, msg: 'CLICK PLATFORM TO SPIN' });
        
        // Wait for user to manually spin and finish spinning
        await new Promise<void>(resolve => {
            this.waitingForSpinResolve = resolve;
        });

        this.onStateChange({ phase: 'DOORS', msg: 'CHOOSE A ROOM!' });
        globalAudio.play('pop', 300);
        
        this.doors.forEach(d => {
            gsap.to(d.panel.rotation, { y: Math.PI / 1.8, duration: 0.8, ease: "power2.inOut" }); 
        });
        await new Promise(r => setTimeout(r, 1000));
        
        Object.keys(this.characters).forEach(name => {
            const char = this.characters[name];
            if(char && char.userData.isAlive) {
                const worldPos = new THREE.Vector3();
                char.getWorldPosition(worldPos);
                const worldQuat = new THREE.Quaternion();
                char.getWorldQuaternion(worldQuat);
                
                if(this.scene) this.scene.add(char);
                char.position.copy(worldPos);
                char.quaternion.copy(worldQuat);
            }
        });

        const movePromises: Promise<void>[] = [];
        let isRunning = true;
        const footstepLoop = () => {
            if (!isRunning) return;
            if (globalAudio) globalAudio.play('footstep');
            setTimeout(footstepLoop, 100 + Math.random() * 50); // fast scattered steps
        };
        footstepLoop();

        roundData.distribution.forEach((doorGroup: string[], doorIndex: number) => {
            const door = this.doors[doorIndex];
            const doorDir = door.group.position.clone().normalize();
            const roomPos = door.group.position.clone().add(doorDir.multiplyScalar(3)); 

            doorGroup.forEach((playerName) => {
                const char = this.characters[playerName];
                if(!char) return;
                
                const isEliminated = roundData.eliminated.includes(playerName);
                char.userData.isMoving = true;

                let offset = new THREE.Vector3((Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4);
                let finalPos = roomPos.clone().add(offset);
                
                // If eliminated, they don't make it to the door
                if (isEliminated) {
                     finalPos = char.position.clone().lerp(roomPos, 0.3 + Math.random() * 0.3);
                     finalPos.add(new THREE.Vector3((Math.random() - 0.5)*5, 0, (Math.random() - 0.5)*5));
                }
                
                finalPos.y = 1;
                char.lookAt(finalPos);
                
                const behaviorRand = Math.random();
                let behavior = 'normal';
                if (behaviorRand < 0.25) behavior = 'crawl';
                else if (behaviorRand < 0.5) behavior = 'fall';
                else if (behaviorRand < 0.75) behavior = 'fight';
                
                const duration = 5.0 + (Math.random() * 1.0); // Exactly ~5 seconds long
                
                movePromises.push(new Promise<void>(resolve => {
                    const tl = gsap.timeline({ onComplete: () => {
                        char.userData.isMoving = false;
                        gsap.to([char.userData.parts.armL.rotation, char.userData.parts.armR.rotation, char.userData.parts.legLGroup.rotation, char.userData.parts.legRGroup.rotation], {x: 0, duration: 0.2});
                        if (!isEliminated) char.lookAt(0, 1, 0);
                        resolve();
                    }});
                    
                    if (behavior === 'crawl') {
                        tl.to(char.rotation, { x: -Math.PI / 2.5, duration: 0.3 });
                        tl.to(char.position, { y: 0.5, duration: 0.3 }, "<");
                        tl.to(char.position, { x: finalPos.x, z: finalPos.z, duration: duration, ease: "none" });
                        if (!isEliminated) {
                            tl.to(char.rotation, { x: 0, duration: 0.3 });
                            tl.to(char.position, { y: 1.0, duration: 0.3 }, "<");
                        }
                    } else if (behavior === 'fall') {
                        const midX = (char.position.x + finalPos.x) / 2;
                        const midZ = (char.position.z + finalPos.z) / 2;
                        
                        tl.to(char.position, { x: midX, z: midZ, duration: duration / 3, ease: "power1.inOut" }, 0);
                        tl.to(char.position, { y: "+=1.5", duration: 0.2, yoyo: true, repeat: Math.floor((duration/3) / 0.2) }, 0);
                        
                        tl.to(char.rotation, { x: -Math.PI / 2.2, duration: 0.2 }, duration/3);
                        tl.to(char.position, { y: 0.5, duration: 0.2 }, duration/3);
                        tl.to({}, { duration: 0.5 }); // pause
                        
                        if (!isEliminated) {
                            tl.to(char.rotation, { x: 0, duration: 0.2 });
                            tl.to(char.position, { y: 1.0, duration: 0.2 }, "<");
                            tl.to(char.position, { x: finalPos.x, z: finalPos.z, duration: duration / 3, ease: "power1.inOut" });
                        } else {
                             tl.to(char.position, { x: finalPos.x, z: finalPos.z, duration: duration / 3, ease: "none" });
                        }
                    } else if (behavior === 'fight') {
                        // They run, but occasionally bump violently to the side as if shoved
                        const midX = (char.position.x + finalPos.x) / 2;
                        const midZ = (char.position.z + finalPos.z) / 2;
                        
                        tl.to(char.position, { x: midX, z: midZ, duration: duration / 2, ease: "power1.inOut" }, 0);
                        tl.to(char.position, { y: "+=1.5", duration: 0.2, yoyo: true, repeat: Math.floor((duration/2) / 0.2) }, 0);
                        
                        // The bump (recoil sideways)
                        const bumpX = midX + (Math.random() - 0.5) * 4;
                        const bumpZ = midZ + (Math.random() - 0.5) * 4;
                        tl.to(char.position, { x: bumpX, z: bumpZ, duration: 0.2, ease: "power2.out" }, duration/2);
                        
                        // Scramble back up and finish run
                        if (!isEliminated) {
                            tl.to(char.position, { x: finalPos.x, z: finalPos.z, duration: (duration / 2) - 0.2, ease: "power1.inOut" });
                            tl.to(char.position, { y: "+=1.5", duration: 0.2, yoyo: true, repeat: Math.floor(((duration/2)-0.2) / 0.2) }, "<");
                        } else {
                            tl.to(char.position, { x: finalPos.x, z: finalPos.z, duration: (duration / 2) - 0.2, ease: "none" });
                        }
                    } else {
                        // Normal run
                        tl.to(char.position, { x: finalPos.x, z: finalPos.z, duration: duration, ease: "power1.inOut" }, 0);
                        tl.to(char.position, { y: "+=1.5", duration: 0.2, yoyo: true, repeat: Math.floor(duration / 0.2) }, 0);
                    }
                }));
            });
        });
        
        await Promise.all(movePromises);
        isRunning = false; // stop footstep loop
        
        globalAudio.play('pop', 200);
        this.doors.forEach(d => { gsap.to(d.panel.rotation, { y: 0, duration: 0.5 }); });
        await new Promise(r => setTimeout(r, 1000));

        this.onStateChange({ phase: 'EVALUATING', msg: 'EVALUATING...' });
        globalAudio.play('alarm');
        
        gsap.to(this.ambientLight, { intensity: 0.1, duration: 0.5 });
        gsap.to(this.dirLight, { intensity: 0.1, duration: 0.5 });
        if(this.scene) gsap.to(this.scene.fog, { density: 0.04, duration: 1 });
        gsap.to(this.alarmLight, { intensity: 10, duration: 0.5, yoyo: true, repeat: 3 });

        if(this.camera) {
            gsap.to(this.camera.position, {
                x: "+=1", y: "+=1", z: "+=1", yoyo: true, repeat: 10, duration: 0.05,
                onComplete: () => { this.camera?.position.set(0, Math.max(20, this.currentDoorRadius * 1.2), Math.max(35, this.currentDoorRadius * 1.8)); }
            });
        }

        await new Promise(r => setTimeout(r, 2000));

        if(roundData.eliminated.length > 0) {
            globalAudio.play('boom');
            roundData.eliminated.forEach((playerName: string) => {
                const char = this.characters[playerName];
                char.userData.isAlive = false;
                
                char.traverse((child: any) => {
                    if (child.isMesh && child.material && child.material.color) {
                        child.material = child.material.clone();
                        child.material.color.setHex(0x555555);
                    }
                });

                gsap.to(char.rotation, { x: -Math.PI / 2, duration: 0.5, ease: "bounce.out" });
                gsap.to(char.position, { y: 0.3, duration: 0.5 });
            });
            
            this.onStateChange({ phase: 'ELIMINATED', eliminatedThisRound: roundData.eliminated });
            

        }

        gsap.to(this.ambientLight, { intensity: 0.7, duration: 1 });
        gsap.to(this.dirLight, { intensity: this.baseLightIntensity, duration: 1 });
        if(this.scene) gsap.to(this.scene.fog, { density: 0.015, duration: 1 });
        gsap.to(this.alarmLight, { intensity: 0, duration: 1 });

        globalAudio.play('pop', 400);
        this.doors.forEach((d, idx) => {
            gsap.to(d.panel.rotation, { y: Math.PI / 1.8, duration: 0.8, ease: "power2.out" }); 
            if (roundData.trapDoors && roundData.trapDoors.includes(idx)) {
                d.panel.material.color.setHex(0xff0000); d.panel.material.emissive.setHex(0x550000);
            } else if (roundData.safeDoors && roundData.safeDoors.includes(idx)) {
                d.panel.material.color.setHex(0x00ff00); d.panel.material.emissive.setHex(0x005500);
            }
        });
        
        await new Promise(r => setTimeout(r, 2000));

        if (roundData.survivors.length > 0) {
            const returnPromises: Promise<void>[] = [];
            if(this.innerPlatform) {
                this.innerPlatform.rotation.y = 0;
                this.spinTarget = 0;
            } 
            
            roundData.survivors.forEach((playerName: string, i: number) => {
                const char = this.characters[playerName];
                const angle = (Math.PI * 2 / roundData.survivors.length) * i;
                const radius = 6;
                
                char.userData.localAngle = angle;
                char.userData.localRadius = radius;
                
                const finalPos = new THREE.Vector3(Math.cos(angle)*radius, 1, Math.sin(angle)*radius);
                
                char.lookAt(finalPos);
                char.userData.isMoving = true;

                returnPromises.push(new Promise(resolve => {
                    gsap.to(char.position, {
                        x: finalPos.x, z: finalPos.z, duration: 2, ease: "power2.inOut",
                        onComplete: () => {
                            char.userData.isMoving = false;
                            gsap.to([char.userData.parts.armL.rotation, char.userData.parts.armR.rotation, char.userData.parts.legLGroup.rotation, char.userData.parts.legRGroup.rotation], {x: 0, duration: 0.2});
                            char.lookAt(0,1,0);
                            
                            if(this.innerPlatform) this.innerPlatform.add(char);
                            char.position.set(finalPos.x, 1, finalPos.z);
                            resolve();
                        }
                    });
                }));
            });
            await Promise.all(returnPromises);
        }

        this.onStateChange({ phase: 'CLEANUP', eliminatedThisRound: [] });

        this.doors.forEach(d => {
             gsap.to(d.group.position, { y: -10, duration: 1.5, ease:"power2.in" });
        });
        
        await new Promise(r => setTimeout(r, 1500));
    }

    async playWinnerSequence(chosenOnes: string[], mode: string) {
        if(!globalAudio) return;
        this.onStateChange({ phase: 'WINNER', msg: mode === 'picker' ? 'ELIMINATION COMPLETE' : 'SOLE SURVIVOR' });
        
        gsap.to(this.spotLight, { intensity: 10, duration: 2 });
        gsap.to(this.ambientLight, { intensity: 0.1, duration: 2 });
        gsap.to(this.dirLight, { intensity: 0.1, duration: 2 });
        if(this.scene) this.scene.background = new THREE.Color('#0f172a'); 

        if (mode === 'picker') {
            let centerX = 0, centerZ = 0;
            chosenOnes.forEach(name => {
                let c = this.characters[name];
                let wp = new THREE.Vector3();
                c.getWorldPosition(wp);
                centerX += wp.x;
                centerZ += wp.z;
            });
            centerX /= chosenOnes.length;
            centerZ /= chosenOnes.length;

            this.spotLight.position.set(centerX, 20, centerZ);
            this.spotLight.target.position.set(centerX, 0, centerZ);
            this.spotLight.target.updateMatrixWorld();

            if(this.camera) {
                gsap.to(this.camera.position, {
                    x: centerX, y: 6, z: centerZ + 12, duration: 3, ease: "power2.out"
                });
                
                const lookTarget = new THREE.Vector3(0,0,0);
                gsap.to(lookTarget, {
                    x: centerX, y: 1, z: centerZ, duration: 2,
                    onUpdate: () => this.camera?.lookAt(lookTarget)
                });
            }
            globalAudio.play('boom');

        } else {
            const char = this.characters[chosenOnes[0]];
            const worldPos = new THREE.Vector3();
            char.getWorldPosition(worldPos);

            if(this.camera) {
                gsap.to(this.camera.position, {
                    x: worldPos.x, y: worldPos.y + 3, z: worldPos.z + 10, duration: 3, ease: "power2.out"
                });
                
                const lookTarget = new THREE.Vector3(0,0,0);
                gsap.to(lookTarget, {
                    x: worldPos.x, y: worldPos.y + 2, z: worldPos.z, duration: 2,
                    onUpdate: () => this.camera?.lookAt(lookTarget)
                });
            }

            globalAudio.play('win');

            gsap.to(char.position, { y: 4, yoyo: true, repeat: -1, duration: 0.5, ease: "power1.inOut" });
            gsap.to(char.rotation, { y: Math.PI * 2, repeat: -1, duration: 2, ease: "linear" });
            gsap.to([char.userData.parts.armL.rotation, char.userData.parts.armR.rotation], { x: Math.PI, duration: 0.5 });
        }
    }

    onWindowResize() {
        const container = document.getElementById(this.containerId);
        if(!container || !this.camera || !this.renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        if(!this.isAnimating) return;
        requestAnimationFrame(this.animate);
        
        const time = Date.now() * 0.001;
        Object.values(this.characters).forEach((char: any) => {
            if(char && char.userData.isAlive) {
                char.userData.parts.torso.scale.y = 1 + Math.sin(time * 3 + char.userData.moveTime) * 0.02;
                if(char.userData.isMoving) {
                    const speed = 15;
                    char.userData.parts.legLGroup.rotation.x = Math.sin(time * speed) * 0.6;
                    char.userData.parts.legRGroup.rotation.x = Math.sin(time * speed + Math.PI) * 0.6;
                    char.userData.parts.armL.rotation.x = Math.sin(time * speed + Math.PI) * 0.6;
                    char.userData.parts.armR.rotation.x = Math.sin(time * speed) * 0.6;
                }
            }
        });

        this.updateLabels();
        if(this.scene && this.camera) this.renderer?.render(this.scene, this.camera);
    }

    destroy() {
        this.isAnimating = false;
        if (this.renderer && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        if (this.labelContainer && this.labelContainer.parentNode) {
            this.labelContainer.parentNode.removeChild(this.labelContainer);
        }
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
}

const Button = ({ children, onClick, variant = 'primary', className = '', size='md', active=false }: any) => {
    const baseStyle = "font-bold rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.4)] active:shadow-[0_0px_0_rgba(0,0,0,0)] active:translate-y-1 transition-all flex items-center justify-center gap-2";
    const variants: any = {
        primary: "bg-gradient-to-b from-rose-500 to-rose-700 text-white hover:from-rose-400 hover:to-rose-600 border-2 border-rose-800",
        success: "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white hover:from-emerald-400 hover:to-emerald-600 border-2 border-emerald-800",
        warning: "bg-gradient-to-b from-orange-400 to-orange-600 text-white border-2 border-orange-800",
        secondary: "bg-slate-700 text-white hover:bg-slate-600 border-2 border-slate-900"
    };
    
    let activeStyle = "";
    if (active) {
        if (variant === 'primary') activeStyle = "ring-4 ring-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]";
        if (variant === 'success') activeStyle = "ring-4 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]";
    }

    const sizes: any = {
        sm: "px-3 py-1 text-sm",
        md: "px-6 py-3 text-lg",
        lg: "px-10 py-5 text-2xl uppercase tracking-wider"
    };
    return (
        <button 
            onClick={() => { globalAudio?.play('click'); onClick(); }} 
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className} ${activeStyle}`}
        >
            {children}
        </button>
    );
};

const StudentManager = ({ students, setStudents, onBack }: any) => {
    const [input, setInput] = useState(students.join('\n'));

    const handleSave = () => {
        const list = input.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
        setStudents(list);
        localStorage.setItem('squid_roster', JSON.stringify(list));
        onBack();
    };

    return (
        <div className="flex-1 bg-slate-900/90 backdrop-blur-md p-4 md:p-8 flex flex-col items-center justify-center pointer-events-auto h-full overflow-y-auto z-20">
            <div className="bg-slate-800 p-6 md:p-8 rounded-2xl w-full max-w-2xl border-4 border-rose-600 shadow-[0_0_40px_rgba(244,63,94,0.3)] relative flex flex-col max-h-[90vh] md:max-h-[800px]">
                <h2 className="text-3xl text-white mb-2 display-font flex items-center gap-3 shrink-0">
                    <Users className="w-8 h-8 text-rose-400" /> Player Roster
                </h2>
                <p className="text-slate-400 mb-4 shrink-0">Enter names (one per line). Players will be automatically numbered by their line (e.g. 1 to {input.split('\n').filter((s: string)=>s.trim()).length || 30}).</p>
                
                <textarea 
                    className="w-full flex-1 bg-slate-900 text-emerald-400 p-4 rounded-xl border-2 border-slate-700 focus:border-rose-500 outline-none font-mono text-lg resize-none mb-6 shadow-inner min-h-[200px]"
                    value={input} onChange={(e) => setInput(e.target.value)} placeholder="Player 1&#10;Player 2..."
                />
                
                <div className="flex justify-between items-center shrink-0">
                    <span className="text-emerald-300 font-bold bg-slate-900 border border-emerald-800/50 px-4 py-2 rounded-lg">
                        Total Players: {input.split('\n').filter((s: string)=>s.trim()).length}
                    </span>
                    <div className="flex gap-4">
                        <Button variant="secondary" onClick={onBack}>Cancel</Button>
                        <Button variant="success" onClick={handleSave}>
                            <Check className="w-5 h-5" /> Update Roster
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SquidGamePicker() {
    const [view, setView] = useState('home'); 
    const [students, setStudents] = useState<string[]>(getSavedRoster());
    const [gameState, setGameState] = useState<any>({ phase: 'IDLE', msg: '', eliminatedThisRound: [] }); 
    const [chosenOnes, setChosenOnes] = useState<string[]>([]);
    const [totalEliminated, setTotalEliminated] = useState(0);
    const [gameMode, setGameMode] = useState('picker');
    const [pickCount, setPickCount] = useState(1);
    
    const threeManagerRef = useRef<ThreeManager | null>(null);
    const isAudioMuted = useRef(false);
    const [muteUI, setMuteUI] = useState(false);

    useEffect(() => {
        if (!globalAudio) {
            globalAudio = new AudioEngine();
        }
        
        const tm = new ThreeManager('canvas-container');
        tm.init((stateUpdate: any) => {
            setGameState((prev: any) => ({...prev, ...stateUpdate}));
        });
        threeManagerRef.current = tm;
        tm.spawnPlayers(students);
        
        return () => {
            if (threeManagerRef.current) {
                threeManagerRef.current.destroy();
                threeManagerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if(view === 'home' && threeManagerRef.current && gameState.phase === 'IDLE') {
            threeManagerRef.current.spawnPlayers(students);
            if(threeManagerRef.current.camera) {
                threeManagerRef.current.camera.position.set(0, 20, 35);
                threeManagerRef.current.camera.lookAt(0,0,0);
            }
            if(threeManagerRef.current.ambientLight) threeManagerRef.current.ambientLight.intensity = 0.7;
            if(threeManagerRef.current.dirLight) threeManagerRef.current.dirLight.intensity = threeManagerRef.current.baseLightIntensity;
            if(threeManagerRef.current.spotLight) threeManagerRef.current.spotLight.intensity = 0;
            if(threeManagerRef.current.scene) threeManagerRef.current.scene.background = new THREE.Color('#87CEEB'); 
        }
    }, [students, view, gameState.phase]);
    
    useEffect(() => {
        if (gameState.eliminatedThisRound && gameState.eliminatedThisRound.length > 0) {
             setTotalEliminated(prev => prev + gameState.eliminatedThisRound.length);
        }
    }, [gameState.eliminatedThisRound]);

    useEffect(() => {
        const timeouts: (ReturnType<typeof setTimeout>)[] = [];
        if (gameState.phase === 'WINNER' && gameMode === 'picker') {
            chosenOnes.forEach((name, idx) => {
                timeouts.push(setTimeout(() => {
                    const pNum = students.indexOf(name) + 1;
                    announce(`Player ${pNum}, eliminated.`);
                }, idx * 1500));
            });
        } else if (gameState.phase === 'ELIMINATED' && gameMode === 'survival') {
            if (gameState.eliminatedThisRound && gameState.eliminatedThisRound.length > 0) {
                gameState.eliminatedThisRound.forEach((name: string, idx: number) => {
                    timeouts.push(setTimeout(() => {
                        const pNum = students.indexOf(name) + 1;
                        announce(`Player ${pNum}, eliminated.`);
                    }, idx * 1500));
                });
            }
        }
        return () => timeouts.forEach(clearTimeout);
    }, [gameState.phase, chosenOnes, gameMode, students, gameState.eliminatedThisRound]);

    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                const elem = document.getElementById('squid-picker-root') || document.documentElement;
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
        } catch (err) {
            console.error("Error attempting to toggle fullscreen:", err);
            try {
                if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } catch (e) {
                console.error("Fallback fullscreen error:", e);
            }
        }
    };

    const toggleMute = () => {
        if (globalAudio) {
            isAudioMuted.current = globalAudio.toggleMute();
            setMuteUI(isAudioMuted.current);
        }
    };

    const startGameWith = async (roster: string[]) => {
        if(roster.length < (gameMode === 'picker' ? pickCount + 1 : 2)) {
            alert(`Need at least ${gameMode === 'picker' ? pickCount + 1 : 2} players for this mode!`);
            setView('home');
            return;
        }
        if (globalAudio) globalAudio.resume(); 
        setView('game');
        setChosenOnes([]);
        setTotalEliminated(0);
        
        const tm = threeManagerRef.current;
        if(!tm) return;
        
        // Spawn players before starting sequence
        tm.spawnPlayers(roster);
        if(tm.ambientLight) tm.ambientLight.intensity = 0.7;
        if(tm.dirLight) tm.dirLight.intensity = tm.baseLightIntensity;
        if(tm.spotLight) tm.spotLight.intensity = 0;
        if(tm.scene) tm.scene.background = new THREE.Color('#87CEEB'); 

        const engine = GameEngine.generateGameSequence(roster, gameMode, pickCount);
        
        for (let i = 0; i < engine.rounds.length; i++) {
            const round = engine.rounds[i];
            
            setGameState({ phase: 'SETUP', msg: `ROUND ${round.roundNum}`, eliminatedThisRound: [] });
            await new Promise(r => setTimeout(r, 1500));
            
            await tm.playRound(round);
            
            if (i < engine.rounds.length - 1) {
                 setGameState({ phase: 'SETUP', msg: `${round.survivors.length} PLAYERS REMAIN`, eliminatedThisRound: [] });
                 await new Promise(r => setTimeout(r, 2000));
            }
        }

        setChosenOnes(engine.chosenOnes);
        await tm.playWinnerSequence(engine.chosenOnes, engine.mode);
    };

    const startGame = async () => startGameWith(students);

    
    const continueGame = () => {
        // Remove eliminated players from the students roster
        const remainingStudents = students.filter(s => !chosenOnes.includes(s));
        setStudents(remainingStudents);
        localStorage.setItem('squid_roster', JSON.stringify(remainingStudents));
        
        if (gameMode === 'picker') {
            startGameWith(remainingStudents);
        } else {
            // Reset the game back to the home screen ready for the next round
            setGameState({ phase: 'IDLE', msg: '', eliminatedThisRound: [] });
            setView('home');
            setChosenOnes([]);
            setTotalEliminated(0);
        }
    };

    const resetGame = () => {
        setGameState({ phase: 'IDLE', msg: '', eliminatedThisRound: [] });
        setView('home');
        setChosenOnes([]);
        setTotalEliminated(0);
    };

    const renderHome = () => (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm pointer-events-auto z-20">
            <div className="text-center bg-slate-900/95 p-10 rounded-[3rem] border-4 border-rose-600 shadow-[0_0_60px_rgba(244,63,94,0.4)] relative overflow-hidden w-full max-w-xl">
                
                <div className="text-5xl mb-4 text-rose-500 flex justify-center gap-6 relative z-10 items-center">
                    <Circle className="w-12 h-12 animate-pulse" />
                    <Triangle className="w-12 h-12 animate-pulse" style={{animationDelay: '0.3s'}} />
                    <Square className="w-12 h-12 animate-pulse" style={{animationDelay: '0.6s'}} />
                </div>
                <h1 className="text-5xl text-white font-bold mb-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 relative z-10" style={{fontFamily: "'Fredoka', sans-serif"}}>
                    ELIMINATION <span className="text-rose-500">PICKER</span>
                </h1>
                <p className="text-lg text-emerald-400 mb-8 font-medium tracking-widest uppercase relative z-10">Will your number be called?</p>
                
                <div className="bg-slate-800/80 rounded-2xl p-4 mb-8 border border-slate-700">
                    <div className="flex gap-4 justify-center mb-4">
                        <Button 
                            variant={gameMode === 'picker' ? 'primary' : 'secondary'} 
                            onClick={() => setGameMode('picker')} 
                            active={gameMode === 'picker'}
                            className="flex-1 text-sm py-2"
                        >
                            <MousePointerClick className="w-4 h-4" /> Picker Mode
                        </Button>
                        <Button 
                            variant={gameMode === 'survival' ? 'success' : 'secondary'} 
                            onClick={() => setGameMode('survival')} 
                            active={gameMode === 'survival'}
                            className="flex-1 text-sm py-2"
                        >
                            <Skull className="w-4 h-4" /> Survival Mode
                        </Button>
                    </div>
                    
                    {gameMode === 'picker' && (
                        <div className="flex flex-col gap-2 bg-slate-900 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300 font-bold text-sm uppercase tracking-wider">Target Eliminations:</span>
                                        <span className="text-rose-500 font-bold text-xl bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 shadow-inner">{pickCount}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="10" 
                                        value={pickCount} 
                                        onChange={(e) => setPickCount(parseInt(e.target.value))}
                                        className="w-full mt-2 accent-rose-600 cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 font-bold px-1 mt-1">
                                        <span>1</span>
                                        <span>10</span>
                                    </div>
                                </div>
                    )}
                    {gameMode === 'survival' && (
                        <div className="text-emerald-400 text-sm font-bold tracking-widest py-2">
                            MULTIPLE ROUNDS • ONE SOLE SURVIVOR
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 items-center relative z-10">
                    <Button size="lg" onClick={startGame} className="w-full">
                        <Play className="w-6 h-6" /> COMMENCE GAME
                    </Button>
                    <Button variant="secondary" onClick={() => setView('students')} className="w-full">
                        <UserRound className="w-5 h-5" /> MANAGE ROSTER ({students.length})
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderGameUI = () => (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between">
            <div className="flex justify-between items-start p-6">
                <div className="flex gap-4 pointer-events-auto">
                    <div className="bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-2xl border-2 border-slate-700 shadow-lg flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-emerald-400 text-xs font-bold tracking-widest mb-1 uppercase">Players Alive</div>
                            <div className="text-4xl font-bold text-white leading-none" style={{fontFamily: "'Fredoka', sans-serif"}}>
                                {gameState.phase === 'WINNER' ? (gameMode === 'survival' ? 1 : (threeManagerRef.current?.currentRoundData?.activePlayers.length || students.length) - pickCount) : 
                                 threeManagerRef.current?.currentRoundData?.activePlayers.length || students.length}
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-2xl border-2 border-slate-700 shadow-lg flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-rose-500 text-xs font-bold tracking-widest mb-1 uppercase">Eliminated</div>
                            <div className="text-4xl font-bold text-white leading-none" style={{fontFamily: "'Fredoka', sans-serif"}}>
                                {totalEliminated}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-3 pointer-events-auto">
                    <button 
                        onClick={toggleFullscreen} 
                        className="w-12 h-12 bg-slate-900/90 rounded-full text-white hover:bg-slate-700 transition border-2 border-slate-700 flex items-center justify-center shadow-lg"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? <Minimize className="w-5 h-5 text-emerald-400" /> : <Maximize className="w-5 h-5 text-slate-200" />}
                    </button>
                    <button onClick={toggleMute} className="w-12 h-12 bg-slate-900/90 rounded-full text-white hover:bg-slate-700 transition border-2 border-slate-700 flex items-center justify-center shadow-lg" title={muteUI ? "Unmute Sound" : "Mute Sound"}>
                        {muteUI ? <VolumeX className="text-red-500" /> : <Volume2 className="text-emerald-400" />}
                    </button>
                    <button onClick={resetGame} className="w-12 h-12 bg-slate-900/90 rounded-full text-white hover:bg-rose-600 hover:border-rose-700 transition border-2 border-slate-700 flex items-center justify-center shadow-lg" title="Reset Game">
                        <Power />
                    </button>
                </div>
            </div>

            {gameState.eliminatedThisRound && gameState.eliminatedThisRound.length > 0 && (
                <div className="absolute right-6 top-1/4 w-72 flex flex-col gap-2 pointer-events-none">
                    {gameState.eliminatedThisRound.map((name: string, idx: number) => (
                        <div key={idx} className="bg-slate-900/90 border-l-4 border-rose-500 text-white p-3 rounded-r-lg shadow-lg flex items-center gap-3 transition-all" style={{animation: 'fade-in-right 0.3s ease-out forwards', animationDelay: `${idx * 0.1}s`, opacity: 0, transform: 'translateX(20px)'}}>
                            <Skull className="text-rose-500 w-5 h-5" />
                            <div>
                                <span className="font-mono text-emerald-400 font-bold mr-2">#{(students.indexOf(name) + 1).toString()}</span>
                                        <span className="text-sm font-semibold">{name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fade-in-right {
                    to { opacity: 1; transform: translateX(0); }
                }
            `}} />

            {gameState.msg && gameState.phase !== 'WINNER' && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full text-center pointer-events-none z-50 flex justify-center">
                    <div className="inline-block bg-slate-900/90 backdrop-blur-md border-b-4 border-rose-600 px-12 py-4 rounded-xl shadow-[0_10px_40px_rgba(244,63,94,0.4)]">
                        <h2 className="text-3xl md:text-5xl text-white tracking-widest uppercase drop-shadow-md font-bold" style={{fontFamily: "'Fredoka', sans-serif"}}>
                            {gameState.msg}
                        </h2>
                    </div>
                </div>
            )}

            {gameState.phase === 'WINNER' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-auto">
                    <div className="inline-block bg-slate-900/95 border-4 border-rose-600 px-20 py-12 rounded-[2rem] shadow-[0_0_100px_rgba(244,63,94,0.6)] relative overflow-hidden min-w-[600px] transition-transform animate-fade-in">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/30 to-transparent"></div>
                        
                        <div className="text-rose-500 text-6xl mb-4 relative z-10 flex justify-center">
                            {gameMode === 'picker' ? <Skull className="w-16 h-16" /> : <Crown className="w-16 h-16 text-emerald-400" />}
                        </div>
                        
                        <h2 className="text-2xl text-emerald-400 font-bold mb-6 tracking-widest relative z-10">
                            {gameMode === 'picker' ? (chosenOnes.length > 1 ? 'PLAYERS ELIMINATED' : 'PLAYER ELIMINATED') : 'SOLE SURVIVOR'}
                        </h2>
                        
                        <div className="flex flex-col gap-6 mb-10 relative z-10">
                            {chosenOnes.map((name, i) => {
                                const playerNum = (students.indexOf(name) + 1).toString();
                                                                                                const canvas = document.createElement('canvas');
                                canvas.width = 256; canvas.height = 256;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    ctx.fillStyle = '#2d6a4f';
                                    ctx.fillRect(0, 0, 256, 256);
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.font = 'bold 120px "Fredoka", sans-serif';
                                    ctx.fillText(playerNum, 128, 128);
                                }
                                const playerImage = canvas.toDataURL();
                                return (
                                    <div key={i} className="flex items-center gap-6 bg-black/50 p-6 rounded-2xl border border-slate-700">
                                        <div className={`w-24 h-24 shrink-0 rounded-xl bg-slate-800 border-2 overflow-hidden flex items-center justify-center ${gameMode === "picker" ? "border-rose-500" : "border-emerald-500"}`}>
                                            <img src={playerImage} alt="Player Avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="text-xl text-rose-300 font-bold mb-2 tracking-widest uppercase">
                                                PLAYER #{playerNum}
                                            </div>
                                            <div className="text-4xl sm:text-5xl text-white font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 uppercase" style={{fontFamily: "'Fredoka', sans-serif"}}>
                                                {name}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <Button size="lg" variant={gameMode === 'picker' ? 'primary' : 'success'} onClick={continueGame} className="mx-auto relative z-10 w-full shadow-[0_0_30px_rgba(16,185,129,0.5)] uppercase tracking-widest text-xl h-16 rounded-2xl font-black">
                            <RotateCcw className="w-6 h-6 mr-3" /> CONTINUE
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div id="squid-picker-root" className="w-full h-full bg-[#0f172a] text-slate-100 flex relative overflow-hidden">
            {/* Absolute positioning for the Three.js canvas so it stays under the UI layer and takes full space */}
            <div id="canvas-container" className="absolute inset-0 z-10" />
            <iframe id="yt-player" className="hidden" src="https://www.youtube.com/embed/SbAKYgfYET8?enablejsapi=1&autoplay=0" allow="autoplay" title="YouTube video player" frameBorder="0"></iframe>

            {/* UI Layer wrapper - must have pointer-events-none so interactions pass through to canvas if needed (except for the sidebar) */}
            <div id="ui-layer" className="absolute inset-0 z-20 flex font-sans text-slate-100 pointer-events-none">
                
                {(view === 'home' || view === 'students') && (
                    <div className="w-72 bg-slate-900/95 backdrop-blur border-r border-slate-700 flex flex-col pointer-events-auto shadow-2xl z-30">
                        <div className="p-8 border-b border-slate-800 flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                                <Square className="text-white w-6 h-6" />
                            </div>
                            <h2 className="font-bold text-2xl leading-none text-white tracking-wide" style={{fontFamily: "'Fredoka', sans-serif"}}>ELIMINATION<br/><span className="text-rose-500">PICKER</span></h2>
                        </div>
                        
                        <nav className="flex-1 p-6 flex flex-col gap-3">
                            <button onClick={() => setView('home')} className={`flex items-center gap-4 p-4 rounded-xl transition font-medium ${view === 'home' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                                <Gamepad2 className="w-6 h-6 text-center" /> Control Room
                            </button>
                            <button onClick={() => setView('students')} className={`flex items-center gap-4 p-4 rounded-xl transition font-medium ${view === 'students' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                                <ClipboardList className="w-6 h-6 text-center" /> Player Roster
                            </button>
                            <button onClick={toggleFullscreen} className="flex items-center gap-4 p-4 rounded-xl transition font-medium hover:bg-slate-800 text-slate-400 hover:text-white">
                                {isFullscreen ? <Minimize className="w-6 h-6 text-emerald-400" /> : <Maximize className="w-6 h-6 text-center" />}
                                <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
                            </button>
                        </nav>
                        
                        <div className="p-6 border-t border-slate-800 text-xs text-slate-600 text-center uppercase tracking-widest font-bold flex flex-col gap-1">
                            <span>Version 3.0</span>
                            <span className={gameMode === 'picker' ? 'text-rose-500' : 'text-emerald-500'}>
                                {gameMode === 'picker' ? 'Picker Active' : 'Survival Active'}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex-1 relative">
                    {(view === 'home' || view === 'students') && (
                        <div className="absolute top-6 right-6 z-40 flex items-center gap-3 pointer-events-auto">
                            <button
                                onClick={toggleFullscreen}
                                className="w-12 h-12 bg-slate-900/90 hover:bg-slate-700 rounded-full text-white transition border-2 border-slate-700 flex items-center justify-center shadow-lg"
                                title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
                            >
                                {isFullscreen ? <Minimize className="w-5 h-5 text-emerald-400" /> : <Maximize className="w-5 h-5 text-slate-200" />}
                            </button>
                            <button
                                onClick={toggleMute}
                                className="w-12 h-12 bg-slate-900/90 hover:bg-slate-700 rounded-full text-white transition border-2 border-slate-700 flex items-center justify-center shadow-lg"
                                title={muteUI ? "Unmute Sound" : "Mute Sound"}
                            >
                                {muteUI ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
                            </button>
                        </div>
                    )}
                    {view === 'home' && renderHome()}
                    {view === 'students' && <StudentManager students={students} setStudents={setStudents} onBack={() => setView('home')} />}
                    {view === 'game' && renderGameUI()}
                </div>
            </div>

        </div>
    );
}
