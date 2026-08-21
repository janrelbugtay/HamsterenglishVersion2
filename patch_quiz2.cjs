const fs = require('fs');
let file = fs.readFileSync('src/views/HamsterPopQuiz.tsx', 'utf8');

const oldHandle = `  const handleStartLesson = async (config: any) => {
    setLessonConfig(config);
    navigateTo('loading');
    
    try {
      const res = await fetch('/api/generate-hamster-questions', {`;

const newHandle = `  const [isGenerating, setIsGenerating] = useState(false);
  const handleStartLesson = async (config: any) => {
    setLessonConfig(config);
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/generate-hamster-questions', {`;

const oldHandleEnd = `    } catch (e) {
      console.error(e);
      setQuestions(generateDynamicQuestions(config));
    }
    navigateTo('player');
  };`;

const newHandleEnd = `    } catch (e) {
      console.error(e);
      setQuestions(generateDynamicQuestions(config));
    }
    setIsGenerating(false);
    navigateTo('player');
  };`;

file = file.replace(oldHandle, newHandle).replace(oldHandleEnd, newHandleEnd);

// Find ConfigView call and pass isGenerating
const oldConfigCall = `{currentView === 'config' && <ConfigView onStartLesson={handleStartLesson} />}`;
const newConfigCall = `{currentView === 'config' && <ConfigView onStartLesson={handleStartLesson} isGenerating={isGenerating} />}`;
file = file.replace(oldConfigCall, newConfigCall);

fs.writeFileSync('src/views/HamsterPopQuiz.tsx', file);
