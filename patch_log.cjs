const fs = require('fs');
let code = fs.readFileSync('src/views/AdminDashboard.tsx', 'utf8');
code = code.replace(
  'const registeredUsers = registeredUsersList.length;',
  'const registeredUsers = registeredUsersList.length; console.log("USERS:", users);'
);
fs.writeFileSync('src/views/AdminDashboard.tsx', code);
