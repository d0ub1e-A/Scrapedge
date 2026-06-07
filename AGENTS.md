# CRITICAL RULES: MUST FOLLOW

## Package Manager
- Use `pnpm` for all package management tasks.

## Developer Commands
- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Test**: `pnpm test` (Vitest)
- **Lint**: `pnpm lint` (ESLint)
- **Format**: `pnpm format` (Prettier & ESLint fix)
- **Typecheck**: `pnpm exec tsc --noEmit`

## Database (Prisma)
All DB commands use `.env.local` via `dotenv-cli`:
- never run `pnpm db:push`

## Architecture & Conventions
- **Framework**: TanStack Start (Fullstack React)
- **Database**: PostgreSQL via Prisma
- **Auth**: `better-auth`
- **AI**: Vercel AI SDK with OpenRouter and Firecrawl
- **Styling**: Tailwind CSS & shadcn/ui
- **Imports**: Uses `#/*` alias for `src/*`
- **Routing**: TanStack Router (see `README.md` for `<Link>` component details)
