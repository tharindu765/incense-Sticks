#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Production Build..."

# 1. Clean and Setup Dist
rm -rf dist
mkdir -p dist/assets/images

# 2. Copy Assets
echo "📸 Copying pre-converted WebP images..."
cp -r assets/images/* dist/assets/images/

echo "✅ Images copied!"

# 3. Minify CSS
echo "🎨 Minifying CSS..."
# We use npx to run clean-css-cli without global install
npx -y clean-css-cli -o dist/styles.css styles.css
echo "✅ CSS minified!"

# 4. Prepare and Minify JS
echo "📜 Minifying JavaScript..."
# Replace image paths to point to new WebP location
# Old path example: .agent/hero/animation-images/Smooth_ritual_transition_1080p_202601290923_${index.toString().padStart(3, '0')}.jpg
# New path example: assets/images/Smooth_ritual_transition_1080p_202601290923_${index.toString().padStart(3, '0')}.webp

cat script.js | \
sed 's/\.jpg/.webp/g' | \
sed 's|\.agent/hero/animation-images|assets/images|g' > temp_script.js

npx -y terser temp_script.js -o dist/script.js --compress --mangle
rm temp_script.js
echo "✅ JavaScript minified and paths updated!"

# 5. Minify HTML
echo "📄 Minifying HTML..."
# No path updates needed if css/js are properly relative and in root of dist
npx -y html-minifier \
  --collapse-whitespace \
  --remove-comments \
  --minify-css true \
  --minify-js true \
  --input-dir ./ \
  --output-dir dist \
  --file-ext html

echo "✅ HTML minified!"

# 6. Create Vercel Config
echo "⚙️ Creating Vercel URL config..."
cat > dist/vercel.json <<EOF
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)\\.(css|js|webp)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
EOF

echo "✨ Build Complete! Output is in /dist"
echo "   Run 'cd dist && python3 -m http.server 8081' to test production build."
