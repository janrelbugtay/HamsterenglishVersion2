const fs = require('fs');
let file = fs.readFileSync('src/components/MediaPickerModal.tsx', 'utf8');

// Fix searchUnsplash error handling
file = file.replace(
  /const res = await fetch\(\`\/api\/unsplash-search\?q=\$\{encodeURIComponent\(query\)\}\`\);\n\s*if \(\!res\.ok\) \{\n\s*throw new Error\("Failed to fetch photos\. API might be rate limited\."\);\n\s*\}\n\s*const data = await res\.json\(\);/g,
  `const res = await fetch(\`/api/unsplash-search?q=\${encodeURIComponent(query)}\`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch photos. API might be rate limited.");
      }`
);

// Fix searchGiphy error handling (similar)
file = file.replace(
  /const res = await fetch\(\`\/api\/giphy-search\?q=\$\{encodeURIComponent\(query\)\}\`\);\n\s*if \(\!res\.ok\) \{\n\s*throw new Error\("Failed to fetch GIFs from Giphy\. API might be rate limited\."\);\n\s*\}\n\s*const data = await res\.json\(\);/g,
  `const res = await fetch(\`/api/giphy-search?q=\${encodeURIComponent(query)}\`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch GIFs from Giphy. API might be rate limited.");
      }`
);

// Fix duplicate error display
file = file.replace(
  "{error && activeTab !== 'giphy' && (",
  "{error && activeTab === 'upload' && ("
);

fs.writeFileSync('src/components/MediaPickerModal.tsx', file);
