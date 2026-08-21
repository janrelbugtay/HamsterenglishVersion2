const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const oldEndpoint = `  // Unsplash Search Endpoint
  app.get("/api/unsplash-search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) return res.status(400).json({ error: "Query is required" });
      
      let apiKey = process.env.UNSPLASH_API_KEY;
      
      // Fallback if key is missing or is just the placeholder text
      if (!apiKey || apiKey === 'UNSPLASH_API_KEY') {
        apiKey = 'INVALID_KEY'; // Force it to fail with 401 so the fallback triggers
      }

      const response = await fetch(\`https://api.unsplash.com/search/photos?query=\${encodeURIComponent(query)}&per_page=20\`, {
        headers: {
          'Authorization': \`Client-ID \${apiKey}\`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Fallback to static images if the API key is invalid or not set correctly
          return res.json({
            results: [
              { id: '1', alt_description: 'Cute hamster', urls: { regular: 'https://images.unsplash.com/photo-1425082661705-1834bfd08d98?q=80&w=800&auto=format&fit=crop', small: 'https://images.unsplash.com/photo-1425082661705-1834bfd08d98?q=80&w=400&auto=format&fit=crop' } },
              { id: '2', alt_description: 'Golden retriever', urls: { regular: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop', small: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400&auto=format&fit=crop' } },
              { id: '3', alt_description: 'Cat', urls: { regular: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop', small: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop' } },
              { id: '4', alt_description: 'Nature forest', urls: { regular: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop', small: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop' } },
              { id: '5', alt_description: 'Ocean waves', urls: { regular: 'https://images.unsplash.com/photo-1495444760458-941199a099a4?q=80&w=800&auto=format&fit=crop', small: 'https://images.unsplash.com/photo-1495444760458-941199a099a4?q=80&w=400&auto=format&fit=crop' } },
              { id: '6', alt_description: 'City landscape', urls: { regular: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop', small: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=400&auto=format&fit=crop' } },
              { id: '7', alt_description: 'School', urls: { regular: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop', small: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop' } },
              { id: '8', alt_description: 'Happy kids', urls: { regular: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop', small: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=400&auto=format&fit=crop' } }
            ]
          });
        }
        throw new Error(\`Unsplash API error: \${response.statusText}\`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error("Unsplash error:", err);
      res.status(500).json({ error: err.message });
    }
  });`;

const newEndpoint = `  // Photo Search Endpoint (Wikimedia Commons API - Free & No Auth)
  app.get("/api/photo-search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) return res.status(400).json({ error: "Query is required" });
      
      const response = await fetch(\`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=\${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*\`);
      
      if (!response.ok) {
        throw new Error(\`Wikimedia API error: \${response.statusText}\`);
      }
      
      const data = await response.json();
      
      if (!data.query || !data.query.pages) {
        return res.json({ results: [] });
      }
      
      const pages = Object.values(data.query.pages);
      const results = pages.map((page: any) => ({
        id: page.pageid || page.title,
        alt_description: page.title.replace('File:', '').replace(/\\.[^/.]+$/, "").replace(/_/g, ' '),
        urls: {
          regular: page.imageinfo?.[0]?.url || '',
          small: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url || ''
        }
      })).filter((r: any) => r.urls.regular);
      
      res.json({ results });
    } catch (err: any) {
      console.error("Photo search error:", err);
      res.status(500).json({ error: err.message });
    }
  });`;

file = file.replace(oldEndpoint, newEndpoint);
fs.writeFileSync('server.ts', file);
