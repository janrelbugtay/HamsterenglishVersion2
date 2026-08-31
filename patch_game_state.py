import re

with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

# Target string
orig_block = """    gameState.current = {
        isActive: true,
        numPlayers: players,
        scores: [0, 0],
        currentQuestionIndex: 0,
        combo: 0,
        maxCombo: 0,
        correctPops: 0,
        wrongPops: 0,
        questionStartTime: 0,
        questions: activeQuiz ? [...activeQuiz.questions].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, activeQuiz.questions.length)) : []
    };"""

new_block = """    gameState.current = {
        isActive: true,
        numPlayers: players,
        scores: [0, 0],
        currentQuestionIndex: 0,
        combo: 0,
        maxCombo: 0,
        correctPops: 0,
        wrongPops: 0,
        questionStartTime: 0,
        questions: activeQuiz ? [...activeQuiz.questions].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, activeQuiz.questions.length)) : [],
        speed: speed,
        size: bubbleSize,
        twist: twistEnabled
    };"""

if orig_block in content:
    content = content.replace(orig_block, new_block)
    with open('src/views/BubblePop.tsx', 'w') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Original block not found!")
