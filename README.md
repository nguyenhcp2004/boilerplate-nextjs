# Next.js 15 Boilerplate with Feature-Sliced Design

A scalable Next.js 15 boilerplate following **Feature-Sliced Design (FSD)** architecture, with internationalization support, modern UI components, and best practices built-in.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) with strict mode
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/) with locale routing
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Validation**: [Zod](https://zod.dev/) + [react-hook-form](https://react-hook-form.com/)
- **HTTP Client**: Custom typed client with error handling
- **Code Quality**: ESLint, Prettier, Husky, Commitlint

## 📁 Feature-Sliced Design Architecture

This project follows the [Feature-Sliced Design](https://feature-sliced.design/) methodology for scalable frontend applications.

### Directory Structure

```
boilerplate-nextjs/
├── app/                              # Next.js App Router (routing layer)
│   └── [locale]/
│       ├── layout.tsx                # Root layout with providers
│       ├── page.tsx                  # Routes → imports from @/screens
│       └── globals.css               # Global styles
│
├── src/                              # FSD Architecture (business logic)
│   ├── app/                          # FSD app layer
│   │   └── styles/
│   │       └── globals.css           # Application-level styles
│   │
│   ├── shared/                       # Shared layer (reusable across all layers)
│   │   ├── ui/                       # UI components (shadcn/ui)
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── input/
│   │   │   └── ...
│   │   ├── lib/                      # Utilities & libraries
│   │   │   ├── http/                 # HTTP client
│   │   │   ├── utils/                # Helper functions (cn, format, etc.)
│   │   │   └── env/                  # Environment config
│   │   ├── config/                   # Configuration files
│   │   │   ├── i18n/                 # i18n routing, navigation
│   │   │   └── routes.ts             # Route definitions
│   │   ├── segments/                 # i18n shared translations
│   │   │   └── common/               # Common translations (vi, en)
│   │   ├── constants/                # System-wide constants
│   │   └── types/                    # Shared TypeScript types
│   │
│   ├── entities/                     # Entities layer (business domain objects)
│   │   └── user/                     # User entity
│   │       ├── model/
│   │       │   ├── types.ts          # User types
│   │       │   └── store.ts          # Zustand store
│   │       └── index.ts              # Public API
│   │
│   ├── features/                     # Features layer (user interactions)
│   │   └── home/                     # Home feature
│   │       ├── ui/                   # Feature components
│   │       ├── i18n/                 # Feature translations
│   │       │   ├── vi.json
│   │       │   └── en.json
│   │       └── index.ts              # Public API
│   │
│   ├── widgets/                      # Widgets layer (compound components)
│   │   └── .gitkeep
│   │
│   └── screens/                      # Screens layer (full page compositions)
│       └── home/
│           ├── ui/
│           │   └── home-page.tsx     # Full page component
│           └── index.ts              # Public API
│
├── public/                           # Static assets
├── middleware.ts                     # Next.js middleware
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── components.json                   # shadcn/ui configuration
└── package.json                      # Dependencies
```

### FSD Layers & Dependency Rules

```
┌─────────────────────────────────────────┐
│  app (Next.js Router)                   │  ← Can import from all FSD layers
├─────────────────────────────────────────┤
│  screens (FSD)                          │  ← Can import from: widgets, features, entities, shared
├─────────────────────────────────────────┤
│  widgets (FSD)                          │  ← Can import from: features, entities, shared
├─────────────────────────────────────────┤
│  features (FSD)                         │  ← Can import from: entities, shared
├─────────────────────────────────────────┤
│  entities (FSD)                         │  ← Can import from: shared
├─────────────────────────────────────────┤
│  shared (FSD)                           │  ← Cannot import from any FSD layer
└─────────────────────────────────────────┘
```

**Key Rules:**
1. **Dependency Rule**: Only import from layers below you
   - ✅ `features` can import from `entities` and `shared`
   - ❌ `features` cannot import from `screens` or `widgets`

2. **Public API**: Each slice exports through `index.ts`
   - ✅ Use: `import { HomeHero } from '@/features/home'`
   - ❌ Avoid: `import { HomeHero } from '@/features/home/ui/home-hero'`

3. **Slice Independence**: Each feature slice should be self-contained
   - Co-locate components, logic, styles, and translations
   - Avoid tight coupling between slices

## 🏗️ Path Aliases

TypeScript path aliases configured in `tsconfig.json`:

```json
{
  "@/app/*": "./src/app/*",           // FSD app layer
  "@/shared/*": "./src/shared/*",     // Shared utilities, UI, configs
  "@/entities/*": "./src/entities/*", // Business domain objects
  "@/features/*": "./src/features/*", // User-interaction features
  "@/widgets/*": "./src/widgets/*",   // Compound components
  "@/screens/*": "./src/screens/*"    // Application pages
}
```

## 🌍 Internationalization (i18n)

### Supported Locales
- **Vietnamese (vi)** - Default locale
- **English (en)**

### Translation Structure

```
src/
├── shared/segments/common/           # Shared translations
│   ├── vi.json
│   └── en.json
└── features/
    └── home/i18n/                   # Feature-specific translations
        ├── vi.json
        └── en.json
```

### Adding New Translations

1. **For a new feature**:
   ```bash
   src/features/my-feature/i18n/
   ├── vi.json
   └── en.json
   ```

2. **Update i18n config** (`src/shared/config/i18n/request.ts`):
   ```typescript
   messages: {
     ...(await import(`@/shared/segments/common/${locale}.json`)).default,
     ...(await import(`@/features/my-feature/i18n/${locale}.json`)).default
   }
   ```

## 🎨 UI Components (shadcn/ui)

This project uses [shadcn/ui](https://ui.shadcn.com/) components.

### Adding New Components

```bash
npx shadcn@latest add [component-name]
```

Components will be installed to `src/shared/ui/[component]/` following the FSD architecture.

**Example:**
```bash
npx shadcn@latest add dialog
```

This will create:
```
src/shared/ui/dialog/
├── dialog.tsx
└── index.ts
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Build

```bash
# Build for production
npm run build
# or
yarn build
# or
pnpm build
```

### Production

```bash
# Start production server
npm run start
# or
yarn start
# or
pnpm start
```

### Linting

```bash
# Run ESLint
npm run lint
# or
yarn lint
# or
pnpm lint
```

## 📝 Adding New Features

Follow this pattern when adding new features:

### 1. Create a Feature Slice

```
src/features/cart/
├── ui/
│   ├── cart-item.tsx
│   └── cart-summary.tsx
├── model/
│   ├── use-cart.ts
│   └── types.ts
├── api/
│   ├── add-item.ts
│   └── remove-item.ts
├── i18n/
│   ├── vi.json
│   ├── en.json
│   └── index.ts
└── index.ts              # Public API: export * from './ui', etc.
```

### 2. Create an Entity (if needed)

```
src/entities/product/
├── model/
│   ├── types.ts
│   └── store.ts
└── index.ts
```

### 3. Create a Widget (optional, for composition)

```
src/widgets/shopping-cart/
├── ui/
│   └── shopping-cart.tsx
└── index.ts
```

### 4. Create a Screen (full page)

```
src/screens/cart/
├── ui/
│   └── cart-page.tsx
└── index.ts
```

### 5. Add Next.js Route

```typescript
// app/[locale]/cart/page.tsx
import { CartPage } from '@/screens/cart'

export default function Cart() {
  return <CartPage />
}
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API
NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000/api

# Add other environment variables here
```

See `.env.example` for reference.

## 📚 HTTP Client

The project includes a typed HTTP client (`@/shared/lib/http`) with:

- Automatic Bearer token injection from localStorage
- Support for JSON and FormData
- Custom error classes (`HttpError`, `EntityError`)
- Configurable base URL

**Usage:**
```typescript
import http from '@/shared/lib/http'

// GET request
const response = await http.get<User>('/user/profile')

// POST request
const result = await http.post<LoginResponse>('/auth/login', { email, password })

// With custom options
const data = await http.get<Data>('/endpoint', {
  baseUrl: ''  // Empty string for relative API calls to Next.js
})
```

## 🎯 Git Workflow

This project uses:

- **Husky** for Git hooks
- **Commitlint** for conventional commits
- **Lint-staged** for pre-commit checks

### Commit Message Format

Follow the conventional commits format:

```
<type>(<scope>): <subject>

[optional body]
```

**Allowed types:**
- `feat` - New feature
- `fix` - Bug fix
- `improve` - Improvement
- `refactor` - Code refactoring
- `docs` - Documentation
- `chore` - Maintenance tasks
- `style` - Code style changes
- `test` - Adding tests
- `revert` - Revert a commit
- `ci` - CI/CD changes
- `build` - Build system changes

**Examples:**
```bash
feat(auth): add login form
fix(api): handle token expiration
docs(readme): update FSD architecture section
```

### Pre-commit Hooks

- `pre-commit` - Runs `npm run lint`
- `commit-msg` - Validates commit message format
- `pre-push` - Blocks direct pushes to `main` and `develop` branches

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=readme)

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Zustand Guide](https://zustand-demo.pmnd.rs/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ using Next.js 15 and Feature-Sliced Design**
