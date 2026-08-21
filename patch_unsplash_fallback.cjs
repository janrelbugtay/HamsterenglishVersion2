const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const oldCode = `      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid Unsplash API Key. Please make sure you copied the 'Access Key' from your Unsplash dashboard (not the Secret Key).");
        }
        throw new Error(\`Unsplash API error: \${response.statusText}\`);
      }
      
      const data = await response.json();
      res.json(data);`;

const newCode = `      if (!response.ok) {
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
      res.json(data);`;

file = file.replace(oldCode, newCode);
fs.writeFileSync('server.ts', file);
