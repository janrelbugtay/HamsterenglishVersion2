const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// Ensure voices are loaded by the browser since speech synthesis voices are loaded asynchronously
const initVoicesTarget = `useEffect(() => {
    if (user) {
      fetchFolders();
    }
  }, [user]);`;

const initVoicesReplacement = `${initVoicesTarget}

  // Load voices asynchronously
  useEffect(() => {
      const loadVoices = () => {
          window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = loadVoices;
      }
  }, []);`;

content = content.replace(initVoicesTarget, initVoicesReplacement);

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Added voice loading init.");
