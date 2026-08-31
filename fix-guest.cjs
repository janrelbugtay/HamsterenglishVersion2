const fs = require('fs');
let code = fs.readFileSync('src/views/AdminDashboard.tsx', 'utf8');

code = code.replace(
  'const registeredUsersList = users.filter((u: any) => !u.isAnonymous);',
  'const registeredUsersList = users.filter((u: any) => u.isAnonymous !== true && u.email !== "User");'
);

code = code.replace(
  'const registeredUsers = registeredUsersList.length; console.log("USERS:", users);',
  'const registeredUsers = registeredUsersList.length;'
);

code = code.replace(
  'const guestUsersList = users.filter((u: any) => u.isAnonymous);',
  'const guestUsersList = users.filter((u: any) => u.isAnonymous === true || u.email === "User");'
);

// Also in UsersManagement
code = code.replace(
  '{user.isAnonymous && (',
  '{(user.isAnonymous || user.email === "User") && ('
);

fs.writeFileSync('src/views/AdminDashboard.tsx', code);
