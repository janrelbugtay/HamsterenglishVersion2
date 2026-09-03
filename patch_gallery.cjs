const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// 1. Add galleryPoses state
const stateHook = `const [poseImages, setPoseImages] = useState<string[]>(() => {`;
const newStates = `const [galleryPoses, setGalleryPoses] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('yogaGalleryPoses');
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552286450-37604ce41539?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1588286840104-a4b5ff54c4c1?q=80&w=400&auto=format&fit=crop"
        ];
    });
    const [newPoseUrl, setNewPoseUrl] = useState("");

    useEffect(() => {
        localStorage.setItem('yogaGalleryPoses', JSON.stringify(galleryPoses));
    }, [galleryPoses]);

    const [poseImages, setPoseImages] = useState<string[]>(() => {`;
content = content.replace(stateHook, newStates);

// 2. Replace the MediaPickerModal with an inline Gallery Modal
const oldModal = `<MediaPickerModal 
              isOpen={activePoseSettingsIndex !== null}
              onClose={() => setActivePoseSettingsIndex(null)}
              onSelect={(url) => {
                  if (activePoseSettingsIndex !== null) {
                      const newPoses = [...poseImages];
                      newPoses[activePoseSettingsIndex] = url;
                      setPoseImages(newPoses);
                      setActivePoseSettingsIndex(null);
                  }
              }}
          />`;

const newModal = `{activePoseSettingsIndex !== null && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-teal-900/60 backdrop-blur-sm p-4 animate-fade-in">
                  <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-3xl w-full shadow-2xl relative border-8 border-teal-100 max-h-[90vh] flex flex-col">
                      <button onClick={() => setActivePoseSettingsIndex(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                          <X size={32} strokeWidth={3} />
                      </button>
                      <h2 className="text-3xl font-black text-teal-800 mb-6">Select a Pose</h2>
                      
                      <div className="flex gap-2 mb-6 shrink-0">
                          <input 
                              type="text" 
                              value={newPoseUrl}
                              onChange={(e) => setNewPoseUrl(e.target.value)}
                              placeholder="Paste image link here..." 
                              className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 font-medium"
                          />
                          <button 
                              onClick={() => {
                                  if (newPoseUrl.trim()) {
                                      setGalleryPoses([newPoseUrl.trim(), ...galleryPoses]);
                                      setNewPoseUrl("");
                                  }
                              }}
                              className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 rounded-xl transition-colors"
                          >
                              Add Link
                          </button>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                              {galleryPoses.map((url, idx) => (
                                  <button
                                      key={idx}
                                      onClick={() => {
                                          const newPoses = [...poseImages];
                                          newPoses[activePoseSettingsIndex] = url;
                                          setPoseImages(newPoses);
                                          setActivePoseSettingsIndex(null);
                                      }}
                                      className="aspect-square rounded-xl overflow-hidden border-4 border-transparent hover:border-teal-500 hover:scale-105 transition-all relative group"
                                  >
                                      <img src={url} alt="Pose option" className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-teal-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">Select</span>
                                      </div>
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          )}`;

content = content.replace(oldModal, newModal);
fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Patched successfully");
