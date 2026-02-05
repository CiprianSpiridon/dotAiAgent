# Debug Patterns Reference

This document provides comprehensive error pattern recognition, debugging strategies for each framework, and root cause analysis techniques for parallel debugging scenarios.

## Error Pattern Recognition

### Test Failure Patterns

#### Laravel PHPUnit Tests

**Common Patterns:**

```
Failed asserting that false is true
Class 'DatabaseSeeder' not found
SQLSTATE[HY000] [2002] Connection refused
This action is unauthorized
Column not found: 1054 Unknown column
```

**Root Causes:**

- Database seeding issues (missing factories, seeders)
- Database connection problems (wrong credentials, service not running)
- Authorization/policy failures
- Migration not run
- Eloquent relationship misconfiguration

**Agent Match:** `laravel-senior-engineer`

---

#### Next.js Jest/Vitest Tests

**Common Patterns:**

```
Cannot read properties of undefined (reading 'map')
Component did not render
Hydration failed because the initial UI does not match
Mock function not called
Snapshot test failed
```

**Root Causes:**

- Missing mock data or incorrect structure
- Component props not matching expectations
- Server/client hydration mismatch
- Async data not resolved before assertions
- Snapshot outdated after component changes

**Agent Match:** `nextjs-senior-engineer`

---

#### NestJS E2E/Unit Tests

**Common Patterns:**

```
Nest can't resolve dependencies
Cannot GET /api/endpoint
Unexpected token < in JSON at position 0
Guard returned false
Module not found
```

**Root Causes:**

- Dependency injection configuration missing
- Route not properly registered
- Response format mismatch (HTML instead of JSON)
- Guard/interceptor blocking request
- Module import missing from test module

**Agent Match:** `nestjs-senior-engineer`

---

### Runtime Error Patterns

#### Laravel Runtime Errors

**Common Patterns:**

```
Class 'App\Models\User' not found
Call to a member function on null
Too few arguments to function
SQLSTATE[42S02]: Base table or view not found
419 Page Expired (CSRF token mismatch)
```

**Root Causes:**

- Autoloader cache needs refresh (`composer dump-autoload`)
- Null check missing (relationship returns null)
- Method signature changed but call sites not updated
- Missing migration
- CSRF protection blocking request

**Agent Match:** `laravel-senior-engineer`

---

#### React/Next.js Runtime Errors

**Common Patterns:**

```
Hydration failed
Maximum update depth exceeded
Cannot update during an existing state transition
'X' is not defined
Objects are not valid as a React child
```

**Root Causes:**

- Server/client state mismatch
- Infinite re-render loop (setState in render)
- State update during render phase
- Missing import or typo
- Attempting to render object instead of primitive

**Agent Match:** `nextjs-senior-engineer`

---

#### NestJS Runtime Errors

**Common Patterns:**

```
Cannot find module '@nestjs/...'
Circular dependency detected
Provider not found
Invalid JSON response
Connection timeout
```

**Root Causes:**

- Missing package installation
- Circular module imports (A imports B, B imports A)
- Provider not added to module's providers array
- Response serialization issue
- External service unavailable or slow

**Agent Match:** `nestjs-senior-engineer`

---

### TypeScript Compilation Errors

#### Type Error Patterns

**Laravel/PHP:** (N/A - PHP is dynamically typed)

**Next.js TypeScript:**

```
Property 'X' does not exist on type 'Y'
Type 'null' is not assignable to type 'string'
Argument of type 'X' is not assignable to parameter of type 'Y'
Cannot find name 'React'
```

**Root Causes:**

- Missing type definition for prop
- Null/undefined not handled (use optional chaining or type guards)
- Type mismatch (wrong type passed to function/component)
- Missing import

**Agent Match:** `nextjs-senior-engineer`

---

**NestJS TypeScript:**

```
Decorator '@Injectable()' is not valid here
Type 'Promise<X>' is missing 'then' method
Cannot find module '@nestjs/...'
Circular dependency in types
```

**Root Causes:**

- Decorator on wrong target (class vs method)
- Async function not marked properly
- Missing dependency
- Type import circular dependency

**Agent Match:** `nestjs-senior-engineer`

---

**Express TypeScript:**

```
Property 'user' does not exist on type 'Request'
No overload matches this call
'req' implicitly has type 'any'
```

**Root Causes:**

- Need to extend Express Request type
- Middleware type definition incorrect
- Missing @types/express or @types/node

