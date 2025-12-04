---
sidebar_position: 2
---

# Getting Started

This guide will help you set up Raven Panel for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **Yarn** 1.22+ (recommended) or npm
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/raven-panel.git
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

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.example.com

# Google OAuth (for authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 4. Start Development Server

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

## Authentication Setup

Raven Panel uses Google OAuth for authentication. To set this up:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Create an **OAuth 2.0 Client ID**
5. Add your development URL to authorized origins: `http://localhost:3000`
6. Copy the Client ID to your `.env.local` file

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

Now that you have Raven Panel running locally:

1. [Explore the Architecture](./architecture) to understand the codebase
2. [Learn about Journeys](./features/journeys) to understand the core feature
3. [Review the API](./api/overview) to understand data flow

