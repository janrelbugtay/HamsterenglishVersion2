import re

with open('src/views/YogaQuiz.tsx', 'r') as f:
    content = f.read()

# The modal starts at `{activePoseSettingsIndex !== null && (`
# I will just use a regex to match from `{activePoseSettingsIndex !== null && (` to `)}` before `<div className={\`bg-white`

pattern = re.compile(r'\{activePoseSettingsIndex !== null && \([\s\S]*?\n\s*\)\}', re.DOTALL)
content = pattern.sub('', content)

with open('src/views/YogaQuiz.tsx', 'w') as f:
    f.write(content)
print("Fixed modal")
