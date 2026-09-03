const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

const oldRender = `<span className={\`\${isMany ? 'text-[4rem] md:text-[6rem] xl:text-[7rem]' : 'text-[6rem] md:text-[8rem] xl:text-[11rem]'} drop-shadow-sm leading-none\`}>{fallbackEmojis[opt.poseIndex]}</span>`;
const newRender = `{poseImages[opt.poseIndex] ? (
    <img src={poseImages[opt.poseIndex]} alt="Pose" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
) : (
    <span className={\`\${optionEmojiClass} drop-shadow-sm leading-none\`}>{fallbackEmojis[opt.poseIndex]}</span>
)}`;

content = content.replace(oldRender, newRender);
fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Patched render successfully");
