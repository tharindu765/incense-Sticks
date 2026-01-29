# 🚀 Deployment Guide

## 1. Push to GitHub

I have already initialized the git repository and committed all your files.

1.  **Create a new Repository** on [GitHub.com](https://github.com/new).
    *   Name it: `aura-incense` (or whatever you like).
    *   **Do not** initialize with README, .gitignore, or License (we already have them).

2.  **Push your code**:
    Run these commands in your *current terminal* (copy and paste):

    ```bash
    # Replace URL with your actual repository URL
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    
    # Rename branch to main
    git branch -M main
    
    # Push code
    git push -u origin main
    ```

## 2. Deploy to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your **GitHub Repository**.
4.  **Framework Preset**: Select `Other`.
5.  **Build Settings** (should auto-detect, but verify):
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
    *   **Install Command**: `npm install`
6.  Click **Deploy**.

## Why this setup?
- **`package.json`**: I added this so Vercel knows exactly which tools to install (`terser`, `clean-css`) to build your site.
- **`build.sh`**: Your custom script handles the heavy lifting (WebP conversion, minification).
- **`dist/`**: Since we ignore this folder in git, Vercel will generate it fresh every time you push code!
