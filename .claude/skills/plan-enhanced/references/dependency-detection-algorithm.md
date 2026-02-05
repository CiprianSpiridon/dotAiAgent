# Dependency Detection Algorithm

Comprehensive guide for detecting task dependencies in plans to enable safe parallel execution.

## Overview

Before running tasks in parallel, you must verify they don't conflict. This document details the 5 dependency checks and provides edge case handling.

## The 5 Dependency Checks

### Check 1: File Overlap

**Question:** Do tasks A and B modify the same files?

**Algorithm:**
```
1. List all files Task A will create/modify
2. List all files Task B will create/modify
3. Compute intersection: Files(A) ∩ Files(B)
4. If intersection is non-empty → potential conflict
```

**Resolution strategies:**

| Overlap Type | Resolution |
|-------------|------------|
| Same file, different sections | May parallelize with care |
| Same file, same sections | Sequential required |
| Same directory, different files | Safe to parallelize |
| Config files (package.json, etc.) | Usually sequential |

**Examples:**

```
CONFLICT:
- Task A: Modify app/Models/User.php
- Task B: Modify app/Models/User.php
→ Sequential or merge strategy needed

SAFE:
- Task A: Create app/Http/Controllers/WishlistController.php
- Task B: Create app/Http/Controllers/CartController.php
→ Different files, can parallelize
```

### Check 2: Data Flow

**Question:** Does Task B require output from Task A?

**Algorithm:**
```
1. Identify outputs of Task A (files created, APIs exposed, data generated)
2. Identify inputs of Task B (files read, APIs called, data consumed)
3. Check if Output(A) ∈ Input(B)
4. If yes → A must complete before B
```

**Common data flow patterns:**

| Pattern | Example | Dependency |
|---------|---------|------------|
| API → Client | Backend endpoint → Frontend call | Backend first |
| Schema → Migration | Define schema → Run migration | Schema first |
| Interface → Implementation | Define contract → Implement | Interface first |
| Build → Deploy | Compile app → Deploy artifacts | Build first |
| Test data → Tests | Create fixtures → Run tests | Fixtures first |

**Examples:**

```
DEPENDENCY:
- Task A: Create /api/products endpoint
- Task B: Build product listing page that calls /api/products
→ A must complete before B (frontend needs backend)

NO DEPENDENCY:
- Task A: Build user profile page
- Task B: Build admin dashboard
→ Different data sources, no data flow between them
```

### Check 3: State Mutation

**Question:** Do tasks A and B modify shared state?

**Algorithm:**
```
1. Identify state modified by Task A (DB tables, cache, globals, env)
2. Identify state modified by Task B (same categories)
3. Compute intersection: State(A) ∩ State(B)
4. If intersection is non-empty → sequential required
```

**State categories:**

| Category | Examples | Risk Level |
|----------|----------|------------|
| Database tables | users, products, orders | High |
| Cache keys | user:*, product:* | Medium |
| Global config | .env, config files | High |
| Session/cookies | User session data | High |
| File system state | Uploads, temp files | Medium |

**Examples:**

```
CONFLICT:
- Task A: Migrate users table (add column)
- Task B: Seed users table with data
→ Sequential: migrate first, then seed

SAFE:
- Task A: Modify products table
- Task B: Modify orders table
→ Different tables, can parallelize (unless FK constraints)
```

### Check 4: API Contracts

**Question:** Does one task define a contract that another consumes?

**Algorithm:**
```
1. Identify contracts defined by tasks (types, interfaces, schemas)
2. Identify contract consumers (code depending on those definitions)
3. If Task B consumes contract from Task A → A before B
```

**Contract types:**

| Contract | Example | Dependency |
|----------|---------|------------|
| TypeScript types | API response types | Type definition first |
| GraphQL schema | Query/mutation definitions | Schema first |
| OpenAPI spec | API documentation | Spec first |
| Database schema | Table definitions | Schema first |
| Protobuf definitions | gRPC service definitions | Proto first |

**Examples:**

```
DEPENDENCY:
- Task A: Define ProductResponse type in types/api.ts
- Task B: Build component that imports ProductResponse
→ A must complete first

SAFE:
- Task A: Define UserService interface
- Task B: Define ProductService interface
→ Independent contracts, can parallelize
```

### Check 5: Test Dependencies

**Question:** Do tests in one task depend on features from another?

**Algorithm:**
```
1. Identify what Task A tests (which features/code)
2. Identify what Task B implements (which features/code)
3. If Tests(A) test Feature(B) → B before Tests(A)
```

