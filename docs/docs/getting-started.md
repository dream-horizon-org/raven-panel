---
sidebar_position: 2
---

# Getting Started

This guide will help you set up Raven for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **Yarn** 1.22+ (recommended) or npm
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dream-horizon-org/raven-panel.git
cd raven-panel
```

### 2. Install Dependencies

We recommend using Yarn for package management:

```bash
yarn install
```

Or with npm:

```bash
npm install
```

### 3. Start Development Server

```bash
yarn dev
```

This starts the Next.js development server with Turbopack for fast refresh. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server with Turbopack |
| `yarn build` | Create production build |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Fix ESLint errors automatically |
| `yarn test` | Run Jest tests |
| `yarn test:coverage` | Run tests with coverage report |
| `yarn test:watch` | Run tests in watch mode |
| `yarn app:check` | TypeScript type checking |

## Project Structure

```
raven-panel/
├── src/
│   ├── __tests__/          # Test files
│   ├── api/
│   │   └── services/       # API service functions
│   ├── app/
│   │   ├── Auth/           # Authentication module
│   │   ├── components/     # App-level components
│   │   ├── dashboard/      # Dashboard pages & features
│   │   ├── providers/      # React context providers
│   │   └── utils/          # App utilities
│   ├── components/         # Shared components
│   ├── config/             # Configuration files
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # External library configs
│   ├── theme/              # MUI theme configuration
│   └── ui/                 # Base UI components
├── public/                 # Static assets
├── docs/                   # Documentation (Docusaurus)
└── coverage/               # Test coverage reports
```

## Interface Overview

### Sidebar Navigation

The left sidebar provides access to:
- **Journeys** - Main journey management page
- **Dark Mode Toggle** - Switch between light and dark themes
- **User Profile** - View your account details

### Header Actions

The header contains:
- **Search Bar** - Search journeys by name
- **Create Journey Button** - Start creating a new journey

## Browser Support

Raven works best on modern browsers:

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## IDE Setup

### VS Code / Cursor

We recommend installing these extensions:

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Enhanced TypeScript support
- **Tailwind CSS IntelliSense** - Tailwind autocomplete

### Recommended Settings

Add to your `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Troubleshooting

### Port Already in Use

If port 3000 is busy, specify a different port:

```bash
yarn dev -p 3001
```

### Module Not Found Errors

Clear the Next.js cache and reinstall:

```bash
rm -rf .next node_modules
yarn install
yarn dev
```

### TypeScript Errors

Run the type checker to identify issues:

```bash
yarn app:check
```

## Next Steps

Now that you have Raven running locally:

1. **[Learn about Journeys](./features/journeys)** - Understand the core feature and listing page
2. **[Create a Journey](./features/create-journey)** - Design your first nudge
3. **[Set up Scheduling](./features/scheduling)** - Configure when journeys go live
