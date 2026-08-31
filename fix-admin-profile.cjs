const fs = require('fs');
let code = fs.readFileSync('src/views/AdminDashboard.tsx', 'utf8');

code = code.replace(
  '<p className="text-sm font-bold text-slate-700 dark:text-slate-200">Teacher Jan</p>',
  '<p className="text-sm font-bold text-slate-700 dark:text-slate-200">{currentUser?.displayName || "Admin"}</p>'
);

code = code.replace(
  '<Avatar src={currentUser?.photoURL || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" />',
  '<Avatar src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || "Admin")}`} alt="Admin" />'
);

fs.writeFileSync('src/views/AdminDashboard.tsx', code);
