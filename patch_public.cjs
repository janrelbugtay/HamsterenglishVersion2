const fs = require('fs');
let code = fs.readFileSync('src/views/PublicDashboard.tsx', 'utf8');

if (!code.includes('GameThumbnail')) {
    code = code.replace('import { ViewState } from "../types";', 'import { ViewState } from "../types";\nimport { GameThumbnail } from "../components/GameThumbnail";');
}

code = code.replace(
    /\{info\.icon && \(info\.icon\.startsWith\("http"\) \|\| info\.icon\.startsWith\("\/"\)\) \? \([\s\S]*?\) : \([\s\S]*?\)\}/,
    '<GameThumbnail gameType={game.gameType} info={info} />'
);

fs.writeFileSync('src/views/PublicDashboard.tsx', code);
console.log("Patched PublicDashboard");
