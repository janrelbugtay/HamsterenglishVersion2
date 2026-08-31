const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /            <h2 className="text-3xl font-bold mb-2 z-10 text-slate-800 dark:text-white">Loading Camera & AI\.\.\.<\/h2>\n            <p className="text-slate-400 mb-8 z-10">Please grant camera permissions\.<\/p>\n            <div className="loading-bar-container z-10">\n                <div className="loading-bar-fill animate-\[pulse_2s_infinite\]" style=\{\{ width: '100%' \}\}><\/div>\n            <\/div>/,
    `            <h2 className="text-3xl font-bold mb-2 z-10 text-slate-800 dark:text-white">Loading Camera & AI...</h2>
            {cameraError ? (
                <div className="flex flex-col items-center z-10 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-lg text-center">
                    <p className="text-red-500 font-bold mb-2 text-xl">Camera Error</p>
                    <p className="text-red-400 mb-6">{cameraError}</p>
                    <button onClick={() => {
                        if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
                        setScreen('setup');
                    }} className="px-6 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-colors">
                        Back to Setup
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-slate-400 mb-8 z-10">Please grant camera permissions.</p>
                    <div className="loading-bar-container z-10">
                        <div className="loading-bar-fill animate-[pulse_2s_infinite]" style={{ width: '100%' }}></div>
                    </div>
                </>
            )}`
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
