const fs = require('fs');
let file = fs.readFileSync('src/views/HamsterPopQuiz.tsx', 'utf8');
file = file.replace(/const handleSubmit = \(e: any\) => \{\n    e\.preventDefault\(\);\n    if \(videoUrl\) navigateTo\('loading'\);\n  \};/, `const handleSubmit = (e: any) => {
    e.preventDefault();
    if (videoUrl) {
      let finalUrl = videoUrl.trim();
      if (!/^https?:\\/\\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      setVideoUrl(finalUrl);
      navigateTo('loading');
    }
  };`);
fs.writeFileSync('src/views/HamsterPopQuiz.tsx', file);
