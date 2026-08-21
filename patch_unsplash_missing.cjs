const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const oldCode = `      const apiKey = process.env.UNSPLASH_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "UNSPLASH_API_KEY is not set. Please add it to your environment variables." });
      }`;

const newCode = `      let apiKey = process.env.UNSPLASH_API_KEY;
      
      // Fallback if key is missing or is just the placeholder text
      if (!apiKey || apiKey === 'UNSPLASH_API_KEY') {
        apiKey = 'INVALID_KEY'; // Force it to fail with 401 so the fallback triggers
      }`;

file = file.replace(oldCode, newCode);
fs.writeFileSync('server.ts', file);
