const fs = require('fs');
let file = fs.readFileSync('src/components/MediaPickerModal.tsx', 'utf8');

file = file.replace(
  "const searchGiphy = async (e: React.FormEvent) => {",
  `const searchUnsplash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch(\`/api/unsplash-search?q=\${encodeURIComponent(query)}\`);
      if (!res.ok) {
        throw new Error("Failed to fetch photos. API might be rate limited.");
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch photos");
    } finally {
      setIsLoading(false);
    }
  };

  const searchGiphy = async (e: React.FormEvent) => {`
);

const oldPhotosTab = `{activeTab === 'photos' && (
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

const newPhotosTab = `{activeTab === 'photos' && (
            <div className="flex flex-col h-full">
              <form onSubmit={searchUnsplash} className="relative mb-4 shrink-0">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Unsplash photos..."
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium"
                  autoFocus
                />
                <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <button 
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-2 top-2 bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              <div className="flex-1 min-h-[250px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-8">{error}</div>
                ) : results.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {results.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => onSelect(photo.urls.regular)}
                        className="relative group rounded-xl overflow-hidden aspect-square border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer bg-slate-200 dark:bg-slate-800"
                      >
                        <img 
                          src={photo.urls.small} 
                          alt={photo.alt_description || "Photo"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold px-2 py-1 bg-blue-500 rounded-lg">Select</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query ? (
                   <div className="text-slate-500 text-center py-8">No photos found for "{query}"</div>
                ) : (
                  <div className="text-slate-500 text-center py-8 flex flex-col items-center justify-center h-full gap-2">
                     <Search size={32} className="text-slate-300 dark:text-slate-600" />
                     <p>Search to find the perfect photo!</p>
                     <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-blue-500 flex items-center mt-4">
                       Powered By Unsplash
                     </a>
                  </div>
                )}
              </div>
            </div>
          )}`;

file = file.replace(oldPhotosTab, newPhotosTab);
fs.writeFileSync('src/components/MediaPickerModal.tsx', file);
