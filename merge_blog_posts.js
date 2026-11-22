const fs = require('fs');

const current = fs.readFileSync('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/src/data/blogPosts.ts', 'utf8');
const newPosts = fs.readFileSync('/Users/apple/.gemini/antigravity/scratch/queueless/new_posts.ts', 'utf8');

const lastBracketIndex = current.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error('Could not find closing bracket');
  process.exit(1);
}

const updated = current.slice(0, lastBracketIndex) + ',\n' + newPosts.trim() + '\n];\n';
fs.writeFileSync('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/src/data/blogPosts.ts', updated);
console.log('Successfully merged 6 new blog posts!');
