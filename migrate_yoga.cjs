const fs = require('fs');

let content = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

const migrationCode = `
      // --- Migration Script for Yoga Quizzes ---
      const savedYogaQuizzes = localStorage.getItem('yogaQuizzes');
      if (savedYogaQuizzes && user) {
        try {
          const parsedQuizzes = JSON.parse(savedYogaQuizzes);
          for (const q of parsedQuizzes) {
            // Only migrate if it has been edited (meaning it is not the default hardcoded one, or at least give it a chance)
            // But actually we can just migrate all of them.
            if (q.title && q.questions && q.questions.length > 0) {
              await addDoc(collection(db, "mysteryBoxGames"), {
                name: q.title || "Yoga Quiz",
                folderId: "",
                topic: q.topic || "",
                className: q.classLevel || "",
                gameType: "yoga-quiz",
                customQuestions: q.questions,
                userId: user.uid,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                isPublic: false,
              });
            }
          }
          localStorage.removeItem('yogaQuizzes');
          console.log('Successfully migrated yogaQuizzes to Firebase');
        } catch (err) {
          console.error('Failed to migrate yoga quizzes', err);
        }
      }
      // -----------------------------------------
`;

if (!content.includes('// --- Migration Script for Yoga Quizzes ---')) {
  content = content.replace(
    'const loadData = async () => {\n    setLoading(true);\n    try {',
    'const loadData = async () => {\n    setLoading(true);\n    try {' + migrationCode
  );
  fs.writeFileSync('src/views/GamesLibrary.tsx', content);
  console.log('Migration code injected successfully.');
} else {
  console.log('Migration code already present.');
}
