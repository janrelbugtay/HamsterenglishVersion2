const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf-8');

content = content.replace(/{ type: 'image', value: 'Gemini_Generated_Image_8sdnyn8sdnyn8sdn.png' }/g, "{ type: 'image', value: '/Gemini_Generated_Image_8sdnyn8sdnyn8sdn.png' }");
content = content.replace(/{ type: 'image', value: 'Gemini_Generated_Image_40k1j140k1j140k1.png' }/g, "{ type: 'image', value: '/Gemini_Generated_Image_40k1j140k1j140k1.png' }");
content = content.replace(/{ type: 'image', value: 'Gemini_Generated_Image_f2iu2ef2iu2ef2iu.png' }/g, "{ type: 'image', value: '/Gemini_Generated_Image_f2iu2ef2iu2ef2iu.png' }");
content = content.replace(/{ type: 'image', value: 'Gemini_Generated_Image_fdwj35fdwj35fdwj.png' }/g, "{ type: 'image', value: '/Gemini_Generated_Image_fdwj35fdwj35fdwj.png' }");
content = content.replace(/{ type: 'image', value: 'Gemini_Generated_Image_hdkz3whdkz3whdkz.png' }/g, "{ type: 'image', value: '/Gemini_Generated_Image_hdkz3whdkz3whdkz.png' }");
content = content.replace(/{ type: 'image', value: 'Gemini_Generated_Image_l660sql660sql660.png' }/g, "{ type: 'image', value: '/Gemini_Generated_Image_l660sql660sql660.png' }");

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Updated paths");
