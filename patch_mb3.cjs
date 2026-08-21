const fs = require('fs');
let content = fs.readFileSync('public/mystery-box.html', 'utf-8');

const oldMcq = `                    return \`
                    <button 
                      onclick="handleOptionSelect(\${i})"
                      \${isAnswerRevealed ? "disabled" : ""}
                      class="p-6 md:p-8 rounded-3xl text-3xl md:text-5xl lg:text-6xl font-bold border-[4px] transition-all flex items-center text-left w-full \${optionStyle}"
                    >
                      <span class="mr-4 md:mr-6 opacity-50">\${String.fromCharCode(65 + i)}.</span> 
                      \${opt}
                    </button>
                  \`;`;

const newMcq = `                    const imgHtml = activeBox.optionImages && activeBox.optionImages[i] ? \`<div class="w-24 h-24 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0 ml-4"><img src="\${activeBox.optionImages[i]}" class="w-full h-full object-cover shadow-md border-4 border-white/50" /></div>\` : '';
                    return \`
                    <button 
                      onclick="handleOptionSelect(\${i})"
                      \${isAnswerRevealed ? "disabled" : ""}
                      class="p-6 md:p-8 rounded-3xl text-3xl md:text-5xl lg:text-6xl font-bold border-[4px] transition-all flex flex-col sm:flex-row items-center sm:items-start text-left w-full gap-4 \${optionStyle}"
                    >
                      <div class="flex items-center flex-1 w-full">
                        <span class="mr-4 md:mr-6 opacity-50 shrink-0">\${String.fromCharCode(65 + i)}.</span> 
                        <span class="flex-1 break-words">\${opt}</span>
                      </div>
                      \${imgHtml}
                    </button>
                  \`;`;

content = content.replace(oldMcq, newMcq);
fs.writeFileSync('public/mystery-box.html', content);
