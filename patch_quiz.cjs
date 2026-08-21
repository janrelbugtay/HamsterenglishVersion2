const fs = require('fs');
let file = fs.readFileSync('src/views/HamsterPopQuiz.tsx', 'utf8');

const oldHandle = `  const handleStartLesson = (config: any) => {
    setLessonConfig(config);
    const generated = generateDynamicQuestions(config);
    setQuestions(generated);
    navigateTo('player');
  };`;

const newHandle = `  const handleStartLesson = async (config: any) => {
    setLessonConfig(config);
    navigateTo('loading');
    
    try {
      const res = await fetch('/api/generate-hamster-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: config.topic,
          level: config.level,
          types: config.selectedTypes,
          freq: config.frequency,
          videoUrl: videoUrl
        })
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      } else {
        setQuestions(generateDynamicQuestions(config));
      }
    } catch (e) {
      console.error(e);
      setQuestions(generateDynamicQuestions(config));
    }
    navigateTo('player');
  };`;

file = file.replace(oldHandle, newHandle);
fs.writeFileSync('src/views/HamsterPopQuiz.tsx', file);