**Agent Match:** `express-senior-engineer`

---

### Performance Issues

#### Backend Performance (Laravel/NestJS/Express)

**Indicators:**

```
Response time > 2s
Database query count > 50 for single request
Memory usage growing unbounded
CPU spike on specific endpoint
```

**Common Causes:**

- **N+1 query problem** (missing eager loading in Laravel)
- **Missing database indexes** (full table scans)
- **Memory leak** (not releasing resources)
- **Synchronous I/O** (should be async)
- **No caching** (repeated expensive computations)

**Debugging Approach:**

1. Profile with Laravel Telescope, NestJS built-in profiler, or Node profiler
2. Check query count and execution time
3. Analyze database EXPLAIN for slow queries
4. Monitor memory usage over time
5. Identify blocking I/O operations

**Agent Match:** Framework-specific (`laravel-senior-engineer`, `nestjs-senior-engineer`, `express-senior-engineer`)

---

#### Frontend Performance (Next.js/React)

**Indicators:**

```
First Contentful Paint > 2s
Cumulative Layout Shift > 0.1
Large bundle size (>500KB)
Slow component renders (>100ms)
```

**Common Causes:**

- **Unnecessary re-renders** (missing memoization)
- **Large bundle** (not code-splitting)
- **Unoptimized images** (not using Next.js Image)
- **Blocking JavaScript** (not deferring non-critical code)
- **Heavy computations** in render (should be useMemo)

**Debugging Approach:**

1. Use React DevTools Profiler
2. Check bundle analyzer for large dependencies
3. Lighthouse audit for Core Web Vitals
4. Identify components re-rendering unnecessarily
5. Check for blocking network requests

**Agent Match:** `nextjs-senior-engineer`

---

## Framework-Specific Debugging Strategies

### Laravel Debugging Strategy

**Step 1: Gather Context**

- Check error message and stack trace
- Review recent migrations and model changes
- Check `.env` configuration
- Review logs in `storage/logs/`

**Step 2: Isolate the Issue**

- Can you reproduce with `php artisan tinker`?
- Does it fail in specific environment only?
- Is it related to database, cache, or queue?

**Step 3: Common Fixes**

- Refresh autoloader: `composer dump-autoload`
- Clear caches: `php artisan cache:clear`, `config:clear`, `view:clear`
- Run migrations: `php artisan migrate`
- Re-seed database: `php artisan db:seed`

**Step 4: Deep Dive**

- Add `dd()` or `Log::debug()` at key points
- Use Laravel Telescope for request tracing
- Check database queries with Query Log
- Review authorization policies if 403 errors

---

### Next.js Debugging Strategy

**Step 1: Gather Context**

- Check browser console for client-side errors
- Check terminal for server-side errors
- Review Network tab for failed requests
- Check React DevTools for component tree

**Step 2: Isolate the Issue**

- Is it client-side or server-side?
- Does it happen during build or runtime?
- Is it related to data fetching or rendering?

**Step 3: Common Fixes**

- Clear `.next` directory: `rm -rf .next`
- Restart dev server
- Check if data fetching is working (server actions, API routes)
- Verify environment variables are loaded
- Check for hydration mismatches (server vs client state)

**Step 4: Deep Dive**

- Add `console.log` in server/client components appropriately
- Use React DevTools Profiler for render issues
- Check Network tab for API failures
- Use Next.js built-in error overlay for diagnostics

---

### NestJS Debugging Strategy

**Step 1: Gather Context**

- Check terminal for exceptions
- Review module dependency graph
- Check logs (if using Pino or Winston)
- Review API response format

**Step 2: Isolate the Issue**

- Is it a DI problem? (providers, modules)
- Is it a routing issue? (controllers, guards)
- Is it a data problem? (DTOs, validation)
- Is it external dependency? (database, API)

**Step 3: Common Fixes**

- Check provider is added to module's `providers` array
- Verify imports in module's `imports` array
- Check for circular dependencies
- Restart NestJS app (may need to clear dist/)
- Verify environment variables loaded

**Step 4: Deep Dive**

- Add `Logger` calls at key points
- Use NestJS REPL for testing: `npm run start -- --entryFile repl`
- Enable debug mode in `main.ts`
- Check exception filters and interceptors
- Review guard/middleware logic

---

### Express Debugging Strategy

**Step 1: Gather Context**

- Check terminal for console errors
- Review middleware stack order
- Check request/response logs
- Verify route registration

