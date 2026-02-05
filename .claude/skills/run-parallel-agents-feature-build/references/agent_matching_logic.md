# Agent Matching Logic Reference

This document provides detailed rules, patterns, and edge cases for matching features, tasks, and file types to the appropriate specialized agent.

## Agent Type Catalog

### laravel-senior-engineer

**Primary Expertise:**

- Laravel 12.x backend development
- Eloquent ORM and database operations (MySQL, Redis, DynamoDB)
- Queue systems with Horizon
- Service layer patterns
- RESTful API development
- Artisan commands and migrations

**Technology Indicators:**

- File extensions: `*.php`
- Directory patterns: `/app/`, `/routes/`, `/database/`, `/config/`
- Framework files: `artisan`, `composer.json` with Laravel dependencies
- Code patterns: Eloquent models, `namespace App\`, Laravel facades

**Common Task Patterns:**

- "Build API endpoint for..."
- "Create Eloquent model for..."
- "Implement queue job for..."
- "Add migration for..."
- "Create service class for..."

**Edge Cases:**

- Pure PHP without Laravel → Use `general-purpose` instead
- Magento PHP code → Use `magento-senior-engineer`
- WordPress PHP → Use `general-purpose` (no WordPress agent)

---

### nextjs-senior-engineer

**Primary Expertise:**

- Next.js 14/15 with App Router
- React Server Components (RSC)
- Server Actions
- Client and server-side rendering strategies
- Advanced caching (revalidation, static generation)
- API routes and middleware

**Technology Indicators:**

- File extensions: `*.tsx`, `*.jsx`
- Directory patterns: `/app/`, `/pages/`, `/components/`
- Framework files: `next.config.js`, `next.config.ts`, `package.json` with `next` dependency
- Code patterns: `'use client'`, `'use server'`, Server Actions, RSC patterns

**Common Task Patterns:**

- "Build page for..."
- "Create React component for..."
- "Implement server action for..."
- "Add API route for..."
- "Build dashboard/UI for..."

**Edge Cases:**

- Pure React without Next.js → Still use `nextjs-senior-engineer` if it's a component library or UI work
- Remix app → Use `remix-senior-engineer` instead
- React Native → Use `expo-react-native-senior-engineer`

---

### nestjs-senior-engineer

**Primary Expertise:**

- NestJS framework with TypeScript
- Dependency injection and modular architecture
- Microservices patterns
- Queue systems (Bull/BullMQ)
- RESTful APIs and GraphQL
- Guards, interceptors, pipes, and decorators

**Technology Indicators:**

- File extensions: `*.ts`
- Framework files: `nest-cli.json`, `package.json` with `@nestjs/*` dependencies
- Directory patterns: `/src/`, module-based structure
- Code patterns: `@Injectable()`, `@Controller()`, `@Module()`, NestJS decorators

**Common Task Patterns:**

- "Build NestJS module for..."
- "Create service with DI for..."
- "Implement microservice for..."
- "Add queue processor for..."
- "Build GraphQL resolver for..."

**Edge Cases:**

- Express.js without NestJS → Use `express-senior-engineer`
- Node.js scripts without framework → Use `general-purpose`

---

### remix-senior-engineer

**Primary Expertise:**

- Remix full-stack framework
- Loaders and actions (data fetching patterns)
- Progressive enhancement
- Streaming patterns
- Authentication and session management
- Vite integration

**Technology Indicators:**

- File extensions: `*.tsx`, `*.ts`
- Framework files: `remix.config.js`, `vite.config.ts`, `package.json` with `@remix-run/*`
- Directory patterns: `/app/routes/`
- Code patterns: `export async function loader`, `export async function action`, `useLoaderData`, `useFetcher`

**Common Task Patterns:**

- "Build Remix route for..."
- "Create loader/action for..."
- "Implement form with progressive enhancement..."
- "Add authentication to Remix app..."

**Edge Cases:**

- Next.js app → Use `nextjs-senior-engineer`
- Generic React → Use `nextjs-senior-engineer`

---

### express-senior-engineer

**Primary Expertise:**

- Express.js framework
- Middleware architecture
- RESTful API development
- Queue systems with Bull
- Logging with Pino
- Node.js server-side development

**Technology Indicators:**

- File extensions: `*.js`, `*.ts`
- Dependencies: `package.json` with `express` (but NOT `@nestjs/*`)
- Code patterns: `app.use()`, `app.get()`, `express.Router()`, middleware functions

**Common Task Patterns:**

- "Build Express API for..."
- "Create middleware for..."
- "Add REST endpoint for..."
- "Implement Express route handler for..."

**Edge Cases:**

- NestJS (which uses Express under the hood) → Use `nestjs-senior-engineer`
- Serverless functions → Use `general-purpose` unless explicitly Express-based

---

### expo-react-native-senior-engineer

**Primary Expertise:**

- Expo React Native development
- Expo Router for navigation
- Expo Modules API
- Cross-platform mobile (iOS/Android/web)
- react-native-logs for logging
- EAS deployment

**Technology Indicators:**

- File extensions: `*.tsx`, `*.jsx`
- Framework files: `app.json` (Expo config), `package.json` with `expo` dependency
- Directory patterns: `/app/` (Expo Router)
- Code patterns: Expo modules, `expo-router`, React Native components

**Common Task Patterns:**

- "Build mobile screen for..."
- "Create Expo module for..."
- "Implement navigation for..."
- "Add mobile feature for..."

**Edge Cases:**

- Pure React Native without Expo → Use `general-purpose` (no pure RN agent)
- Web-only React → Use `nextjs-senior-engineer`

---

### flutter-senior-engineer

**Primary Expertise:**

- Flutter framework
- Widget composition
- Navigation (GoRouter, Navigator 2.0)
- State management (Riverpod, Provider, Bloc)
- Talker logging
- Firebase integration

**Technology Indicators:**

- File extensions: `*.dart`
- Framework files: `pubspec.yaml`, Flutter dependencies
- Directory patterns: `/lib/`, `/test/`
- Code patterns: `StatelessWidget`, `StatefulWidget`, Flutter widget tree

**Common Task Patterns:**

- "Build Flutter screen for..."
- "Create widget for..."
- "Implement state management for..."
- "Add navigation for..."

**Edge Cases:**

- Dart backend (without Flutter) → Use `general-purpose`

---

### magento-senior-engineer

**Primary Expertise:**

- Magento 2 e-commerce
- Module development
- Dependency injection (di.xml)
- Plugins and observers
- Service contracts
- REST/GraphQL APIs
- Monolog logging

**Technology Indicators:**

- File extensions: `*.php`, `*.xml`
- Directory patterns: `/app/code/`, `/vendor/magento/`
- Framework files: `registration.php`, `module.xml`, `di.xml`, `composer.json` with Magento dependencies
- Code patterns: Magento namespaces, DI patterns, plugins, service contracts

**Common Task Patterns:**

- "Build Magento module for..."
- "Create plugin for..."
- "Implement service contract for..."
- "Add Magento API endpoint for..."

**Edge Cases:**

- Generic PHP → Use `general-purpose`
- Laravel → Use `laravel-senior-engineer`

---

### general-purpose

**Primary Expertise:**

- General research and exploration
- Multi-language code analysis
- File system operations
- Tasks not matching specific frameworks

**Use When:**

- No framework-specific patterns detected
- Exploratory tasks ("find all instances of...")
- Multi-framework analysis
- Configuration file edits
- Documentation generation
- Shell scripting

**Common Task Patterns:**

- "Search for..."
- "Analyze these files..."
- "Explore the codebase..."
- "Generate documentation for..."

---

## Matching Algorithm

### Step-by-Step Process

1. **Check for explicit framework mentions** in the task description
   - If user says "Laravel API", match to `laravel-senior-engineer`
   - If user says "Next.js page", match to `nextjs-senior-engineer`

2. **Analyze file paths** (if provided)
   - Check file extensions: `.php`, `.tsx`, `.dart`, etc.
   - Check directory patterns: `/app/code/` (Magento), `/nest-cli.json` (NestJS)

3. **Search for framework config files** in the workspace
   - `nest-cli.json` → NestJS
   - `remix.config.js` → Remix
   - `app.json` + `expo` dependency → Expo
   - `pubspec.yaml` + Flutter → Flutter

4. **Analyze code patterns** (if code is visible)
   - `@Injectable()` → NestJS
   - `export async function loader` → Remix
   - `Eloquent`, `namespace App\` → Laravel

5. **Default to general-purpose** if no clear match

### Multi-Agent Scenarios

When a task requires multiple agent types:

**Scenario 1: Full-stack feature**

- User: "Build user profile with backend API and frontend page"
- Split into:
  - Backend API → `laravel-senior-engineer` or `express-senior-engineer`
  - Frontend page → `nextjs-senior-engineer`

**Scenario 2: Microservices architecture**

- User: "Build payment service (NestJS) and webhook handler (Express)"
- Split into:
  - Payment service → `nestjs-senior-engineer`
  - Webhook handler → `express-senior-engineer`

**Scenario 3: Cross-platform**

- User: "Build mobile app (Flutter) and web dashboard (Next.js)"
- Split into:
  - Mobile → `flutter-senior-engineer`
  - Web → `nextjs-senior-engineer`

---

## File Pattern Detection Matrix

| File Pattern                        | Agent Type                          | Confidence |
| ----------------------------------- | ----------------------------------- | ---------- |
| `*.php` + `/app/Http/`              | `laravel-senior-engineer`           | High       |
| `*.php` + `/app/code/`              | `magento-senior-engineer`           | High       |
| `*.tsx` + `/app/` + `next.config.*` | `nextjs-senior-engineer`            | High       |
| `*.tsx` + `app.json`                | `expo-react-native-senior-engineer` | High       |
| `*.tsx` + `remix.config.*`          | `remix-senior-engineer`             | High       |
| `*.ts` + `nest-cli.json`            | `nestjs-senior-engineer`            | High       |
| `*.ts` + `express` imports          | `express-senior-engineer`           | Medium     |
| `*.dart` + `pubspec.yaml`           | `flutter-senior-engineer`           | High       |
| `*.php` (generic)                   | `general-purpose`                   | Low        |
| `*.ts` (no framework)               | `general-purpose`                   | Low        |

---

## Edge Case Handling

### Ambiguous File Extensions

**Problem:** TypeScript (`.ts`, `.tsx`) is used by Next.js, Remix, NestJS, Express, and Expo

**Solution:**

1. Check for framework config files first
2. Look at directory structure
3. Examine import statements
4. Default to most common for the project if uncertain

### Mixed Technology Stacks

**Problem:** Project uses both Laravel backend and Next.js frontend

**Solution:**

- Analyze which part of the stack the task targets
- If task spans both, split into two agents
- Use file paths to determine context

### Unknown Frameworks

**Problem:** Encountering a framework not in the agent catalog (e.g., SvelteKit, Nuxt.js)

**Solution:**

- Use `general-purpose` agent
- Document the framework for future reference
- Consider requesting a new specialized agent if frequently used

### Testing and Build Tasks

**Problem:** Running tests or builds that span multiple frameworks

**Solution:**

- If tests are framework-specific (e.g., Laravel PHPUnit tests), use framework agent
- If running global build scripts, use `general-purpose`
- If parallelizing tests across subsystems, split by framework

---

## Confidence Scoring

When matching agents, assign confidence scores:

- **High (90-100%):** Clear framework indicators, config files present, explicit user mention
- **Medium (60-89%):** File patterns match, but no config files or some ambiguity
- **Low (30-59%):** Weak signals, could be multiple frameworks
- **Very Low (<30%):** No clear indicators, default to `general-purpose`

**Decision Rule:**

- High/Medium confidence → Use specialized agent
- Low/Very Low → Use `general-purpose` OR ask user for clarification

---

## Future Agent Types

Potential agents that may be added in the future:

- `svelte-senior-engineer` - For SvelteKit applications
- `vue-senior-engineer` - For Vue.js/Nuxt applications
- `django-senior-engineer` - For Django Python backends
- `rails-senior-engineer` - For Ruby on Rails applications
- `spring-boot-senior-engineer` - For Java Spring Boot APIs

When encountering these technologies currently, use `general-purpose` and note the limitation.
