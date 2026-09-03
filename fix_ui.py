import re

with open('src/views/YogaQuiz.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'<div>\s*<label className="block text-teal-700 font-bold mb-4 text-2xl">Custom Poses \(1-6\).*?</div>\s*</div>', re.DOTALL)

new_ui = """<div>
                              <label className="block text-teal-700 font-bold mb-4 text-2xl">Active Poses</label>
                              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-4">
                                  {AVAILABLE_POSES.map((pose, i) => {
                                      const isSelected = activePoses.includes(pose.value);
                                      return (
                                          <button 
                                              key={i}
                                              onClick={() => togglePose(pose.value)}
                                              className={`aspect-square rounded-2xl flex items-center justify-center border-4 transition-all relative overflow-hidden ${isSelected ? 'border-teal-500 bg-teal-100 scale-105 shadow-md' : 'border-slate-200 bg-slate-50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
                                          >
                                              {pose.type === 'emoji' ? (
                                                  <span className="text-4xl drop-shadow-sm">{pose.value}</span>
                                              ) : (
                                                  <img src={pose.value} alt="Pose" className="w-full h-full object-cover rounded-xl" />
                                              )}
                                              {isSelected && (
                                                  <div className="absolute top-1 right-1 bg-teal-500 text-white rounded-full p-0.5">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                  </div>
                                              )}
                                          </button>
                                      );
                                  })}
                              </div>
                          </div>"""

content, count = pattern.subn(new_ui, content, count=1)

if count > 0:
    print("Replaced settings UI successfully")
else:
    print("Failed to replace settings UI")

with open('src/views/YogaQuiz.tsx', 'w') as f:
    f.write(content)
