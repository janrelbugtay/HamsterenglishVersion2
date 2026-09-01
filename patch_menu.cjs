const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

code = code.replace(/  useEffect\(\(\) => \{\n    const handleClickOutside = \(\) => setOpenMenuId\(null\);\n    document\.addEventListener\("click", handleClickOutside\);\n    return \(\) => document\.removeEventListener\("click", handleClickOutside\);\n  \}, \[\]\);\n/g, '');

fs.writeFileSync('src/views/GamesLibrary.tsx', code);
