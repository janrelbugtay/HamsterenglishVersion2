const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

file = file.replace(
  "const apiKey = process.env.GIPHY_API_KEY || 'GlVGYHqc3SyCEGnmOtcVprG5R7pUS0Fw';",
  "const apiKey = process.env.GIPHY_API_KEY || 'CdRKiCMbTnt9CkZTZ0lGukSczk6iT4Z6';"
);

fs.writeFileSync('server.ts', file);
