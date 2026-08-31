const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
  'const [cameraError, setCameraError] = useState("");',
  'const [cameraError, setCameraError] = useState("");\n  const [isCameraActive, setIsCameraActive] = useState(false);'
);

code = code.replace(
  'await camera.start();',
  'await camera.start();\n                setIsCameraActive(true);'
);

code = code.replace(
  '<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#dbeafe,#f8fafc)] dark:bg-[radial-gradient(circle_at_50%_100%,#1e3a8a,#0f172a)] -z-10 pointer-events-none"></div>',
  '{!isCameraActive && <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#dbeafe,#f8fafc)] dark:bg-[radial-gradient(circle_at_50%_100%,#1e3a8a,#0f172a)] -z-10 pointer-events-none"></div>}'
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