**Step 2: Isolate the Issue**

- Does middleware pass control correctly (`next()`)?
- Is route handler registered before wildcard routes?
- Is request body parsed (body-parser)?
- Are CORS headers set correctly?

**Step 3: Common Fixes**

- Add `console.log` in middleware chain
- Verify middleware order (auth before protected routes)
- Check body-parser is configured
- Verify error handling middleware is last

**Step 4: Deep Dive**

- Use `morgan` for HTTP request logging
- Add debug logs in each middleware
- Test with curl/Postman to isolate client issues
- Check async/await error handling (use try-catch or `.catch()`)

---

## Root Cause Analysis Techniques

### Single vs Multiple Root Causes

**Indicators of Single Root Cause:**

- All failures started at the same time
- All errors mention the same dependency/module
- All stack traces share common code path
- Recent single change (commit, deploy, dependency update)

**Example:**

```
Scenario: All tests failing after npm install

Error patterns:
- Laravel tests: "Cannot connect to database"
- Next.js tests: "Cannot connect to database"
- NestJS tests: "Cannot connect to database"

Analysis: Single root cause (database service not running)
Decision: DON'T parallelize. Fix database connection first.
```

---

**Indicators of Multiple Independent Root Causes:**

- Failures in unrelated subsystems
- Different error messages/patterns
- Different stack traces with no commonality
- Isolated to specific modules/features

**Example:**

```
Scenario: Multiple test failures

Error patterns:
- Laravel tests: "Missing factory trait in User test"
- Next.js tests: "Mock data has wrong shape for Product"
- NestJS tests: "Async timeout in Payment service"

Analysis: Three independent issues in different subsystems
Decision: CAN parallelize. Each has different root cause.
```

---

### Dependency Analysis

**Questions to Ask:**

1. If I fix issue A, will issue B automatically resolve?
2. Does issue B require the fix from issue A to work?
3. Do A and B modify the same files/database/state?

**Dependency Matrix:**

| Issue A                  | Issue B                    | Dependent?              | Can Parallelize? |
| ------------------------ | -------------------------- | ----------------------- | ---------------- |
| Laravel DB schema change | Next.js uses old schema    | Yes (B depends on A)    | ❌ No            |
| Laravel auth bug         | Next.js UI bug             | No                      | ✅ Yes           |
| Shared util function bug | Multiple components use it | Yes (shared root cause) | ❌ No            |
| Bug in module X          | Bug in module Y            | No (isolated modules)   | ✅ Yes           |

---

### Clustering Algorithm

**Step 1: Extract Error Metadata**
For each error, extract:

- Framework/tech stack
- Subsystem/module
- Error type (test failure, runtime error, type error, performance)
- Affected files

**Step 2: Group by Similarity**
Create clusters based on:

- Same tech stack AND same subsystem → Likely related, investigate together
- Different tech stack → Likely independent, can parallelize
- Same file/function → Likely related, investigate together
- Different modules with no overlap → Likely independent

**Step 3: Validate Independence**
For each cluster pair, verify:

- [ ] No shared files being modified
- [ ] No data dependencies
- [ ] No sequential ordering required
- [ ] No common root cause

**Step 4: Decision**

- If 3+ independent clusters → Proceed with parallel debugging
- If < 3 clusters OR clusters are related → Sequential debugging

---

## Common Pitfalls in Parallel Debugging

### Pitfall 1: Missing Shared Root Cause

**Scenario:**

```
Error 1: Laravel API returns 500
Error 2: Next.js fetch fails
Error 3: NestJS webhook fails
```

**Assumption:** Three independent issues (different services)

**Reality:** All three fail because shared Redis cache is down

**Lesson:** Always check shared dependencies (database, cache, external APIs) before parallelizing

---

### Pitfall 2: Cascading Failures

**Scenario:**

```
Error 1: Database migration failed
Error 2: API tests fail (missing table)
Error 3: Frontend tests fail (API returns 500)
```

**Assumption:** Three separate issues

**Reality:** All stem from migration failure (Error 1)

**Lesson:** Fix foundational issues (DB, infrastructure) before debugging application logic

---

### Pitfall 3: Overlapping File Changes

**Scenario:**

```
Bug 1: Cart total calculation wrong (CartService.php)
Bug 2: Discount logic broken (CartService.php)
```

**Assumption:** Two separate bugs

**Reality:** Both agents modify CartService.php → merge conflict

