# Lumen Studio

AI Image Editor SaaS built with Next.js App Router, Better Auth, Prisma, Polar billing, and ImageKit.

## Tech Stack

- Next.js 16 + React 19 + TypeScript (strict)
- Prisma + PostgreSQL (Neon-compatible)
- Better Auth + @daveyplate/better-auth-ui
- Polar checkout + customer portal
- ImageKit upload + transformations
- Tailwind CSS v4 + Sonner toasts

## Prerequisites

- Node.js 20.9+
- npm 10+
- PostgreSQL database URL

## Environment Variables

Copy .env.example to .env and fill values:

- DATABASE_URL
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- POLAR_ACCESS_TOKEN
- POLAR_WEBHOOK_SECRET
- IMAGEKIT_PRIVATE_KEY
- IMAGEKIT_PUBLIC_KEY
- IMAGEKIT_URL_ENDPOINT
- NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
- NEXT_PUBLIC_APP_URL (production canonical URL, e.g. https://yourdomain.com)

## Getting Started

```bash
npm install
npm run db:push
npm run dev
```

Open http://localhost:3000

## Available Scripts

- npm run dev: start local dev server
- npm run build: production build
- npm run start: run production build
- npm run lint: ESLint checks
- npm run typecheck: TypeScript checks
- npm run check: lint + typecheck
- npm run format:check: Prettier check
- npm run format:write: Prettier write
- npm run db:studio: open Prisma Studio

## Quality Gate

Before shipping changes:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy To Vercel (Easy)

1. Push your latest code to GitHub.
2. Open Vercel and click `Add New...` -> `Project`.
3. Import `KritamBanDev/ai-image-editor-saas-app`.
4. In `Environment Variables`, add all variables from `.env.example`.
5. Set these production values:

- `NEXT_PUBLIC_APP_URL=https://kritam-ai-image-editor-saas.vercel.app`
- `BETTER_AUTH_URL=https://kritam-ai-image-editor-saas.vercel.app`

6. Click `Deploy`.
7. After deploy, open:

- `https://kritam-ai-image-editor-saas.vercel.app/robots.txt`
- `https://kritam-ai-image-editor-saas.vercel.app/sitemap.xml`

8. In your domain DNS settings, point your custom domain to Vercel (optional if using the default Vercel domain).

## Notes

- The dashboard includes a Customer Portal entry that redirects through Polar.
- Credit deductions for AI operations are handled atomically server-side.
- Upload auth tokens are generated only for authenticated users.
