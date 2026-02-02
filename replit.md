# replit.md

## Overview

This is a playful "Will you go out with me?" link generator application. Users create a custom question and success message, then share a unique link. When recipients visit the link, they see a "Yes/No" prompt where the "No" button playfully teleports away, eventually leaving only "Yes" as an option - triggering a confetti celebration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth transitions and effects
- **Special Effects**: canvas-confetti for celebration animations
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints defined in shared route definitions
- **Validation**: Zod schemas shared between client and server

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - single source of truth for types
- **Migrations**: Drizzle Kit with `db:push` command

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/ui/  # shadcn/ui components
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Route components
│       └── lib/            # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Drizzle database connection
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Drizzle schema definitions
│   └── routes.ts     # API route contracts
└── migrations/       # Database migrations
```

### Key Design Decisions
- **Shared Schema**: Database types generated from Drizzle schema, ensuring type safety across stack
- **Route Contracts**: API routes defined with Zod validation in `shared/routes.ts`, used by both client and server
- **Component Library**: Full shadcn/ui installation with extensive Radix UI primitives

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection string required via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database access with automatic migration support

### UI/UX Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Framer Motion**: Animation library for React
- **canvas-confetti**: Celebration particle effects
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Fonts (Google Fonts)
- **Poppins**: Primary sans-serif font
- **Architects Daughter**: Handwriting-style font for playful headings