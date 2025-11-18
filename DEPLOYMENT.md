# Developer Tools & Bingo Games

This project contains developer tools and interactive Bingo games built with React, TypeScript, and Vite.

## Deployment

### Cloudflare Pages Setup

1. **Connect to GitHub**:
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub account
   - Select this repository: `ChaipatCasP/DeveloperTools`

2. **Build Configuration**:
   ```
   Framework preset: React
   Build command: npm run build
   Build output directory: build
   Root directory: /
   ```

3. **Environment Variables** (if needed):
   - None required for this static site

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages (requires Wrangler CLI)
npx wrangler pages publish build --project-name=developer-tools-bingo
```

## Features

- **Developer Tools**: JSON Formatter, SQL Formatter, Case Converter, Code Compare
- **Bingo Games**: Player interface and Master control panel
- **Modern UI**: Gradient designs, responsive layouts, animations

## Tech Stack

- React 18 + TypeScript
- Vite for build system
- Tailwind CSS for styling
- Radix UI components
- Lucide React icons