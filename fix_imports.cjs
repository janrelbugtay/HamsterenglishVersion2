const fs = require('fs');

let yoga = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

yoga = yoga.replace(
    "import { ChevronLeft, Plus, Edit3, Trash2, Play, Search, Sparkles, Save, X, BookOpen, Clock, Heart, ArrowLeft, Download, Maximize, Minimize } from 'lucide-react';",
    "import { ChevronLeft, Plus, Edit3, Trash2, Play, Search, Sparkles, Save, X, BookOpen, Clock, Heart, ArrowLeft, Download, Maximize, Minimize, ClipboardList, Info, Copy, Image as ImageIcon } from 'lucide-react';"
);

yoga = yoga.replace(
    'import { FullscreenButton } from "../components/FullscreenButton";',
    'import { FullscreenButton } from "../components/FullscreenButton";\nimport { MediaPickerModal } from "../components/MediaPickerModal";'
);

fs.writeFileSync('src/views/YogaQuiz.tsx', yoga);
console.log('Fixed imports');
