# Gold Arena - Deployment Guide

## Optie 1: Vercel (Aanbevolen - Gratis)

### Via Vercel Website:
1. Ga naar [vercel.com](https://vercel.com) en log in (of maak account aan)
2. Klik op "Add New Project"
3. Import je GitHub repository OF upload de `gold-arena` folder
4. Vercel detecteert automatisch Vite - klik "Deploy"
5. Je krijgt een live URL zoals: `https://gold-arena.vercel.app`

### Via Vercel CLI:
```bash
# Installeer Vercel CLI
npm i -g vercel

# In de gold-arena directory
cd gold-arena
vercel

# Volg de prompts - eerste keer moet je inloggen
# Kies: 
# - Set up and deploy? Y
# - Which scope? (je account)
# - Link to existing project? N
# - Project name? gold-arena
# - Directory? ./
```

## Optie 2: Netlify (Gratis)

### Via Netlify Website:
1. Ga naar [netlify.com](https://netlify.com) en log in
2. Sleep de `dist` folder (na `npm run build`) naar Netlify Drop
3. Of gebruik "Add new site" > "Import an existing project"
4. Kies build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Via Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Optie 3: GitHub Pages

1. Push code naar GitHub repository
2. Ga naar repository Settings > Pages
3. Source: "GitHub Actions"
4. Maak `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Optie 4: CodeSandbox / StackBlitz (Live Preview)

### CodeSandbox:
1. Ga naar [codesandbox.io](https://codesandbox.io)
2. Klik "Import from GitHub" of upload de folder
3. CodeSandbox maakt automatisch een live preview

### StackBlitz:
1. Ga naar [stackblitz.com](https://stackblitz.com)
2. Klik "Import from GitHub" of "Start a new project"
3. Upload je `gold-arena` folder

## Optie 5: Lokaal delen (via ngrok)

```bash
# Installeer ngrok
npm install -g ngrok

# Start dev server
npm run dev

# In nieuwe terminal
ngrok http 5173

# Deel de ngrok URL (bijv. https://abc123.ngrok.io)
```

## Build commando's

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build lokaal
npm run preview
```

De build output staat in de `dist` folder - deze kun je ook direct uploaden naar elke static hosting service.

