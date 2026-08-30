const fs = require('fs');
let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// 1. Remove lobby settings panel
html = html.replace(/<!-- Settings Panel -->[\s\S]*?(?=<!-- Play Button -->)/, '');

// 2. Add to modal-settings
const soundEffectsSettingsHTML = `
                <!-- Sound Effects -->
                <div class="flex items-center justify-between">
                    <label class="font-bold text-gray-700">Sound Effects</label>
                    <input type="checkbox" id="setting-sound-effects" class="w-6 h-6" onchange="Settings.update('soundEffects', this.checked)">
                </div>

                <!-- Response Time -->
                <div class="flex items-center justify-between">
                    <label class="font-bold text-gray-700">Response Time</label>
                    <select id="setting-response-time" class="p-2 rounded-lg border-2 border-gray-200 font-bold text-gray-700 focus:border-blue-500 outline-none bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onchange="Settings.update('responseTime', this.value)">
                        <option value="default">Default</option>
                        <option value="30">30s</option>
                        <option value="60">1m</option>
                        <option value="120">2m</option>
                        <option value="300">5m</option>
                    </select>
                </div>
`;

html = html.replace(/(<!-- Timer -->\s*<div class="flex items-center justify-between">\s*<label class="font-bold text-gray-700">Timer Enabled<\/label>\s*<input type="checkbox" id="setting-timer" class="w-6 h-6" onchange="Settings.update\('timerEnabled', this.checked\)">\s*<\/div>)/g, `$1\n${soundEffectsSettingsHTML}`);

// 3. Add to modal-pause
const soundEffectsPauseHTML = `
                <!-- Sound Effects -->
                <div class="flex items-center justify-between">
                    <label class="text-sm font-bold text-gray-500">Sound Effects</label>
                    <input type="checkbox" id="setting-sound-effects-pause" class="w-6 h-6" onchange="Settings.update('soundEffects', this.checked)">
                </div>

                <!-- Response Time -->
                <div class="flex items-center justify-between">
                    <label class="text-sm font-bold text-gray-500">Response Time</label>
                    <select id="setting-response-time-pause" class="p-1 rounded-lg border border-gray-200 font-bold text-gray-500 text-sm focus:border-blue-500 outline-none bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onchange="Settings.update('responseTime', this.value)">
                        <option value="default">Default</option>
                        <option value="30">30s</option>
                        <option value="60">1m</option>
                        <option value="120">2m</option>
                        <option value="300">5m</option>
                    </select>
                </div>
`;

html = html.replace(/(<!-- Timer -->\s*<div class="flex items-center justify-between">\s*<label class="text-sm font-bold text-gray-500">Enable Timer<\/label>\s*<input type="checkbox" id="setting-timer-pause" class="w-6 h-6" onchange="Settings.update\('timerEnabled', this.checked\)">\s*<\/div>)/g, `$1\n${soundEffectsPauseHTML}`);

// 4. Update Bubble Speed
html = html.replace(/<input type="range" id="setting-speed" min="0\.5" max="3" step="0\.5"/g, '<input type="range" id="setting-speed" min="1" max="10" step="1"');
html = html.replace(/<input type="range" id="setting-speed-pause" min="0\.5" max="3" step="0\.5"/g, '<input type="range" id="setting-speed-pause" min="1" max="10" step="1"');

// 5. Update Settings.update and apply
const settingsUpdateTarget = `} else if (key === 'timerEnabled') {`;
const settingsUpdateReplace = `} else if (key === 'soundEffects') {
                    Storage.data.profile.settings.soundEffects = val;
                    window.isSoundMuted = !val;
                    if (typeof Audio !== 'undefined' && Audio.toggleSfx) {
                        Audio.toggleSfx(val);
                        Audio.sfxEnabled = val;
                    }
                } else if (key === 'responseTime') {
                    Storage.data.profile.settings.responseTime = val;
                } else if (key === 'timerEnabled') {`;
html = html.replace(settingsUpdateTarget, settingsUpdateReplace);

const settingsApplyTarget = `byId('setting-timer', s.timerEnabled !== false, 'checked');`;
const settingsApplyReplace = `byId('setting-timer', s.timerEnabled !== false, 'checked');
                byId('setting-timer-pause', s.timerEnabled !== false, 'checked');
                byId('setting-sound-effects', s.soundEffects !== false, 'checked');
                byId('setting-sound-effects-pause', s.soundEffects !== false, 'checked');
                byId('setting-response-time', s.responseTime || 'default');
                byId('setting-response-time-pause', s.responseTime || 'default');
`;
html = html.replace(settingsApplyTarget, settingsApplyReplace);

// 6. Fix lobby-timer-select reference in JS
const timerLogicTarget = `const lobbyTimer = document.getElementById('lobby-timer-select');
                if (lobbyTimer && lobbyTimer.value !== 'default') {
                    seconds = parseInt(lobbyTimer.value);
                }`;
const timerLogicReplace = `let responseTimeStr = 'default';
                if(window.Storage && Storage.data && Storage.data.profile && Storage.data.profile.settings) {
                    responseTimeStr = Storage.data.profile.settings.responseTime || 'default';
                }
                if (responseTimeStr !== 'default') {
                    seconds = parseInt(responseTimeStr);
                }`;
html = html.replace(timerLogicTarget, timerLogicReplace);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("HTML updated");
