const fs = require('fs');

let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// The initial question in getQuizData has 3 options
content = content.replace(
    '[{ id: Date.now(), text: "", options: ["", "", ""], answerIndex: 0 }]',
    '[{ id: Date.now(), text: "", options: ["", ""], answerIndex: 0 }]'
);
content = content.replace(
    '[{ id: Date.now(), text: "", options: ["", "", ""], answerIndex: 0 }]',
    '[{ id: Date.now(), text: "", options: ["", ""], answerIndex: 0 }]'
);


// In QuizEditor, addQuestion should add 2 options
content = content.replace(
    "setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', '', ''], answerIndex: 0 }]);",
    "setQuestions([...questions, { id: Date.now(), text: '', options: ['', ''], answerIndex: 0 }]);"
);

// In newItems mapped in handlePaste, it should probably only do 4 options if it needs to, but Bubble Pop paste generates up to 4 options anyway. We can leave parsePastedQuiz alone.

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Fixed Yoga Quiz addQuestion default to 2 options");
