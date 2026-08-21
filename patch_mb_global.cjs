const fs = require('fs');
let content = fs.readFileSync('public/mystery-box.html', 'utf-8');

content = content.replace('const openMediaPicker = (qIdx, oIdx) => {', 'window.openMediaPicker = (qIdx, oIdx) => {');
content = content.replace('const removeOptionImage = (qIdx, oIdx) => {', 'window.removeOptionImage = (qIdx, oIdx) => {');

fs.writeFileSync('public/mystery-box.html', content);
