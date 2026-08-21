const fs = require('fs');
let content = fs.readFileSync('public/mystery-box.html', 'utf-8');

const oldSetup = `                    <input 
                      type="text" 
                      value="\${opt.replace(/"/g, "&quot;")}" 
                      oninput="customQuestions[\${idx}].options[\${oIdx}] = this.value" 
                      class="flex-1 bg-transparent outline-none font-medium text-slate-700" 
                      placeholder="Option \${String.fromCharCode(65 + oIdx)}"
                    />
                  </div>`;

const newSetup = `                    <div class="flex-1 flex gap-2 items-center relative">
                      <input 
                        type="text" 
                        value="\${opt.replace(/"/g, "&quot;")}" 
                        oninput="customQuestions[\${idx}].options[\${oIdx}] = this.value" 
                        class="flex-1 bg-transparent outline-none font-medium text-slate-700" 
                        placeholder="Option \${String.fromCharCode(65 + oIdx)}"
                      />
                      \${q.optionImages && q.optionImages[oIdx] ? \`
                        <div class="relative w-8 h-8 rounded shrink-0 overflow-hidden group">
                          <img src="\${q.optionImages[oIdx]}" class="w-full h-full object-cover" />
                          <button onclick="removeOptionImage(\${idx}, \${oIdx})" class="absolute inset-0 bg-black/50 text-white hidden group-hover:flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                          </button>
                        </div>
                      \` : ''}
                      <button onclick="openMediaPicker(\${idx}, \${oIdx})" class="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-blue-500 transition-colors shrink-0" title="Add Image">
                        <i data-lucide="image" class="w-5 h-5"></i>
                      </button>
                    </div>
                  </div>`;

content = content.replace(oldSetup, newSetup);
fs.writeFileSync('public/mystery-box.html', content);
