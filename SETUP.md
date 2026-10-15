# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Name your repository: `vexit-calc` (or any name you prefer)
3. Keep it public (required for free GitHub Pages)
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push Your Code

Run these commands in your terminal:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vexit-calc.git

# Push your code
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Under "Branch", select `main` and `/ (root)`
6. Click "Save"

## Step 4: Access Your Site

After a few minutes, your site will be available at:
```
https://YOUR_USERNAME.github.io/vexit-calc/
```

You can find the exact URL in Settings → Pages after it's deployed.

## Making Updates

After making changes to the code:

1. Make your changes to `app.ts` or `index.html`
2. If you changed TypeScript, rebuild:
   ```bash
   npm run build
   ```
3. Commit and push:
   ```bash
   git add -A
   git commit -m "Description of your changes"
   git push
   ```

GitHub Pages will automatically update within a few minutes.

## Troubleshooting

- **Site not showing?** Wait 2-5 minutes after first push or check Settings → Pages for deployment status
- **Changes not appearing?** Clear your browser cache or do a hard refresh (Ctrl+F5 / Cmd+Shift+R)
- **TypeScript errors?** Make sure to run `npm run build` after editing `app.ts`

## Local Testing

To test locally before pushing:

```bash
# Start local server
npm run serve

# Visit in browser
# http://localhost:8000
```
