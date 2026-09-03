const fs = require('fs');

let yoga = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

const oldOpts = `        let opts = [
            { text: currentItem.options[0], isCorrect: currentItem.answerIndex === 0, poseIndex: 0 },
            { text: currentItem.options[1], isCorrect: currentItem.answerIndex === 1, poseIndex: 1 },
            { text: currentItem.options[2], isCorrect: currentItem.answerIndex === 2, poseIndex: 2 }
        ];`;

const newOpts = `        let opts = currentItem.options
            .map((opt, i) => ({ text: opt, isCorrect: currentItem.answerIndex === i, poseIndex: i % fallbackEmojis.length }))
            .filter(opt => opt.text.trim() !== "");`;

yoga = yoga.replace(oldOpts, newOpts);

// Also need to add more fallbackEmojis just in case there are up to 6 options
yoga = yoga.replace(
    "const fallbackEmojis = ['🧘‍♀️', '🙆‍♀️', '🧎‍♀️']; // Always correspond to Pose 0, 1, 2",
    "const fallbackEmojis = ['🧘‍♀️', '🙆‍♀️', '🧎‍♀️', '🧍‍♀️', '🚶‍♀️', '🏃‍♀️', '🤸‍♀️', '🤸‍♂️'];"
);

// Update grid class to be dynamic
yoga = yoga.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-12 w-full max-w-7xl mx-auto">',
    '<div className={`grid grid-cols-1 md:grid-cols-2 ${shuffledOptions.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6 xl:gap-12 w-full max-w-7xl mx-auto`}>'
);

// In the QuizEditor we copied from BubblePop, it says generatedTitle = "Bubble Pop Game". We should change it to "Yoga Quiz"
yoga = yoga.replace(/const generatedTitle = "Bubble Pop Game";/g, 'const generatedTitle = "Yoga Quiz";');
yoga = yoga.replace(/setShowPublishModal\(true\);/g, 'setShowPublishModal(true);'); // Just ensuring no issues

fs.writeFileSync('src/views/YogaQuiz.tsx', yoga);
console.log('Fixed YogaGame opts building');
