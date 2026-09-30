# Proofolio Client

The client is Proofolio's student-facing web application. Students use it to manage their profiles and achievements, and visitors can view published portfolios.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Lucide icons

## Requirements

- Node.js and npm supported by the installed Next.js release
- The Proofolio API, running locally or at a configured URL

The client and server are separate npm projects. Install and run commands from their respective folders.

## Local setup

From the repository root:

    cd website/client
    npm ci

Create website/client/.env.local:

    NEXT_PUBLIC_API_URL=http://localhost:4000

This is the base URL for the Express API. If it is unset, the client defaults to http://localhost:4000. Restart the development server after changing it.

Start the client:

    npm run dev

Open http://localhost:3000. In another terminal, start the server as described in ../server/README.md.

### Windows PowerShell

    Set-Location website/client
    npm ci
    "NEXT_PUBLIC_API_URL=http://localhost:4000" | Set-Content -Encoding utf8 .env.local
    npm run dev

## Scripts

| Command | Purpose |
| --- | --- |
| npm run dev | Start Next.js development server with webpack |
| npm run build | Create a production build |
| npm start | Serve the production build |
| npm run lint | Run ESLint |

Production run:

    npm run build
    npm start

## Main routes

- / — landing page
- /login and /register — authentication
- /dashboard — private student dashboard
- /dashboard/profile, /dashboard/projects, /dashboard/experience, /dashboard/eca, /dashboard/courses, /dashboard/certificates, /dashboard/achievements, /dashboard/skills, /dashboard/documents — manage portfolio content
- /dashboard/ai — AI assistant
- /dashboard/portfolio — portfolio settings and preview
- /u/[username] — public portfolio

The client uses the API for authentication, dashboard data, portfolio content, uploads, and AI features. Authenticated requests use the API's access/refresh token flow.

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| NEXT_PUBLIC_API_URL | No for local development | Express API base URL; defaults to http://localhost:4000. This value is exposed to the browser, so never put secrets in NEXT_PUBLIC variables. |

NEXT_PUBLIC values are embedded into the browser bundle at build time. Configure the deployed API URL before running the production build.

## Troubleshooting

- **API requests fail:** Confirm the server is running and NEXT_PUBLIC_API_URL points to it.
- **CORS errors:** Set the server's CLIENT_URL to the exact client origin, including scheme and port, then restart the server.
- **API URL changes do not take effect:** Restart the dev server; for production, rebuild after changing the value.
- **Port 3000 is in use:** Run npm run dev -- --port 3001 and set the server's CLIENT_URL to http://localhost:3001.

Keep local configuration in .env.local; it is ignored by Git.
