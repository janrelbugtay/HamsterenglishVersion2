const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const stateInsertTarget = '  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);';
const stateInsertNew = '  const [showPublishModal, setShowPublishModal] = useState(false);\n  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);';
code = code.replace(stateInsertTarget, stateInsertNew);

const handleSaveTarget = `  const handleSave = () => {
    const generatedTitle = "Bubble Pop Game";

    const validQuestions = questions.filter(q => q.text.trim());
    if(validQuestions.length === 0) {
      setErrorMsg("Please add at least one complete question.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    
    onSave({
      ...quiz,
      title: generatedTitle,
      folderId,
      topic,
      classLevel,
      questions: validQuestions
    });
  };`;

const handleSaveNew = `  const handleSave = () => {
    const validQuestions = questions.filter(q => q.text.trim());
    if(validQuestions.length === 0) {
      setErrorMsg("Please add at least one complete question.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setShowPublishModal(true);
  };

  const confirmSave = (isPublic: boolean) => {
    const generatedTitle = "Bubble Pop Game";
    const validQuestions = questions.filter(q => q.text.trim());
    onSave({
      ...quiz,
      title: generatedTitle,
      folderId,
      topic,
      classLevel,
      questions: validQuestions,
      isPublic
    });
    setShowPublishModal(false);
  };`;

code = code.replace(handleSaveTarget, handleSaveNew);
fs.writeFileSync('src/views/BubblePop.tsx', code);
