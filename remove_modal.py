import re

with open('src/views/YogaQuiz.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'\{activePoseSettingsIndex !== null && \(.*?\)\s*\}\s*(?=<AnimatePresence>)', re.DOTALL)
content = pattern.sub('', content)

with open('src/views/YogaQuiz.tsx', 'w') as f:
    f.write(content)
print("Removed modal")
