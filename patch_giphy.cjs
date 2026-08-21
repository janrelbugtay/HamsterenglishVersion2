const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

file = file.replace(
  "const apiKey = process.env.GIPHY_API_KEY || 'dc6zaTOxFJmzC';",
  "const apiKey = process.env.GIPHY_API_KEY || 'GlVGYHqc3SyCEGnmOtcVprG5R7pUS0Fw';"
);

fs.writeFileSync('server.ts', file);
