const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
  // Unsplash Search Endpoint
  app.get("/api/unsplash-search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) return res.status(400).json({ error: "Query is required" });
      
      const apiKey = process.env.UNSPLASH_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "UNSPLASH_API_KEY is not set. Please add it to your environment variables." });
      }

      const response = await fetch(\`https://api.unsplash.com/search/photos?query=\${encodeURIComponent(query)}&per_page=20\`, {
        headers: {
          'Authorization': \`Client-ID \${apiKey}\`
        }
      });
      
      if (!response.ok) {
        throw new Error(\`Unsplash API error: \${response.statusText}\`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error("Unsplash error:", err);
      res.status(500).json({ error: err.message });
    }
  });
`;

file = file.replace('  // Vite middleware for development', newEndpoint + '\n  // Vite middleware for development');
fs.writeFileSync('server.ts', file);
