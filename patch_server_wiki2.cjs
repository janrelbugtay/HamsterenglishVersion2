const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const oldCode = `      const query = req.query.q;
      if (!query) return res.status(400).json({ error: "Query is required" });
      
      const response = await fetch(\`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=\${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*\`);`;

const newCode = `      const query = req.query.q as string;
      if (!query) return res.status(400).json({ error: "Query is required" });
      
      // Make the search more accurate by enforcing image filetypes and requiring the term in the title
      const wikiQuery = \`intitle:\${query} filetype:bitmap\`;
      const response = await fetch(\`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=\${encodeURIComponent(wikiQuery)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*\`);`;

file = file.replace(oldCode, newCode);
fs.writeFileSync('server.ts', file);
