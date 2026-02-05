# Agent Brief Templates

Complete brief templates for each specialized agent type. Use these when creating briefs in `plan-enhanced`.

## Brief Structure

Every brief should include:

```markdown
**Agent:** `[agent-type]`

**Brief:**
- **Scope:** [Exactly what to build/fix/analyze]
- **Files:** [Relevant file paths or patterns]
- **Context:** [Existing patterns, constraints, related code]
- **Output:** [Expected deliverables]
- **Success criteria:** [How to verify completion]
```

---

## Laravel Senior Engineer

**Agent:** `laravel-senior-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [API endpoint / Model / Service / Migration / Controller]
- **Files:**
  - Controllers: app/Http/Controllers/
  - Models: app/Models/
  - Routes: routes/api.php or routes/web.php
  - Migrations: database/migrations/
  - Services: app/Services/
- **Context:**
  - Existing auth: [JWT / Sanctum / Passport]
  - Database: [MySQL / PostgreSQL]
  - Patterns: [Repository pattern? Service layer?]
- **Output:**
  - [ ] Controller with [methods]
  - [ ] Model with [relationships]
  - [ ] Migration for [table]
  - [ ] Tests in tests/Feature/
- **Success criteria:**
  - PHPUnit tests pass
  - Endpoint returns correct response
  - Follows existing code patterns
```

**Example:**

```markdown
**Agent:** `laravel-senior-engineer`

**Brief:**
- **Scope:** Build wishlist API with CRUD operations
- **Files:**
  - app/Http/Controllers/WishlistController.php
  - app/Models/Wishlist.php
  - routes/api.php
  - database/migrations/create_wishlists_table.php
- **Context:**
  - Auth: Sanctum tokens
  - Existing UserController pattern
  - Uses soft deletes
- **Output:**
  - [ ] WishlistController with index, store, destroy
  - [ ] Wishlist model with user relationship
  - [ ] Migration with user_id, product_id, timestamps
- **Success criteria:**
  - Tests in tests/Feature/WishlistTest.php pass
  - API returns { success: true, data: [...] }
```

---

## Next.js Senior Engineer

**Agent:** `nextjs-senior-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [Page / Component / API Route / Server Action]
- **Files:**
  - Pages: app/[route]/page.tsx
  - Components: components/[name].tsx
  - API: app/api/[route]/route.ts
  - Actions: app/actions/[name].ts
- **Context:**
  - Router: [App Router / Pages Router]
  - Styling: [Tailwind / CSS Modules / styled-components]
  - State: [React Query / SWR / Zustand]
- **Output:**
  - [ ] Page component at [route]
  - [ ] [N] child components
  - [ ] Types in types/[name].ts
- **Success criteria:**
  - TypeScript compiles without errors
  - Component renders correctly
  - Follows existing component patterns
```

**Example:**

```markdown
**Agent:** `nextjs-senior-engineer`

**Brief:**
- **Scope:** Build checkout summary page with cart total, shipping options
- **Files:**
  - app/checkout/summary/page.tsx
  - components/checkout/CartSummary.tsx
  - components/checkout/ShippingOptions.tsx
- **Context:**
  - App Router with RSC
  - Tailwind for styling
  - React Query for data fetching
- **Output:**
  - [ ] Summary page with cart display
  - [ ] CartSummary component
  - [ ] ShippingOptions selector
- **Success criteria:**
  - Page loads without hydration errors
  - Cart total calculates correctly
  - Mobile responsive
```

---

## NestJS Senior Engineer

**Agent:** `nestjs-senior-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [Module / Controller / Service / Guard / Interceptor]
- **Files:**
  - Module: src/[module]/[module].module.ts
  - Controller: src/[module]/[module].controller.ts
  - Service: src/[module]/[module].service.ts
  - DTOs: src/[module]/dto/*.dto.ts
- **Context:**
  - Database: [TypeORM / Prisma / Mongoose]
  - Auth: [JWT / Passport strategy]
  - Existing modules: [list]
- **Output:**
  - [ ] Module with imports/exports
  - [ ] Controller with endpoints
  - [ ] Service with business logic
  - [ ] DTOs with validation
- **Success criteria:**
  - E2E tests pass
  - Swagger documentation generated
  - DI container resolves correctly
```

---

## Express Senior Engineer

**Agent:** `express-senior-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [Route / Middleware / Controller / Service]
- **Files:**
  - Routes: src/routes/[name].routes.ts
  - Controllers: src/controllers/[name].controller.ts
  - Services: src/services/[name].service.ts
  - Middleware: src/middleware/[name].middleware.ts
- **Context:**
  - Express version: [4.x / 5.x]
  - Validation: [Joi / Zod / express-validator]
  - Logging: [Winston / Pino]
- **Output:**
  - [ ] Route with [endpoints]
  - [ ] Controller with handlers
  - [ ] Service layer
- **Success criteria:**
  - All endpoints return correct status codes
  - Validation errors handled
  - Error middleware catches exceptions
```

---

## DevOps AWS Senior Engineer

