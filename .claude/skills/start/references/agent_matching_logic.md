# Agent Matching Logic Reference

This document provides comprehensive rules, patterns, and decision trees for matching tasks to the appropriate specialized agent persona in the start skill workflow.

## Core Principle

**Always use the RIGHT agent for the RIGHT job.** Specialized agents have deep domain expertise that produces higher quality output than general-purpose implementation. The start skill's primary responsibility is identifying when to delegate vs when to execute directly.

---

## Agent Type Catalog

### laravel-senior-engineer

**Primary Expertise:**

- Laravel 12.x backend development
- Multi-database architectures (MySQL, Redis, DynamoDB)
- Eloquent ORM, models, relationships
- Queue systems with Horizon
- Service layer patterns
- RESTful API development
- Artisan commands, migrations, seeders
- Laravel-specific testing (PHPUnit, Feature tests)
- Production-ready enterprise applications

**Technology Indicators:**

- File extensions: `*.php`
- Directory patterns: `/app/`, `/routes/`, `/database/`, `/config/`, `/tests/Feature/`
- Framework files: `artisan`, `composer.json` with Laravel dependencies
- Code patterns:
  - `namespace App\Http\Controllers`
  - `use Illuminate\`
  - Eloquent models extending `Model`
  - `Route::` definitions
  - `php artisan` commands
  - Laravel facades (`Cache::`, `Queue::`, `DB::`)

**Task Pattern Triggers:**

- "Build Laravel API endpoint for..."
- "Create Eloquent model for..."
- "Implement queue job for..."
- "Add migration for..."
- "Create service class for..."
- "Write Feature test for..."
- "Set up Horizon queue..."
- "Add Redis caching to..."

**Confidence Scoring:**

- **High (90-100%):** Laravel framework files present, `composer.json` has `laravel/framework`, explicit mention
- **Medium (60-89%):** PHP files in `/app/Http/` or `/app/Models/` structure
- **Low (<60%):** Generic PHP files without Laravel indicators

**When NOT to use:**

- Pure PHP without framework → `general-purpose`
- Magento PHP → `magento-senior-engineer`
- WordPress → `general-purpose` (no WordPress agent)

---

### nextjs-senior-engineer

**Primary Expertise:**

- Next.js 14/15 with App Router
- React Server Components (RSC)
- Server Actions
- Client and server-side rendering strategies
- Streaming patterns
- Advanced caching (revalidation, ISR, static generation)
- API routes and middleware
- Production-ready full-stack applications

**Technology Indicators:**

- File extensions: `*.tsx`, `*.jsx`
- Directory patterns: `/app/`, `/pages/`, `/components/`, `/lib/`
- Framework files: `next.config.js`, `next.config.ts`, `package.json` with `next` dependency
- Code patterns:
  - `'use client'` directive
  - `'use server'` directive
  - `export default function Page()`
  - `export async function generateMetadata()`
  - Server Actions: `export async function someAction()`
  - `useRouter`, `usePathname`, `useSearchParams` from `next/navigation`

**Task Pattern Triggers:**

- "Build Next.js page for..."
- "Create React component for..."
- "Implement server action for..."
- "Add API route for..."
- "Build dashboard/UI for..."
- "Create layout component..."
- "Add streaming for..."
- "Implement caching strategy for..."

**Confidence Scoring:**

- **High (90-100%):** `next.config.*` exists, App Router structure (`/app/`), explicit mention
- **Medium (60-89%):** React/TSX files with Next.js patterns (like `Image` from `next/image`)
- **Low (<60%):** Generic React components without Next.js-specific imports

**When NOT to use:**

- Pure React library → Still use `nextjs-senior-engineer` for component work
- Remix app → `remix-senior-engineer`
- React Native → `expo-react-native-senior-engineer`

---

### nestjs-senior-engineer

**Primary Expertise:**

- NestJS framework with TypeScript
- Dependency injection and modular architecture
- Microservices patterns
- Queue systems (Bull/BullMQ)
- RESTful APIs and GraphQL
- Guards, interceptors, pipes, filters, decorators
- WebSockets and real-time features
- Enterprise-grade server-side applications

**Technology Indicators:**

- File extensions: `*.ts`
- Framework files: `nest-cli.json`, `package.json` with `@nestjs/*` dependencies
- Directory patterns: `/src/`, module-based structure (e.g., `/src/users/`, `/src/auth/`)
- Code patterns:
  - `@Injectable()` decorator
  - `@Controller()` decorator
  - `@Module()` decorator
  - `@Get()`, `@Post()`, etc. route decorators
  - Dependency injection in constructors
  - `import { ... } from '@nestjs/...'`

**Task Pattern Triggers:**

- "Build NestJS module for..."
- "Create service with DI for..."
- "Implement microservice for..."
- "Add queue processor for..."
- "Build GraphQL resolver for..."
- "Create guard for..."
- "Add interceptor for..."
- "Implement WebSocket gateway..."

**Confidence Scoring:**

- **High (90-100%):** `nest-cli.json` exists, `@nestjs/*` in dependencies, NestJS decorators in code
- **Medium (60-89%):** TypeScript with DI patterns but no clear config file
- **Low (<60%):** Generic TypeScript without NestJS indicators

**When NOT to use:**

- Express.js without NestJS → `express-senior-engineer`
- Node.js scripts without framework → `general-purpose`

---

### remix-senior-engineer

**Primary Expertise:**

- Remix full-stack framework
- Loaders and actions (data fetching patterns)
- Progressive enhancement
- Streaming patterns
- Authentication and session management
- Vite integration
- Production-ready applications

**Technology Indicators:**

- File extensions: `*.tsx`, `*.ts`
- Framework files: `remix.config.js`, `vite.config.ts`, `package.json` with `@remix-run/*`
- Directory patterns: `/app/routes/`
- Code patterns:
  - `export async function loader({ request })`
  - `export async function action({ request })`
  - `useLoaderData()` hook
  - `useFetcher()` hook
  - `Form` component from `@remix-run/react`

**Task Pattern Triggers:**

- "Build Remix route for..."
- "Create loader/action for..."
- "Implement form with progressive enhancement..."
- "Add authentication to Remix app..."
- "Create Remix layout..."
- "Add streaming for..."

**Confidence Scoring:**

- **High (90-100%):** `remix.config.*` exists, loader/action patterns, explicit mention
- **Medium (60-89%):** React files with loader-like patterns
- **Low (<60%):** Generic React components

**When NOT to use:**

- Next.js app → `nextjs-senior-engineer`
- Generic React → `nextjs-senior-engineer`

---

### express-senior-engineer

**Primary Expertise:**

- Express.js framework
- Middleware architecture
- RESTful API development
- Queue systems with Bull
- Logging with Pino
- Production-ready Node.js server-side applications

**Technology Indicators:**

- File extensions: `*.js`, `*.ts`
- Dependencies: `package.json` with `express` (but NOT `@nestjs/*`)
- Code patterns:
  - `const express = require('express')` or `import express from 'express'`
  - `app.use()` middleware
  - `app.get()`, `app.post()`, etc. route handlers
  - `express.Router()`
  - `req`, `res`, `next` parameters

**Task Pattern Triggers:**

- "Build Express API for..."
- "Create middleware for..."
- "Add REST endpoint for..."
- "Implement Express route handler for..."
- "Add logging with Pino..."
- "Set up Bull queue in Express..."

**Confidence Scoring:**

- **High (90-100%):** `express` in dependencies, middleware patterns, explicit mention
- **Medium (60-89%):** Node.js HTTP server patterns with Express-like structure
- **Low (<60%):** Generic Node.js without Express indicators

**When NOT to use:**

- NestJS (uses Express internally) → `nestjs-senior-engineer`
- Serverless functions → `general-purpose`

---

### expo-react-native-senior-engineer

**Primary Expertise:**

- Expo React Native development
- Expo Router for navigation
- Expo Modules API
- Cross-platform mobile (iOS/Android/web)
- react-native-logs for logging
- Testing with Jest
- EAS deployment
- Production-ready mobile applications

**Technology Indicators:**

- File extensions: `*.tsx`, `*.jsx`
- Framework files: `app.json` (Expo config), `package.json` with `expo` dependency
- Directory patterns: `/app/` (Expo Router), `/components/`
- Code patterns:
  - `import { ... } from 'expo-...'`
  - `import { ... } from 'react-native'`
  - Expo Router: `useRouter`, `useLocalSearchParams`
  - React Native components: `<View>`, `<Text>`, `<ScrollView>`

**Task Pattern Triggers:**

- "Build mobile screen for..."
- "Create Expo module for..."
- "Implement navigation for..."
- "Add mobile feature for..."
- "Create React Native component..."
- "Add Expo camera integration..."

**Confidence Scoring:**

- **High (90-100%):** `app.json` with Expo config, `expo` in dependencies, explicit mention
- **Medium (60-89%):** React Native imports without clear Expo markers
- **Low (<60%):** Generic React/TypeScript

**When NOT to use:**

- Pure React Native without Expo → `general-purpose` (no pure RN agent)
- Web-only React → `nextjs-senior-engineer`

---

### flutter-senior-engineer

**Primary Expertise:**

- Flutter framework
- Widget composition
- Navigation (GoRouter, Navigator 2.0)
- State management (Riverpod, Provider, Bloc)
- Talker logging
- Testing with flutter_test
- Firebase integration
- Production-ready cross-platform mobile applications

**Technology Indicators:**

- File extensions: `*.dart`
- Framework files: `pubspec.yaml` with Flutter dependencies
- Directory patterns: `/lib/`, `/test/`
- Code patterns:
  - `class MyWidget extends StatelessWidget`
  - `class MyWidget extends StatefulWidget`
  - `@override Widget build(BuildContext context)`
  - Flutter widgets: `Container`, `Column`, `Row`, `Text`

**Task Pattern Triggers:**

- "Build Flutter screen for..."
- "Create widget for..."
- "Implement state management for..."
- "Add navigation for..."
- "Create Flutter layout..."
- "Add Firebase to Flutter app..."

**Confidence Scoring:**

- **High (90-100%):** `pubspec.yaml` with Flutter SDK, `*.dart` files with widget patterns
- **Medium (60-89%):** Dart files without clear Flutter markers
- **Low (<60%):** Generic code

**When NOT to use:**

- Dart backend (without Flutter) → `general-purpose`

---

### magento-senior-engineer

**Primary Expertise:**

- Magento 2 e-commerce
- Module development
- Dependency injection (di.xml)
- Plugins (interceptors) and observers
- Service contracts
- REST/GraphQL APIs
- Monolog logging
- Testing with PHPUnit
- Production-ready e-commerce applications

**Technology Indicators:**

- File extensions: `*.php`, `*.xml`
- Directory patterns: `/app/code/[Vendor]/[Module]/`, `/vendor/magento/`
- Framework files: `registration.php`, `module.xml`, `di.xml`, `composer.json` with Magento dependencies
- Code patterns:
  - `namespace [Vendor]\[Module]\`
  - Magento DI patterns
  - Service contracts: `*Interface` and implementations
  - Plugins: `before*`, `after*`, `around*` methods

**Task Pattern Triggers:**

- "Build Magento module for..."
- "Create plugin for..."
- "Implement service contract for..."
- "Add Magento API endpoint for..."
- "Create observer for..."
- "Add Magento 2 extension..."

**Confidence Scoring:**

- **High (90-100%):** Magento directory structure, `module.xml`, explicit mention
- **Medium (60-89%):** PHP in `/app/code/` with Magento-like namespaces
- **Low (<60%):** Generic PHP

**When NOT to use:**

- Generic PHP → `general-purpose`
- Laravel → `laravel-senior-engineer`

---

### general-purpose

**Primary Expertise:**

- General research and exploration
- Multi-language code analysis
- File system operations
- Tasks not matching specific frameworks
- Configuration file edits
- Documentation generation

**Use When:**

- No framework-specific patterns detected
- Exploratory tasks ("find all instances of...")
- Multi-framework analysis
- Shell scripting
- Simple file operations (typo fixes, config edits)
- Documentation work

**Task Pattern Triggers:**

- "Search for..."
- "Analyze these files..."
- "Explore the codebase..."
- "Generate documentation for..."
- "Find all files matching..."
- "Fix typo in..."

---

## Delegation Decision Tree

### Step 1: Check Task Complexity

```
Is the task trivial? (single-file typo fix, simple read, etc.)
├─ YES → Skip agent delegation, execute directly
└─ NO → Continue to Step 2
```

### Step 2: Identify Technology Stack

```
Scan codebase for technology indicators:
├─ Laravel detected (*.php, /app/, composer.json with laravel/framework)
│  └─ Task involves Laravel work? → laravel-senior-engineer
├─ Next.js detected (next.config.*, /app/ with *.tsx, package.json with next)
│  └─ Task involves Next.js work? → nextjs-senior-engineer
├─ NestJS detected (nest-cli.json, @nestjs/* dependencies)
│  └─ Task involves NestJS work? → nestjs-senior-engineer
├─ Remix detected (remix.config.*, @remix-run/*)
│  └─ Task involves Remix work? → remix-senior-engineer
├─ Express detected (express dependency, but NOT NestJS)
│  └─ Task involves Express work? → express-senior-engineer
├─ Expo detected (app.json, expo dependency)
│  └─ Task involves Expo/React Native work? → expo-react-native-senior-engineer
├─ Flutter detected (pubspec.yaml, *.dart)
│  └─ Task involves Flutter work? → flutter-senior-engineer
├─ Magento detected (/app/code/, module.xml, Magento namespaces)
│  └─ Task involves Magento work? → magento-senior-engineer
└─ No framework detected
   └─ Use general-purpose or Explore agent
```

### Step 3: Assess Task Type

```
What type of work is required?
├─ Feature building (new functionality) → Delegate to specialized agent
├─ Bug fixing/debugging → Delegate to specialized agent
├─ Refactoring → Delegate to specialized agent
├─ Exploration/discovery → Use Explore agent or general-purpose
└─ Simple edits → Execute directly
```

### Step 4: Validate Independence (for parallel work)

```
Are there 3+ independent tasks?
├─ YES → Consider run-parallel-agents-feature-build skill
└─ NO → Delegate to single appropriate agent
```

---

## Matching Algorithm

### Algorithm: Match Task to Agent

```python
def match_agent(task, codebase_context):
    # Step 1: Check for explicit framework mention
    if "Laravel" in task or "Eloquent" in task:
        return "laravel-senior-engineer"
    if "Next.js" in task or "Server Action" in task:
        return "nextjs-senior-engineer"
    if "NestJS" in task or "@nestjs" in task:
        return "nestjs-senior-engineer"
    if "Remix" in task or "loader" in task and "action" in task:
        return "remix-senior-engineer"
    if "Express" in task and "NestJS" not in task:
        return "express-senior-engineer"
    if "Expo" in task or "React Native" in task:
        return "expo-react-native-senior-engineer"
    if "Flutter" in task or "widget" in task:
        return "flutter-senior-engineer"
    if "Magento" in task:
        return "magento-senior-engineer"

    # Step 2: Analyze codebase indicators
    frameworks = detect_frameworks(codebase_context)

    if "laravel" in frameworks:
        return "laravel-senior-engineer"
    if "nextjs" in frameworks:
        return "nextjs-senior-engineer"
    if "nestjs" in frameworks:
        return "nestjs-senior-engineer"
    if "remix" in frameworks:
        return "remix-senior-engineer"
    if "express" in frameworks and "nestjs" not in frameworks:
        return "express-senior-engineer"
    if "expo" in frameworks:
        return "expo-react-native-senior-engineer"
    if "flutter" in frameworks:
        return "flutter-senior-engineer"
    if "magento" in frameworks:
        return "magento-senior-engineer"

    # Step 3: Default to general-purpose
    return "general-purpose"

def detect_frameworks(codebase_context):
    frameworks = []

    # File-based detection
    if "next.config.js" in codebase_context or "next.config.ts" in codebase_context:
        frameworks.append("nextjs")
    if "nest-cli.json" in codebase_context:
        frameworks.append("nestjs")
    if "remix.config.js" in codebase_context:
        frameworks.append("remix")
    if "composer.json" in codebase_context and "laravel/framework" in codebase_context:
        frameworks.append("laravel")
    if "app.json" in codebase_context and "expo" in codebase_context:
        frameworks.append("expo")
    if "pubspec.yaml" in codebase_context and "flutter" in codebase_context:
        frameworks.append("flutter")
    if "module.xml" in codebase_context or "/app/code/" in codebase_context:
        frameworks.append("magento")
    if "package.json" in codebase_context and "express" in codebase_context:
        if "nestjs" not in frameworks:
            frameworks.append("express")

    return frameworks
```

---

## Multi-Agent Scenarios

### Scenario 1: Full-Stack Feature

**User Request:** "Build user profile with backend API and frontend page"

**Analysis:**

- Backend API → Identify backend framework (Laravel, NestJS, Express)
- Frontend page → Identify frontend framework (Next.js, Remix)

**Decision:**

- If 2 independent parts → Use `run-parallel-agents-feature-build`
- Split into:
  - Backend agent (framework-specific)
  - Frontend agent (framework-specific)

### Scenario 2: Multi-Framework Codebase

**User Request:** "Fix authentication across the stack"

**Analysis:**

- Authentication touches: Laravel backend + Next.js frontend
- Are they independent fixes or interconnected?

**Decision:**

- If interconnected (shared logic) → Sequential fixes, start with backend
- If independent bugs → Parallel agents

### Scenario 3: Exploration Task

**User Request:** "Find all API endpoints in the codebase"

**Analysis:**

- Discovery task, spans multiple potential frameworks
- Not building/fixing, just exploring

**Decision:**

- Use `Explore` agent with `subagent_type=Explore`
- NOT a specialized framework agent

---

## Edge Cases

### Edge Case 1: Ambiguous File Extensions

**Problem:** TypeScript (`.ts`, `.tsx`) used by Next.js, Remix, NestJS, Express, Expo

**Solution Priority:**

1. Check for framework config files
2. Examine directory structure
3. Look at import statements
4. Default to most common in project

**Example:**

```
File: src/components/Button.tsx

Indicators to check:
- Is there a next.config.js? → Next.js
- Is there a nest-cli.json? → NestJS
- Is there a remix.config.js? → Remix
- Is there an app.json with Expo? → Expo
- None? → Check imports for 'next/*', '@nestjs/*', '@remix-run/*', 'expo'
```

### Edge Case 2: Mixed Technology Project

**Problem:** Project has Laravel backend AND Next.js frontend in same repo

**Solution:**

- Identify which part the task targets based on:
  - File paths mentioned
  - Keywords in request ("API" → backend, "page" → frontend)
  - Explicit user mention

**Example:**

```
User: "Add user authentication"
Ambiguous! Could be:
- Laravel API authentication
- Next.js frontend auth UI
- Both

→ Use AskUserQuestion to clarify
```

### Edge Case 3: Unknown Framework

**Problem:** Framework not in catalog (e.g., SvelteKit, Nuxt.js, Django)

**Solution:**

- Use `general-purpose` agent
- Mention limitation to user
- Provide best-effort support

### Edge Case 4: Pure Language Without Framework

**Problem:** Raw PHP, raw TypeScript, raw Dart without framework

**Solution:**

- Use `general-purpose` agent
- Still effective for non-framework-specific work

---

## Confidence Scoring System

When matching agents, assign confidence:

### High Confidence (90-100%)

- Framework config file exists
- Explicit user mention of framework
- Clear code patterns match framework
- **Action:** Confidently delegate to specialized agent

### Medium Confidence (60-89%)

- File patterns suggest framework
- Directory structure matches
- Some code patterns present
- **Action:** Delegate but mention assumption to user

### Low Confidence (30-59%)

- Weak indicators
- Could be multiple frameworks
- **Action:** Use AskUserQuestion to clarify OR use general-purpose

### Very Low (<30%)

- No clear indicators
- **Action:** Use general-purpose

---

## Delegation Brief Template

When delegating to a specialized agent, use this template:

```
Task: [Brief description]

Technology Stack: [Framework identified]

Context:
- Existing patterns: [What you discovered in codebase exploration]
- Related files: [Relevant file paths]
- Dependencies: [What systems this interacts with]

Requirements:
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]

Expected Output:
- [Deliverable 1]
- [Deliverable 2]

Success Criteria:
- [How to verify completion]
- [Test requirements]
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Doing Specialized Work Yourself

**Wrong:**

```
User: "Build Laravel API endpoint"
Assistant: *Writes Laravel code directly without delegating*
```

**Right:**

```
User: "Build Laravel API endpoint"
Assistant: *Identifies Laravel, delegates to laravel-senior-engineer*
```

**Why:** Specialized agents have deep expertise that produces better results.

---

### Anti-Pattern 2: Using Wrong Agent

**Wrong:**

```
User: "Fix NestJS service"
Assistant: *Delegates to express-senior-engineer (both Node.js)*
```

**Right:**

```
User: "Fix NestJS service"
Assistant: *Correctly identifies NestJS, delegates to nestjs-senior-engineer*
```

**Why:** Framework-specific patterns and best practices differ significantly.

---

### Anti-Pattern 3: Skipping Agent for "Simple" Tasks

**Wrong:**

```
User: "Add simple Laravel validation rule"
Assistant: "This is simple, I'll do it directly"
```

**Right:**

```
User: "Add simple Laravel validation rule"
Assistant: *Still delegates to laravel-senior-engineer for framework expertise*
```

**Why:** Even "simple" tasks benefit from domain expertise and pattern knowledge.

---

### Anti-Pattern 4: Ignoring Multiple Frameworks

**Wrong:**

```
User: "Fix auth in Laravel backend and Next.js frontend"
Assistant: *Tries to do both without recognizing it's two different domains*
```

**Right:**

```
User: "Fix auth in Laravel backend and Next.js frontend"
Assistant: *Recognizes two frameworks, splits into parallel agents or sequential fixes*
```

**Why:** Different frameworks require different expertise.

---

## Quick Reference: Agent Selection Checklist

Before delegating, verify:

- [ ] I have identified the technology stack correctly
- [ ] I have selected the appropriate specialized agent from the catalog
- [ ] I have gathered sufficient context to brief the agent
- [ ] I have created a clear, comprehensive brief for the agent
- [ ] I have established success criteria for the agent's work
- [ ] If multiple agents are needed, I have determined if they can work in parallel

---

## Summary

**Key Principles:**

1. Always use the RIGHT agent for the RIGHT job
2. Specialized agents produce higher quality than general implementation
3. Match based on: explicit mention > framework files > code patterns > defaults
4. When in doubt, use AskUserQuestion to clarify
5. Simple edits can be done directly, but complex framework work should be delegated
6. Context gathering is mandatory before delegation

**Decision Flow:**

1. Identify task complexity
2. Scan for technology indicators
3. Match to agent catalog
4. Assess confidence level
5. Delegate with comprehensive brief
6. Review and aggregate results
