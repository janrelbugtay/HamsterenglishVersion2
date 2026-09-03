const fs = require('fs');

const bubble = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');
const yoga = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// Extract parsePastedQuiz
const parseStart = bubble.indexOf('function parsePastedQuiz');
let parseEnd = bubble.indexOf('\n}\n', parseStart);
const parsePastedQuizStr = bubble.substring(parseStart, parseEnd + 3);

// Extract QuizEditor
const editorStart = bubble.indexOf('function QuizEditor');
// QuizEditor ends right before parsePastedQuiz in BubblePop.tsx (actually wait, parsePastedQuiz is after it)
let editorEnd = bubble.indexOf('\n}\n', bubble.lastIndexOf('return (', parseStart) > 0 ? bubble.lastIndexOf('return (', parseStart) : parseStart);
// Actually, let's just use regex for function QuizEditor
const editorRegex = /function QuizEditor\([\s\S]*?return \([\s\S]*?\n\s*\);\n\}/;
const editorMatch = bubble.match(editorRegex);
const quizEditorStr = editorMatch[0];

// In YogaQuiz.tsx, replace the old QuizEditor
const oldEditorRegex = /function QuizEditor\([\s\S]*?return \([\s\S]*?\n\s*\);\n\}/;
let newYoga = yoga.replace(oldEditorRegex, quizEditorStr + '\n\n' + parsePastedQuizStr);

// Also update Question interface
newYoga = newYoga.replace('options: [string, string, string];', 'options: string[];');

fs.writeFileSync('src/views/YogaQuiz.tsx', newYoga);
console.log('Copied QuizEditor successfully');
