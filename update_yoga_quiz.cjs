const fs = require('fs');

let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

const oldGetQuizData = `  const getQuizData = (): Quiz => {
    if (initialGame) {
      return {
        id: initialGame.id,
        title: initialGame.name || "Yoga Quiz",
        subject: "Grammar",
        topic: initialGame.topic || "",
        classLevel: initialGame.className || "",
        questions: initialGame.customQuestions || initialQuizzes[0].questions,
        thumbnail: "🧘",
        folderId: initialGame.folderId,
        isPublic: initialGame.isPublic,
      };
    }
    return initialQuizzes[0];
  };`;

const newGetQuizData = `  const getQuizData = (): Quiz => {
    if (initialGame && (initialGame.customQuestions || initialGame.id)) {
      return {
        id: initialGame.id,
        title: initialGame.name || "Yoga Quiz",
        subject: "Grammar",
        topic: initialGame.topic || "",
        classLevel: initialGame.className || "",
        questions: initialGame.customQuestions && initialGame.customQuestions.length > 0 ? initialGame.customQuestions : [{ id: Date.now(), text: "", options: ["", "", ""], answerIndex: 0 }],
        thumbnail: "🧘",
        folderId: initialGame.folderId,
        isPublic: initialGame.isPublic,
      };
    }
    return {
        id: Date.now(),
        title: "",
        subject: "Grammar",
        topic: "",
        classLevel: "",
        questions: [{ id: Date.now(), text: "", options: ["", "", ""], answerIndex: 0 }],
        thumbnail: "🧘",
        folderId: "",
        isPublic: false
    };
  };`;

content = content.replace(oldGetQuizData, newGetQuizData);
fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Updated getQuizData");
