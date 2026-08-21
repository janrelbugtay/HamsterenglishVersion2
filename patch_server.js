const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');
const newEndpoint = `
  app.post("/api/generate-hamster-questions", async (req, res) => {
    try {
      const { topic, level, types, freq, videoUrl, videoDuration } = req.body;
      if (!topic || !level || !types) return res.status(400).json({ error: "Missing parameters" });

      const prompt = \`You are an expert ESL teacher creating an interactive pop quiz for a video.
Topic: "\${topic}"
Proficiency Level: Cambridge \${level}
Video URL: \${videoUrl || "Unknown"}
Requested Question Types: \${types.join(', ')}
Frequency: \${freq}

Generate exactly 4 engaging quiz questions based on the topic "\${topic}". 
Make the questions relevant to a hypothetical video about this topic.
Spread the timeTrigger (in seconds) out reasonably between 10 and 120 seconds. 

Respond ONLY with a valid JSON array of exactly 4 objects. Do not wrap in markdown tags.
Format each object like this based on its type:

For 'Multiple Choice':
{
  "id": 1,
  "timeTrigger": 15,
  "type": "Multiple Choice",
  "xp": 100,
  "question": "Question text here?",
  "options": [
    { "text": "Correct Option", "isCorrect": true },
    { "text": "Wrong Option 1", "isCorrect": false },
    { "text": "Wrong Option 2", "isCorrect": false },
    { "text": "Wrong Option 3", "isCorrect": false }
  ],
  "explanation": "Brief explanation of why it is correct."
}

For 'Vocabulary Meaning':
{
  "id": 2,
  "timeTrigger": 30,
  "type": "Vocabulary Meaning",
  "xp": 150,
  "word": "VOCABWORD",
  "pronunciation": "/vocab/",
  "question": "What does 'VOCABWORD' mean here?",
  "options": [
    { "text": "Correct meaning", "isCorrect": true },
    { "text": "Wrong meaning 1", "isCorrect": false },
    { "text": "Wrong meaning 2", "isCorrect": false },
    { "text": "Wrong meaning 3", "isCorrect": false }
  ],
  "explanation": "Brief explanation."
}

For 'Grammar Choice':
{
  "id": 3,
  "timeTrigger": 45,
  "type": "Grammar Choice",
  "xp": 100,
  "question": "Which sentence is grammatically correct?",
  "options": [
    { "text": "Correct sentence", "isCorrect": true },
    { "text": "Wrong sentence 1", "isCorrect": false },
    { "text": "Wrong sentence 2", "isCorrect": false },
    { "text": "Wrong sentence 3", "isCorrect": false }
  ],
  "explanation": "Brief explanation."
}

Ensure the array contains a mix of the requested types: \${types.join(', ')}.
Return exactly a JSON array of 4 objects.\`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      let text = response.text?.trim() || "";
      let questions = JSON.parse(text);

      res.json({ questions });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
`;

file = file.replace('// Giphy Search Endpoint', newEndpoint + '\n  // Giphy Search Endpoint');
fs.writeFileSync('server.ts', file);
