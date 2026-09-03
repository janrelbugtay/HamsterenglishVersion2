const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf-8');

const oldRenderBlock = `{(() => {
                                                  const activePoseValue = activePoses[index % activePoses.length] || AVAILABLE_POSES[0].value;
                                                  const poseObj = AVAILABLE_POSES.find(p => p.value === activePoseValue) || { type: 'emoji', value: activePoseValue };
                                                  
                                                  if (poseObj.type === 'image') {
                                                      return <img src={poseObj.value} alt="Pose" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />;
                                                  } else {
                                                      return <span className={\`\${optionEmojiClass} drop-shadow-sm leading-none\`}>{poseObj.value}</span>;
                                                  }
                                              })()}`;

const newRenderBlock = `{(() => {
                                                  const safePoses = [...activePoses];
                                                  for (const p of AVAILABLE_POSES) {
                                                      if (safePoses.length >= 10) break;
                                                      if (!safePoses.includes(p.value)) safePoses.push(p.value);
                                                  }
                                                  const activePoseValue = safePoses[index] || AVAILABLE_POSES[0].value;
                                                  const poseObj = AVAILABLE_POSES.find(p => p.value === activePoseValue) || { type: 'emoji', value: activePoseValue };
                                                  
                                                  if (poseObj.type === 'image') {
                                                      return <img src={poseObj.value} alt="Pose" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />;
                                                  } else {
                                                      return <span className={\`\${optionEmojiClass} drop-shadow-sm leading-none\`}>{poseObj.value}</span>;
                                                  }
                                              })()}`;

if (content.includes(oldRenderBlock)) {
    content = content.replace(oldRenderBlock, newRenderBlock);
    fs.writeFileSync('src/views/YogaQuiz.tsx', content);
    console.log("Fixed rendering block!");
} else {
    console.log("Could not find the exact render block.");
}
