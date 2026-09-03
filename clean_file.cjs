const fs = require('fs');

let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf-8');

// Remove states
content = content.replace(/const \[galleryPoses, setGalleryPoses\][\s\S]*?\]\);/s, '');
content = content.replace(/const \[newPoseUrl, setNewPoseUrl\] = useState\(""\);/s, '');
content = content.replace(/const \[poseImages, setPoseImages\][\s\S]*?\]\);/s, '');
content = content.replace(/const \[activePoseSettingsIndex, setActivePoseSettingsIndex\] = useState<number \| null>\(null\);/s, '');

// The modal block
let startIndex = content.indexOf('{activePoseSettingsIndex !== null && (');
if (startIndex !== -1) {
    let endIndex = content.indexOf('<AnimatePresence>', startIndex);
    if (endIndex !== -1) {
        content = content.substring(0, startIndex) + content.substring(endIndex);
    }
}

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Cleaned up");
