const fs = require('fs');
let file = fs.readFileSync('src/components/MediaPickerModal.tsx', 'utf8');

file = file.replace(/searchUnsplash/g, 'searchPhotos');
file = file.replace(/\/api\/unsplash-search/g, '/api/photo-search');
file = file.replace(/Search Unsplash photos\.\.\./g, 'Search Wikimedia photos...');
file = file.replace(/https:\/\/unsplash.com/g, 'https://commons.wikimedia.org');
file = file.replace(/Powered By Unsplash/g, 'Powered By Wikimedia Commons');

fs.writeFileSync('src/components/MediaPickerModal.tsx', file);
