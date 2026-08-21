const fs = require('fs');
let file = fs.readFileSync('src/components/MediaPickerModal.tsx', 'utf8');

// Replace 'link' with 'photos' in types and state
file = file.replace(/type Tab = 'giphy' \| 'upload' \| 'link';/g, "type Tab = 'giphy' | 'upload' | 'photos';");
file = file.replace(/setActiveTab\('link'\)/g, "setActiveTab('photos')");
file = file.replace(/activeTab === 'link'/g, "activeTab === 'photos'");

// Update tab button
const oldTabBtn = `<button 
            onClick={() => { setActiveTab('link'); setError(''); }}
            className={\`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 \${activeTab === 'link' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
          >
            <LinkIcon size={16} /> Web Link
          </button>`;
const newTabBtn = `<button 
            onClick={() => { setActiveTab('photos'); setError(''); }}
            className={\`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 \${activeTab === 'photos' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
          >
            <ImageIcon size={16} /> Photos
          </button>`;
file = file.replace(oldTabBtn, newTabBtn);

// Update content area
const oldContent = `{activeTab === 'link' && (
            <div className="h-[250px] flex flex-col items-center justify-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
                <LinkIcon size={28} />
              </div>
              <form onSubmit={handleLinkSubmit} className="w-full">
                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Paste Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}`;

const newContent = `{activeTab === 'photos' && (
            <div className="h-[250px] flex flex-col items-center justify-center max-w-md mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <ImageIcon size={28} />
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Find free, high-quality photos on <a href="https://unsplash.com/s/photos" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold">Unsplash</a>. <br/>Right-click the image, select "Copy image address", and paste it below.
              </p>
              <form onSubmit={handleLinkSubmit} className="w-full">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Paste image address here..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}`;
file = file.replace(oldContent, newContent);

fs.writeFileSync('src/components/MediaPickerModal.tsx', file);
