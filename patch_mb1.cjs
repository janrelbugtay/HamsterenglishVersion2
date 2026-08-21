const fs = require('fs');
let content = fs.readFileSync('public/mystery-box.html', 'utf-8');

const funcs = `      const handleDecision = (choiceTargetIdx) => {`;
const newFuncs = `      const openMediaPicker = (qIdx, oIdx) => {
        window.parent.postMessage({ type: "OPEN_MEDIA_PICKER", data: { qIdx, oIdx } }, "*");
      };
      
      const removeOptionImage = (qIdx, oIdx) => {
        if (customQuestions[qIdx].optionImages) {
          customQuestions[qIdx].optionImages[oIdx] = null;
          renderApp();
        }
      };

      const handleDecision = (choiceTargetIdx) => {`;
content = content.replace(funcs, newFuncs);

const listener = `window.addEventListener("message", (event) => {`;
const newListener = `window.addEventListener("message", (event) => {
        if (event.data?.type === "MEDIA_PICKED") {
          const { qIdx, oIdx, url } = event.data.data;
          if (!customQuestions[qIdx].optionImages) {
            customQuestions[qIdx].optionImages = [null, null, null, null];
          }
          customQuestions[qIdx].optionImages[oIdx] = url;
          renderApp();
          return;
        }`;
content = content.replace(listener, newListener);

fs.writeFileSync('public/mystery-box.html', content);