**Test dependency patterns:**

| Pattern | Dependency |
|---------|------------|
| Unit tests → Implementation | Implementation first |
| Integration tests → Components | Components first |
| E2E tests → Full feature | All tasks first |
| Contract tests → API | API implementation first |

**Examples:**

```
DEPENDENCY:
- Task A: Write tests for checkout flow
- Task B: Implement checkout flow
→ B before A (implementation before tests)

Exception: TDD approach
- Task A: Write failing tests
- Task B: Implement to make tests pass
→ A before B (intentional)
```

## Dependency Graph Construction

### Building the Graph

1. **Nodes:** Each task is a node
2. **Edges:** Dependencies are directed edges (A → B means "A must complete before B")
3. **Weights:** Optional priority/urgency weighting

**Example graph:**

```
    ┌─────────────┐
    │   Task 1    │
    │  (Backend)  │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     ┌─────────────┐
    │   Task 3    │◄────│   Task 2    │
    │   (Tests)   │     │ (Frontend)  │
    └─────────────┘     └─────────────┘

Reading: Task 1 must complete before Task 3
         Task 2 must complete before Task 3
         Task 1 and Task 2 can run in parallel
```

### Detecting Circular Dependencies

**Algorithm (topological sort):**

```
1. Compute in-degree for each node (count of incoming edges)
2. Add all nodes with in-degree 0 to queue
3. While queue not empty:
   a. Remove node from queue
   b. Add to sorted list
   c. Decrement in-degree of neighbors
   d. Add neighbors with in-degree 0 to queue
4. If sorted list has fewer nodes than graph → CIRCULAR DEPENDENCY
```

**Example circular dependency:**

```
Task A: Implement API client (needs types from B)
Task B: Implement API server (needs client for testing)
Task C: Generate types from server schema

A → B → C → A (CYCLE!)

Resolution: Break the cycle
- Task B: Implement API server with mocked types
- Task C: Generate types from server
- Task A: Implement API client with generated types
```

## Parallelizability Score Calculation

### Formula

```
Score = (Tasks with no dependencies / Total Tasks) × 100%
```

### Example Calculation

```
Tasks: 5
- Task 1: No dependencies
- Task 2: No dependencies
- Task 3: Depends on Task 1
- Task 4: Depends on Task 2
- Task 5: Depends on Task 3 and Task 4

Independent at start: 2 (Task 1, Task 2)
Score: 2/5 × 100% = 40%
```

### Score Interpretation

| Score | Agents | Strategy |
|-------|--------|----------|
| 80-100% | 3+ | Full parallel execution |
| 60-79% | 2-3 | Parallel streams with some sequential |
| 40-59% | 1-2 | Limited parallelization |
| 0-39% | 1 | Sequential execution |

## Edge Cases

### Case 1: Transitive Dependencies

```
A → B → C

Task C depends on B, which depends on A.
Even though C doesn't directly depend on A, A must complete first.
```

### Case 2: Optional Dependencies

```
If feature flag X is enabled, Task B needs Task A.
Otherwise, they're independent.

Resolution: Document the condition. Plan for worst case.
```

### Case 3: Resource Contention

```
Task A: Heavy CPU computation
Task B: Heavy CPU computation

No logical dependency, but resource constraint.

Resolution: May need to limit concurrency even if logically parallel.
```

### Case 4: External Dependencies

```
Task A: Fetch data from external API (rate limited)
Task B: Fetch data from same external API

No internal dependency, but external constraint.

Resolution: Document external rate limits. May need sequential or throttling.
```

## Quick Reference

### Dependency Check Checklist

```
☐ Check 1: File Overlap — Do they touch the same files?
☐ Check 2: Data Flow — Does one need output from another?
☐ Check 3: State Mutation — Do they modify shared state?
☐ Check 4: API Contracts — Does one define what another consumes?
☐ Check 5: Test Dependencies — Do tests need features?
```

### Common Parallel-Safe Patterns

| Pattern | Why Safe |
|---------|----------|
| Backend + Frontend (different) | Different files, no shared state |
| Multiple microservices | Independent deployments |
| Separate database tables | No FK conflicts |
| Different user features | No shared code paths |

### Common Sequential-Required Patterns

| Pattern | Why Sequential |
|---------|----------------|
| Schema migration → Seeding | Data depends on structure |
| Interface → Implementation | Code depends on contract |
| Backend → Frontend (same feature) | Frontend calls backend |
| Feature → Tests | Tests verify feature |
