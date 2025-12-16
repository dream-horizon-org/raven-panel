---
sidebar_position: 1
---

# Getting Started

Set up your local development environment for Raven Panel.

## Prerequisites

- **Node.js** 18.0 or higher
- **Yarn** 1.22+ (recommended) or npm
- **Git**
- **Docker** (optional, for containerized setup)

## Quick Start

### Option 1: Local Development

**1. Clone and Install:**
```bash
git clone https://github.com/dream-horizon-org/raven-panel.git
cd raven-panel
yarn install
```

**2. Start Development Server:**
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Option 2: Docker Development

**1. Clone the repository:**
```bash
git clone https://github.com/dream-horizon-org/raven-panel.git
cd raven-panel
```

**2. Create `.env` file:**
```bash
cp .env.example .env
# Edit .env with your environment variables
```

**3. Build and run with Docker Compose:**
```bash
docker-compose up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000).

**Note:** Ensure you're on the `feat/docker-integration` branch or have the Docker files in your repository.

## Available Scripts

| Command | Description |
|:--------|:------------|
| `yarn dev` | Start development server with Turbopack |
| `yarn build` | Create production build |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Fix ESLint errors automatically |
| `yarn test` | Run Jest tests |
| `yarn test:coverage` | Run tests with coverage report |
| `yarn test:watch` | Run tests in watch mode |
| `yarn app:check` | TypeScript type checking |

## IDE Setup

### Recommended Extensions (VS Code / Cursor)

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Enhanced TypeScript support
- **Tailwind CSS IntelliSense** - Tailwind autocomplete

### Recommended Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Troubleshooting

**Port Already in Use:**
```bash
yarn dev -p 3001
```

**Module Not Found Errors:**
```bash
rm -rf .next node_modules
yarn install
yarn dev
```

**TypeScript Errors:**
```bash
yarn app:check
```
