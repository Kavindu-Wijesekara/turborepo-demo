# Monorepo Starter

A modern, full-stack monorepo built with Next.js, React, TypeScript, and Tailwind CSS. Featuring multi-tenant support with separate admin and client applications.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

- **Multi-app architecture** - Separate admin and client applications
- **Shared component library** - @acme/ui with shadcn/ui components
- **Type-safe database** - Drizzle ORM with PostgreSQL
- **Authentication** - Clerk (admin), Supabase (client)
- **Monorepo tooling** - Turborepo with smart caching
- **Modern stack** - Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Code quality** - ESLint, Prettier
- **Environment validation** - Type-safe env variables with Zod

## 🛠 Tech Stack

### Core

- **Monorepo**: Turborepo + Bun workspaces
- **Runtime**: Bun 1.3+
- **Language**: TypeScript 5.9
- **Package Manager**: Bun 1.3+

### Applications

- **Framework**: Next.js 16.1
- **UI Framework**: React 19
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Authentication**: Clerk (admin), Supabase (client)

### Packages

- **Database**: Drizzle ORM with PostgreSQL
- **UI Components**: Radix UI + Tailwind CSS
- **Styling**: PostCSS + Tailwind

### Development

- **Linting**: ESLint 9
- **Formatting**: Prettier 3.7
- **Type Checking**: TypeScript
- **Git Hooks**: Husky + lint-staged
- **Versioning**: Changesets

## 📁 Project Structure

```
.
├── apps/
│   ├── admin/          # Admin dashboard (Clerk auth)
│   │   ├── src/app/
│   │   ├── src/components/
│   │   └── package.json
│   └── client/         # Client app (Supabase auth)
│       ├── src/app/
│       ├── src/components/
│       └── package.json
├── packages/
│   ├── db/             # Database layer (Drizzle ORM)
│   │   ├── src/schema.ts
│   │   ├── src/seed.ts
│   │   └── drizzle/
│   ├── ui/             # Shared UI components
│   │   ├── src/components/
│   │   ├── src/lib/
│   │   └── src/styles/
│   ├── types/          # Shared TypeScript types
│   ├── utils/          # Shared utilities
│   ├── eslint-config/  # Shared ESLint configs
│   └── typescript-config/
├── .husky/             # Git hooks
├── .changeset/         # Changeset config
├── turbo.json          # Turborepo configuration
└── package.json        # Workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Bun >= 1.3

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd test

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env.local

# Initialize git hooks
bun run prepare
```

### Environment Variables

Create a `.env.local` file in the root directory. See [.env.example](./.env.example) for all available variables.

## 💻 Development

### Start Development Server

```bash
# Start all applications in development mode
bun dev

# Access applications:
# - Admin: http://localhost:3000
# - Client: http://localhost:3001
```

### Build Applications

```bash
# Build all apps and packages
bun run build

# Build specific app
cd apps/admin && bun run build
```

## 📜 Available Scripts

### Root Scripts

```bash
bun dev              # Start development servers for all apps
bun run build        # Build all apps and packages
bun run lint         # Run ESLint on all packages
bun run lint:fix     # Fix linting issues
bun run format       # Format code with Prettier
bun run format:check # Check formatting without fixing
bun run check-types  # Run TypeScript type checking
bun run changeset    # Create a new changeset
bun run changeset:version # Bump versions based on changesets
```

### Database Scripts

```bash
cd packages/db

bun run generate      # Generate migrations
bun run migrate       # Run migrations
bun run push          # Push schema to database
bun run seed          # Seed development data
bun run studio        # Open Drizzle Studio
```

## 🗄 Database

This monorepo uses **Drizzle ORM** with PostgreSQL.

### Initial Setup

```bash
# Navigate to db package
cd packages/db

# Generate initial migration
bun run generate "initial schema"

# Run migrations
bun run migrate

# Push to database (development)
bun run push

# Seed with initial data
bun run seed
```

### Schema

The database schema is defined in [packages/db/src/schema.ts](./packages/db/src/schema.ts).

### Migrations

Migrations are stored in [packages/db/drizzle/](./packages/db/drizzle/) directory.

<!-- Testing removed per request -->

## Deployment

### Building for Production

```bash
# Build all applications
bun run build

# Build specific application
cd apps/admin && bun run build
```

## 🤝 Contributing

### Before Committing

1. Format code: `bun run format`
2. Fix linting issues: `bun run lint:fix`
3. Type check: `bun run check-types`

Git hooks will automatically run on commit (pre-commit).

### Creating Changesets

When making changes that affect package versions:

```bash
bun run changeset
```

Follow the prompts to select packages and version bump type.

## 📚 Resources

- [Turborepo Docs](https://turborepo.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