**Lesson:** Check file overlap before parallelizing. If same file, consider sequential or manual coordination

---

### Pitfall 4: Ignoring Integration

**Scenario:**

```
Fix 1: Laravel returns new API response format
Fix 2: Next.js expects old API response format
```

**Result:** Both fixes work independently but break when integrated

**Lesson:** After parallel fixes, always run integration tests to verify fixes work together

---

## Validation Checklist Template

Use this checklist after parallel debugging to ensure quality:

### Per-Fix Validation

For each fix:

- [ ] Original error no longer reproduces
- [ ] Unit tests pass
- [ ] No new errors introduced
- [ ] Code follows project patterns
- [ ] Performance not degraded

### Integration Validation

For all fixes together:

- [ ] No file conflicts
- [ ] No contradictory changes
- [ ] Full test suite passes (not just fixed tests)
- [ ] Integration tests pass
- [ ] Manual smoke testing complete

### Documentation

- [ ] Fix documented (what was wrong, why, how fixed)
- [ ] If pattern issue, document prevention strategy
- [ ] Update relevant documentation if needed

---

## Advanced Debugging Patterns

### Pattern 1: Bisecting Parallel Failures

When facing many failures (e.g., 20+ test failures):

1. **Quick triage:** Group into categories
2. **Fix easy wins first:** Obvious issues (missing imports, typos)
3. **Identify patterns:** Are 10 failures all in auth? Might be shared root cause
4. **Parallelize remainder:** After pattern analysis, parallelize truly independent issues

---

### Pattern 2: Progressive Parallelization

Start sequential, then parallelize:

1. **Fix first issue** (understand the codebase)
2. **Assess impact** (did it fix multiple issues?)
3. **Identify remaining independent issues**
4. **Parallelize remaining** (now with context from first fix)

Useful when initial error state is unclear.

---

### Pattern 3: Parallel Investigation, Sequential Fix

Use parallel agents for investigation, then apply fixes sequentially:

1. **Launch parallel diagnostic agents** (gather information only)
2. **Aggregate findings** (identify root causes)
3. **Plan fix order** (based on dependencies discovered)
4. **Apply fixes sequentially or in parallel** (as appropriate)

Useful for complex, interconnected issues where you need full picture first.

---

## Framework-Specific Error Codes Quick Reference

### Laravel HTTP Status Codes

- `419` → CSRF token mismatch
- `403` → Authorization failed (policy/gate)
- `500` → Server error (check logs)
- `404` → Route not found or model not found

### Next.js Build Errors

- `ENOENT` → File not found
- `Module not found` → Import path wrong or missing dependency
- `Hydration error` → Server/client mismatch
- `Error: Minified React error` → Check React error decoder

### NestJS Exception Filters

- `NotFoundException` → Resource not found
- `UnauthorizedException` → Auth guard blocked request
- `BadRequestException` → Validation failed
- `InternalServerErrorException` → Unhandled exception

---

## Recommended Debugging Tools by Framework

### Laravel

- **Laravel Telescope:** Request tracing, query monitoring
- **Debugbar:** In-browser debugging info
- **Tinker:** REPL for testing code
- **dd() / dump():** Quick variable inspection
- **Log::debug():** Logging
- **EXPLAIN:** Database query analysis

### Next.js

- **React DevTools:** Component tree inspection
- **Next.js Error Overlay:** Build-time errors
- **Network Tab:** API request debugging
- **Lighthouse:** Performance audit
- **console.log:** Still effective for server components (check terminal)

### NestJS

- **NestJS Logger:** Built-in logging
- **Nest Devtools:** Visual debugging (if installed)
- **REPL:** Testing services in isolation
- **Swagger:** API endpoint testing
- **Debug mode:** Enable in main.ts for detailed logs

### Express

- **Morgan:** HTTP request logger
- **Debug module:** Namespaced debugging
- **Postman/curl:** API testing
- **Node inspector:** Debugger
- **console.log:** Simple but effective

---

## Summary

This reference guide provides:

1. **Error pattern recognition** for quick agent matching
2. **Framework-specific debugging strategies** for effective troubleshooting
3. **Root cause analysis techniques** to determine parallelization viability
4. **Common pitfalls** to avoid when debugging in parallel
5. **Validation checklists** to ensure quality fixes
6. **Advanced patterns** for complex scenarios

Use this guide in conjunction with the main `SKILL.md` workflow to orchestrate effective parallel debugging sessions.