**Agent:** `devops-aws-senior-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [Lambda / API Gateway / ECS / S3 / CloudFront / CDK Stack]
- **Files:**
  - CDK: lib/[stack-name]-stack.ts
  - Lambda: lambda/[function-name]/index.ts
  - Config: cdk.json, .env
- **Context:**
  - CDK version: [v2]
  - Region: [us-east-1 / etc]
  - Existing stacks: [list]
- **Output:**
  - [ ] CDK stack with [resources]
  - [ ] Lambda functions
  - [ ] IAM roles and policies
- **Success criteria:**
  - cdk synth succeeds
  - cdk deploy completes
  - Resources accessible
```

---

## DevOps Docker Senior Engineer

**Agent:** `devops-docker-senior-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [Dockerfile / docker-compose / Multi-stage build]
- **Files:**
  - Dockerfile: ./Dockerfile
  - Compose: docker-compose.yml
  - Config: .dockerignore
- **Context:**
  - Base image: [node:18-alpine / php:8.2-fpm / etc]
  - Services: [app, db, redis, nginx]
  - Environment: [dev / staging / prod]
- **Output:**
  - [ ] Optimized Dockerfile
  - [ ] docker-compose with services
  - [ ] Health checks configured
- **Success criteria:**
  - docker compose up succeeds
  - Container health checks pass
  - Image size optimized
```

---

## Expo React Native Engineer

**Agent:** `expo-react-native-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [Screen / Component / Navigation / Native Module]
- **Files:**
  - Screens: app/[route].tsx or src/screens/[name].tsx
  - Components: src/components/[name].tsx
  - Navigation: src/navigation/[name].tsx
- **Context:**
  - Expo SDK: [51 / 52]
  - Navigation: [Expo Router / React Navigation]
  - Styling: [StyleSheet / NativeWind]
- **Output:**
  - [ ] Screen component
  - [ ] Navigation configured
  - [ ] Platform-specific handling
- **Success criteria:**
  - expo start succeeds
  - Runs on iOS and Android
  - No Expo warnings
```

---

## Flutter Senior Engineer

**Agent:** `flutter-senior-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [Screen / Widget / Provider / Repository]
- **Files:**
  - Screens: lib/screens/[name]_screen.dart
  - Widgets: lib/widgets/[name]_widget.dart
  - Providers: lib/providers/[name]_provider.dart
- **Context:**
  - State management: [Provider / Riverpod / Bloc]
  - Navigation: [GoRouter / Navigator 2.0]
  - Packages: [list from pubspec.yaml]
- **Output:**
  - [ ] Screen widget
  - [ ] State management
  - [ ] Unit tests
- **Success criteria:**
  - flutter analyze passes
  - flutter test passes
  - Runs on iOS and Android
```

---

## Magento Senior Engineer

**Agent:** `magento-senior-engineer`

**Template:**

```markdown
**Brief:**
- **Scope:** [Module / Block / Controller / Model / Plugin]
- **Files:**
  - Module: app/code/[Vendor]/[Module]/
  - Controller: [Module]/Controller/[path].php
  - Block: [Module]/Block/[name].php
  - Plugin: [Module]/Plugin/[name].php
- **Context:**
  - Magento version: [2.4.x]
  - Area: [frontend / adminhtml / webapi]
  - Existing modules: [list]
- **Output:**
  - [ ] registration.php and module.xml
  - [ ] Controller/Model/Block files
  - [ ] di.xml configuration
- **Success criteria:**
  - bin/magento setup:upgrade succeeds
  - No compilation errors
  - Module appears in module list
```

---

## General Purpose Agent

**Agent:** `general-purpose`

**Template:**

```markdown
**Brief:**
- **Scope:** [Research / Analysis / Documentation / Cross-cutting task]
- **Files:** [Relevant paths]
- **Context:** [Background info]
- **Output:**
  - [ ] [Deliverable 1]
  - [ ] [Deliverable 2]
- **Success criteria:**
  - [Verification method]
```

---

## Explore Agent

**Agent:** `Explore`

**Template:**

```markdown
**Brief:**
- **Scope:** [Codebase discovery / Pattern search / File investigation]
- **Search for:**
  - Files matching: [pattern]
  - Code containing: [pattern]
  - Patterns related to: [topic]
- **Context:** [Why exploring]
- **Output:**
  - [ ] List of relevant files
  - [ ] Summary of patterns found
  - [ ] Recommendations
- **Success criteria:**
  - Files identified
  - Patterns documented
```

---

## Plan Agent

**Agent:** `Plan`

**Template:**

```markdown
**Brief:**
- **Scope:** [Architecture design / Implementation strategy / Trade-off analysis]
- **Design for:**
  - Feature: [name]
  - Constraints: [list]
  - Goals: [list]
- **Context:** [Existing architecture]
- **Output:**
  - [ ] Architecture recommendation
  - [ ] Implementation approach
  - [ ] Risk assessment
- **Success criteria:**
  - Clear recommendation
  - Trade-offs documented
  - Actionable next steps
```

---

## Brief Quality Checklist

Before using a brief, verify:

```
☐ Scope is specific, not generic ("build X" not "implement feature")
☐ Files list actual paths, not placeholders
☐ Context includes relevant existing patterns
☐ Output has concrete, checkable items
☐ Success criteria are verifiable
```

## Common Brief Mistakes

| Mistake | Fix |
|---------|-----|
| "Implement the feature" | Specify exactly what to build |
| "Files: TBD" | List actual file paths |
| No success criteria | Add testable verification |
| Missing context | Include existing patterns/tech |
| Too broad scope | Break into smaller briefs |
