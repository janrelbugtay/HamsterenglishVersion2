const fs = require('fs');
let code = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// 1. Auto-capitalize first word
code = code.replace(
    /this\.words = clean\.split\(' '\)\.filter\(w=>w\.length>0\);/,
    "this.words = clean.split(' ').filter(w=>w.length>0);\n                if (this.words.length > 0) {\n                    this.words[0] = this.words[0].charAt(0).toUpperCase() + this.words[0].slice(1);\n                }"
);

// 2. Make slot dataset case-sensitive
code = code.replace(
    /s\.dataset\.w = w\.toLowerCase\(\);/,
    "s.dataset.w = w;"
);

// 3. Make slots array case-sensitive
code = code.replace(
    /this\.slots\.push\(\{ el: s, w: w\.toLowerCase\(\), filled: false \}\);/,
    "this.slots.push({ el: s, w: w, filled: false });"
);

// 4. Make click matching case-sensitive
code = code.replace(
    /if \(this\.slots\[nextI\]\.w === clickedB\.wordText\.toLowerCase\(\)\) \{/,
    "if (this.slots[nextI].w === clickedB.wordText) {"
);

// 5. Make drag/drop matching case-sensitive
code = code.replace(
    /const wordText = b\.wordText\.toLowerCase\(\);/,
    "const wordText = b.wordText;"
);

// 6. Make hint matching case-sensitive
code = code.replace(
    /const b = this\.bubbles\.find\(b => !b\.snapped && b\.wordText\.toLowerCase\(\) === n\.w\);/g,
    "const b = this.bubbles.find(b => !b.snapped && b.wordText === n.w);"
);

fs.writeFileSync('public/bubble-sentence.html', code);
console.log("Patch applied.");
