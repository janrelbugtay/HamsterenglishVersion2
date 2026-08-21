const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const oldCode = `      if (!response.ok) {
        throw new Error(\`Unsplash API error: \${response.statusText}\`);
      }`;

const newCode = `      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid Unsplash API Key. Please make sure you copied the 'Access Key' from your Unsplash dashboard (not the Secret Key).");
        }
        throw new Error(\`Unsplash API error: \${response.statusText}\`);
      }`;

file = file.replace(oldCode, newCode);
fs.writeFileSync('server.ts', file);
