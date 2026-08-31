const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const regex = /function parsePastedQuiz[\s\S]*?(?=^$|^\})[\s\S]*?\}/m;

const replacement = `function parsePastedQuiz(rawText: string): Partial<Question>[] {
  if (!rawText || !rawText.trim()) return [];
  const items: Partial<Question>[] = [];
  
  if (rawText.includes('\\t')) {
    const lines = rawText.split(/\\r?\\n/).filter(line => line.trim());
    lines.forEach(line => {
      const parts = line.split('\\t').map(p => p.trim());
      if (parts.length > 0) {
        items.push({
          text: parts[0],
          options: [
            parts[1] || "",
            parts[2] || "",
            parts[3] || "",
            parts[4] || ""
          ],
          answerIndex: 0
        });
      }
    });
    if (items.length > 0) return items;
  }
  
  const lines = rawText.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
  let currentQ: Partial<Question> | null = null;
  const optionRegex = /^([a-eA-E1-4])[\\.\\)\\:\\-]\\s+(.*)/;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    let inlineAnswerMatch = line.match(/\\banswer\\s*[:=]?\\s*([a-eA-E1-4])\\b/i);
    let inlineAnswerIndex = -1;
    if (inlineAnswerMatch) {
       const val = inlineAnswerMatch[1].toUpperCase();
       if (/[A-E]/.test(val)) inlineAnswerIndex = val.charCodeAt(0) - 65;
       else if (/[1-4]/.test(val)) inlineAnswerIndex = parseInt(val) - 1;
       line = line.replace(inlineAnswerMatch[0], '').trim();
    }
    
    const ansMatch = line.match(/^answer\\s*[:=]?\\s*([a-eA-E1-4])/i);
    if (ansMatch || line === '') {
       if (currentQ && (ansMatch || inlineAnswerIndex !== -1)) {
          const val = ansMatch ? ansMatch[1].toUpperCase() : inlineAnswerMatch![1].toUpperCase();
          if (/[A-E]/.test(val)) currentQ.answerIndex = val.charCodeAt(0) - 65;
          else if (/[1-4]/.test(val)) currentQ.answerIndex = parseInt(val) - 1;
       }
       continue;
    }
    
    const optMatch = line.match(optionRegex);
    if (optMatch) {
       if (!currentQ) {
          currentQ = { text: "Question", options: ["", "", "", ""], answerIndex: 0 };
          items.push(currentQ);
       }
       
       const optText = optMatch[2].trim();
       const prefix = optMatch[1].toUpperCase();
       let expectedIndex = -1;
       if (/[A-E]/.test(prefix)) expectedIndex = prefix.charCodeAt(0) - 65;
       else if (/[1-4]/.test(prefix)) expectedIndex = parseInt(prefix) - 1;
       
       if (expectedIndex >= 0 && expectedIndex < 4) {
           currentQ.options![expectedIndex] = optText;
       } else {
           const emptyIdx = currentQ.options!.findIndex(o => o === "");
           if (emptyIdx !== -1) currentQ.options![emptyIdx] = optText;
       }
       
       if (inlineAnswerIndex !== -1) {
           currentQ.answerIndex = inlineAnswerIndex;
       }
    } else {
       const hasOptions = currentQ && currentQ.options!.some(o => o !== "");
       const qText = line.replace(/^(?:\\d+[\\.\\)\\:\\-]|\\[\\d+\\])\\s+/, "");
       
       if (!currentQ || hasOptions) {
           currentQ = { text: qText, options: ["", "", "", ""], answerIndex: 0 };
           items.push(currentQ);
           if (inlineAnswerIndex !== -1) {
               currentQ.answerIndex = inlineAnswerIndex;
           }
       } else {
           currentQ.text += " " + qText;
           if (inlineAnswerIndex !== -1) {
               currentQ.answerIndex = inlineAnswerIndex;
           }
       }
    }
  }

  const allEmptyOptions = items.every(q => q.options!.every(o => o === ""));
  if (allEmptyOptions && items.length > 0) {
     return items; 
  }

  return items;
}`;

// I need to carefully replace the old parsePastedQuiz
// It's at the very end of the file.

const parts = content.split('function parsePastedQuiz(rawText: string): Partial<Question>[] {');

if (parts.length === 2) {
    fs.writeFileSync('src/views/BubblePop.tsx', parts[0] + replacement + '\n');
    console.log("Success");
} else {
    console.log("Failed to split");
}
