# Framework-Specific Rules

## Next.js

```yaml
permissions:
  auto-approve-next:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "next"
    decision: allow

preconditions:
  warn-app-router-convention:
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "app/**/page.tsx"
    message: "Page files must export default. Check naming conventions."
    priority: 70
```

## NestJS

```yaml
permissions:
  auto-approve-nest:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "nest"
    decision: allow

preconditions:
  warn-module-changes:
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "**/*.module.ts"
    message: "Module changes affect dependency injection. Verify imports/exports."
    priority: 70
```

## Laravel

```yaml
permissions:
  auto-approve-artisan:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "php artisan"
    decision: allow

  block-migrate-fresh:
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "artisan migrate:fresh"
    decision: deny
    message: "migrate:fresh drops all tables. Use migrate instead."

  block-db-wipe:
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "artisan db:wipe"
    decision: deny
    message: "db:wipe destroys the database."

postconditions:
  migrate-after-migration:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "database/migrations/*.php"
    run: "php artisan migrate"
    timeout: 30000
    enabled: false
```

## Django

```yaml
permissions:
  auto-approve-manage:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "python manage.py"
    decision: allow

  block-flush:
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "manage.py flush"
    decision: deny
    message: "manage.py flush deletes all data."

postconditions:
  makemigrations:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "**/models.py"
    run: "python manage.py makemigrations"
    timeout: 30000
    enabled: false
```

## FastAPI

```yaml
permissions:
  auto-approve-uvicorn:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "uvicorn"
    decision: allow

preconditions:
  warn-schema-changes:
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "**/schemas.py"
    message: "Schema changes may affect API contracts."
    priority: 70
```

## Rails

```yaml
permissions:
  auto-approve-rails:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "rails"
    decision: allow

  block-db-drop:
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "rails db:drop"
    decision: deny
    message: "rails db:drop destroys the database."

postconditions:
  db-migrate:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "db/migrate/*.rb"
    run: "rails db:migrate"
    timeout: 30000
    enabled: false
```

## Prisma

```yaml
permissions:
  auto-approve-prisma:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "prisma"
    decision: allow

  block-prisma-reset:
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "prisma migrate reset"
    decision: deny
    message: "prisma migrate reset is destructive. Use prisma migrate dev."

postconditions:
  prisma-generate:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "prisma/schema.prisma"
    run: "npx prisma generate"
    timeout: 30000
    enabled: false
```

## Drizzle

```yaml
permissions:
  auto-approve-drizzle:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "drizzle-kit"
    decision: allow

postconditions:
  drizzle-generate:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "**/schema.ts"
    run: "npx drizzle-kit generate"
    timeout: 30000
    enabled: false
```

## Vitest

```yaml
permissions:
  auto-approve-vitest:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "vitest"
    decision: allow
```

## Jest

```yaml
permissions:
  auto-approve-jest:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "jest"
    decision: allow
```

## ESLint

```yaml
permissions:
  auto-approve-eslint:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "eslint"
    decision: allow
```

## Prettier

```yaml
permissions:
  auto-approve-prettier:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "prettier"
    decision: allow
```

## Biome

```yaml
permissions:
  auto-approve-biome:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "biome"
    decision: allow
```

## TypeScript (tsup/tsc)

```yaml
permissions:
  auto-approve-tsc:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "tsc"
    decision: allow

  auto-approve-tsup:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "tsup"
    decision: allow
```

## Vite

```yaml
permissions:
  auto-approve-vite:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "vite"
    decision: allow
```

## Turborepo

```yaml
permissions:
  auto-approve-turbo:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "turbo"
    decision: allow
```
