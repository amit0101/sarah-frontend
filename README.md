# sarah-frontend

Monorepo containing the Sarah AI chatbot frontend projects.

## Projects

| Dir | Description | Deployed To |
|-----|-------------|-------------|
| `admin-panel/` | Sarah admin panel — location setup, KB, prompts, health | Vercel |
| `webchat-widget/` | Embeddable Sarah webchat widget (library IIFE bundle) | Vercel |

## Deploy

Each project is a separate Vercel deployment from this same repo, with the **Root Directory** set in the Vercel dashboard.

### Admin Panel
- Root Directory: `admin-panel`
- Build Command: `npm run build`
- Output Directory: `dist`
- Env var: `VITE_SARAH_API_URL` → Render backend URL

### Webchat Widget
- Root Directory: `webchat-widget`
- Build Command: `npm run build`
- Output Directory: `dist`
- Env var: `VITE_SARAH_API_URL` → Render backend URL

## Local Dev

```bash
# Admin panel
cd admin-panel && npm install && npm run dev

# Webchat widget
cd webchat-widget && npm install && npm run dev
```
