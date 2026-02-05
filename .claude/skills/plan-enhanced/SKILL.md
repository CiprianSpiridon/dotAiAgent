---
name: plan-enhanced
description: Enhance plans for parallel multi-agent execution. When in plan mode with 3+ tasks, allocate specialized agents to each task, detect dependencies, calculate parallelizability score, and structure the plan for concurrent execution. Use BEFORE ExitPlanMode to ensure plans are optimized for parallel agent execution.
---

<EXTREMELY-IMPORTANT>
Before exiting plan mode with ExitPlanMode, you **ABSOLUTELY MUST**:

1. Assign a specialized agent to EVERY task in the plan
2. Document dependencies between tasks
3. Calculate the parallelizability score

**A plan without agent allocation = wasted parallel execution opportunity**

This is not optional. Plans are for EXECUTION, and execution needs agent assignment.
</EXTREMELY-IMPORTANT>

# Plan Enhanced: Parallel-Ready Planning

## MANDATORY FIRST RESPONSE PROTOCOL

Before enhancing ANY plan, you **MUST** complete this checklist:

1. ☐ Read the current plan file or user requirements
2. ☐ Count the total number of discrete tasks
3. ☐ Identify the technology stack for each task
4. ☐ Check if parallelization applies (3+ independent tasks)
5. ☐ Announce: "Enhancing plan for parallel execution, targeting X% parallelizability"
6. ☐ Complete all 5 phases before ExitPlanMode

**Exiting plan mode WITHOUT completing this checklist = suboptimal execution.**

## Overview

The `plan-enhanced` skill transforms standard plans into parallel-execution-ready plans. It ensures every task is:
- Assigned to the correct specialized agent
- Analyzed for dependencies
- Grouped into parallel execution streams

**Core Principle:** Plans exist for EXECUTION. Optimal execution requires agent allocation and dependency mapping BEFORE approval.

**Quality Target:** Parallelizability score ≥ 60% for plans with 3+ tasks

**Integration:** This skill works WITH Claude Code's native plan mode. Use it AFTER drafting a plan but BEFORE calling ExitPlanMode.

## When to Use This Skill

**Mandatory triggers:**

- You are in plan mode with a plan containing 3+ discrete tasks
- User requests "build X, Y, and Z" (multiple features)
- Plan has tasks spanning different technology stacks
- User explicitly asks for parallel execution or agent allocation

**User request patterns:**

- "Plan this feature with parallel execution in mind"
- "Break this down for multiple agents"
- "Optimize this plan for concurrent work"
- "Build X, Y, and Z" (implies multiple independent features)

**Symptoms indicating need:**

- Plan has sections that could run independently
- Different technologies involved (backend + frontend + API)
- Tasks don't share files or state
- Work could be split across specialists

## When NOT to Use This Skill

Do NOT use `plan-enhanced` when:

**Simple Plans:**

- Single-task plans (nothing to parallelize)
- Plan involves only 1-2 small tasks
- All tasks must be sequential (no parallelization benefit)

**Research/Exploration:**

- Plan is for investigation, not implementation
- Tasks are about understanding, not building
- Outcome is information, not code

**Highly Coupled Work:**

- All tasks modify the same files
- Tight dependencies between every task
- Sequential refactoring required
- Single-agent work is more appropriate

**Parallelizability < 40%:**

If dependency analysis shows < 40% parallelizability, recommend single-agent execution instead.

---

## Phase 1: Plan Analysis (MANDATORY)

Complete this phase before any enhancement. Gate: Task inventory complete.

### Step 1: Read the Plan

Read the current plan file (if it exists) or parse user requirements:

```
Plan location: /Users/ciprian/.claude/plans/<plan-file>.md
```

Identify:
1. **Plan title/feature name**
2. **Overall objective**
3. **Listed tasks or sections**

### Step 2: Extract Discrete Tasks

Break down the plan into atomic, independently-completable tasks:

| # | Task | Scope | Files (estimated) |
|---|------|-------|-------------------|
| 1 | [Task name] | [Brief scope] | [Likely files] |
| 2 | [Task name] | [Brief scope] | [Likely files] |
| ... | ... | ... | ... |

**Good task granularity:**
- "Create user authentication API endpoint"
- "Build product listing page with filters"
- "Implement cart calculation service"

**Too broad:**
- "Build the entire checkout flow"
- "Fix the app"

**Too narrow:**
- "Add import statement"
- "Fix typo in line 42"

### Step 3: Identify Technology Stack Per Task

For each task, identify:

| Task | Primary Tech | Agent Candidate | Key Indicators |
|------|--------------|-----------------|----------------|
| 1 | Laravel | `laravel-senior-engineer` | `*.php`, Eloquent |
| 2 | Next.js | `nextjs-senior-engineer` | `*.tsx`, RSC |
| 3 | Express | `express-senior-engineer` | Express imports |

**Technology detection patterns:**

```
*.php + /app/ + /routes/ → Laravel
*.tsx + /app/ or /pages/ → Next.js
*.ts + nest-cli.json → NestJS
*.ts + remix.config.js → Remix
*.ts + express imports → Express
*.tsx + app.json (Expo) → Expo React Native
*.dart + pubspec.yaml → Flutter
*.php + /app/code/ (Magento) → Magento
```

### Phase 1 Gate

Before proceeding to Phase 2, verify:
- [ ] All tasks extracted and listed
- [ ] Technology stack identified per task
- [ ] Agent candidates identified per task

---

## Phase 2: Dependency Mapping

Detect dependencies between tasks. Gate: Dependencies documented.

### Step 1: Run Dependency Checks

For each pair of tasks (A, B), check:

#### Check 1: File Overlap
```
Files(A) ∩ Files(B) ≠ ∅ → Potential conflict
```
- If overlap exists: Mark as sequential OR add conflict resolution strategy

#### Check 2: Data Flow
```
Output(A) ∈ Input(B) → A must complete before B
```
- Example: API endpoint (A) must exist before frontend integration (B)
- Example: Schema migration (A) before seeder (B)

#### Check 3: State Mutation
```
State(A) ∩ State(B) ≠ ∅ → Sequential execution required
```
- Example: Both tasks modify the same database table
- Example: Both tasks update the same config file

#### Check 4: API Contracts
```
Frontend(B) requires Schema from Backend(A) → A before B
```
- Example: Frontend needs type definitions from API
- Example: Client needs server endpoint to exist

#### Check 5: Test Dependencies
```
Tests(A) require Feature(B) → B before Tests(A)
```
- Testing phases typically depend on implementation phases
- Integration tests depend on components being complete

### Step 2: Create Dependency Graph

Document dependencies:

```
[Task 1] ──┐
           ├──→ [Task 4]
[Task 2] ──┘
[Task 3] (independent)
```

Or as a table:

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | None | 4 |
| 2 | None | 4 |
| 3 | None | None |
| 4 | 1, 2 | None |

### Step 3: Calculate Parallelizability Score

```
Score = (Independent Tasks / Total Tasks) × 100%
```

**Interpretation:**

| Score | Meaning | Recommendation |
|-------|---------|----------------|
| 80-100% | Highly parallelizable | Use 3+ agents |
| 60-79% | Moderately parallelizable | Use 2-3 agents |
| 40-59% | Limited parallelization | Use 1-2 agents |
| 0-39% | Sequential plan | Single agent recommended |

**Example calculation:**
- Total tasks: 4
- Tasks with no dependencies: 3 (Tasks 1, 2, 3)
- Score: 3/4 × 100% = 75% (Moderately parallelizable)

### Phase 2 Gate

Before proceeding to Phase 3, verify:
- [ ] All task pairs checked for dependencies
- [ ] Dependency graph documented
- [ ] Parallelizability score calculated

---

## Phase 3: Agent Allocation

Assign specialized agents to tasks. Gate: Every task has assigned agent.

### Step 1: Match Tasks to Agents

Use the agent allocation matrix:

| Task Type | Primary Agent | Fallback | Key Indicators |
|-----------|---------------|----------|----------------|
| Laravel backend | `laravel-senior-engineer` | `general-purpose` | `*.php`, `/app/`, Eloquent, routes |
| Next.js frontend | `nextjs-senior-engineer` | `general-purpose` | `*.tsx`, `/app/`, RSC, next.config |
| React UI | `nextjs-senior-engineer` | `general-purpose` | React components, hooks |
| NestJS APIs | `nestjs-senior-engineer` | `general-purpose` | `@nestjs/*`, DI, decorators |
| Remix apps | `remix-senior-engineer` | `general-purpose` | Loaders, actions, remix.config |
| Express APIs | `express-senior-engineer` | `nodejs-cli-senior-engineer` | Express imports, middleware |
| Node.js CLI | `nodejs-cli-senior-engineer` | `general-purpose` | commander, chalk, inquirer |
| Expo mobile | `expo-react-native-engineer` | `general-purpose` | Expo modules, app.json |
| Flutter mobile | `flutter-senior-engineer` | `general-purpose` | `*.dart`, pubspec.yaml |
| Magento e-commerce | `magento-senior-engineer` | `general-purpose` | `/app/code/`, Magento DI |
| AWS infrastructure | `devops-aws-senior-engineer` | `general-purpose` | CDK, CloudFormation, Terraform |
| Docker/containers | `devops-docker-senior-engineer` | `general-purpose` | Dockerfile, docker-compose |
| Exploration/search | `Explore` | `general-purpose` | File discovery, codebase search |
| Architecture design | `Plan` | `general-purpose` | System design, tradeoffs |
| General tasks | `general-purpose` | - | Non-framework-specific work |

### Step 2: Create Agent Briefs

For each agent assignment, create a brief:

```markdown
### Stream [X]: [Category] — `agent-type`

**Agent:** `[agent-type]`

**Brief:**
- **Scope:** [Exactly what to build/fix/analyze]
- **Files:** [Relevant file paths or patterns]
- **Context:** [Existing patterns, constraints, related code]
- **Output:** [Expected deliverables]
- **Success criteria:** [How to verify completion]

**Tasks:**
1. [ ] Task [N]: [Description]
2. [ ] Task [M]: [Description] — *depends on Task N*
```

See `references/agent-brief-templates.md` for detailed templates per agent type.

### Step 3: Verify Allocation Coverage

| Task | Assigned Agent | Confidence | Notes |
|------|----------------|------------|-------|
| 1 | `laravel-senior-engineer` | High | Clear Laravel patterns |
| 2 | `nextjs-senior-engineer` | High | React + Next.js files |
| 3 | `express-senior-engineer` | Medium | Express-like but check imports |
| 4 | `general-purpose` | Low | Cross-cutting, may need specialist |

### Phase 3 Gate

Before proceeding to Phase 4, verify:
- [ ] Every task has an assigned agent
- [ ] Brief created for each agent stream
- [ ] Confidence level documented

---

## Phase 4: Plan Restructuring

Group tasks into parallel streams. Gate: Plan ready for approval.

### Step 1: Group into Parallel Streams

Organize tasks by agent and dependency order:

```markdown
## Enhanced Plan: [Feature/Task Name]

### Execution Summary

| Metric | Value |
|--------|-------|
| Total Tasks | X |
| Parallel Streams | Y |
| Parallelizability | Z% |
| Estimated Agents | N |

### Dependency Graph

```
[Task 1] ──┐
           ├──→ [Task 4]
[Task 2] ──┘
[Task 3] (independent)
```

### Stream A: [Backend] — `laravel-senior-engineer`

**Agent:** `laravel-senior-engineer`
**Brief:**
- Scope: [specific work]
- Files: [paths]
- Output: [deliverables]
- Success: [criteria]

**Tasks:**
1. [ ] Task 1: [description]

### Stream B: [Frontend] — `nextjs-senior-engineer`

**Agent:** `nextjs-senior-engineer`
**Brief:**
- Scope: [specific work]
- Files: [paths]
- Output: [deliverables]
- Success: [criteria]

**Tasks:**
1. [ ] Task 2: [description]

### Stream C: [API] — `express-senior-engineer`

**Agent:** `express-senior-engineer`
**Brief:**
- Scope: [specific work]
- Files: [paths]
- Output: [deliverables]
- Success: [criteria]

**Tasks:**
1. [ ] Task 3: [description]

### Sequential Phase (After Parallel Streams)

**Dependencies:** Requires Stream A + B + C complete

**Tasks:**
1. [ ] Task 4: Integration testing
```

### Step 2: Write Launch Command

```markdown
### Launch Command

When plan is approved, launch with a single message containing multiple Task tool calls:

\`\`\`
Task tool: Stream A brief → laravel-senior-engineer
Task tool: Stream B brief → nextjs-senior-engineer
Task tool: Stream C brief → express-senior-engineer
\`\`\`

After parallel streams complete, continue with sequential phase.
```

### Phase 4 Gate

Before proceeding to Phase 5, verify:
- [ ] Tasks grouped into parallel streams
- [ ] Sequential dependencies clearly ordered
- [ ] Launch command documented

---

## Phase 5: Verification (MANDATORY)

Verify the enhanced plan. Gate: All 5 checks pass.

### Check 1: Agent Assignment Complete
- [ ] Every task has an assigned agent
- [ ] No tasks marked "TBD" or unassigned

### Check 2: Dependencies Documented
- [ ] Dependency graph included
- [ ] Each dependency has rationale (file overlap, data flow, etc.)

### Check 3: Parallelizability Score Calculated
- [ ] Score formula applied
- [ ] Score interpretation documented
- [ ] Recommendation matches score

### Check 4: Brief Templates Complete
- [ ] Each stream has Scope, Files, Output, Success criteria
- [ ] Briefs are specific, not generic placeholders

### Check 5: No Circular Dependencies
- [ ] Tasks can be topologically sorted
- [ ] No A → B → C → A cycles

**If any check fails:** Return to the relevant phase and fix before proceeding.

---

## Example Scenarios

### Example A: E-commerce Feature (High Parallelization)

**User Says:**
"Build the wishlist API, checkout summary, and user dashboard"

**Analysis:**
- 3 independent features
- Different technology stacks (Laravel + Next.js)
- No shared state

**Enhanced Plan:**

```
## Enhanced Plan: E-commerce Features

### Execution Summary
| Metric | Value |
|--------|-------|
| Total Tasks | 3 |
| Parallel Streams | 3 |
| Parallelizability | 100% |
| Estimated Agents | 2 |

### Dependency Graph
[Wishlist API] (independent)
[Checkout Summary] (independent)
[User Dashboard] (independent)

### Stream A: Backend — laravel-senior-engineer
**Brief:** Build wishlist API with add, remove, list endpoints
**Tasks:** 1. Create WishlistController with CRUD operations

### Stream B: Frontend — nextjs-senior-engineer
**Brief:** Build checkout summary page with cart total, shipping
**Tasks:** 1. Create checkout summary page component

### Stream C: Frontend — nextjs-senior-engineer
**Brief:** Build user dashboard with profile, orders, settings
**Tasks:** 1. Create dashboard layout and pages

### Launch Command
Launch 3 agents in single message (Stream A, B, C in parallel)
```

### Example B: Bug Fixes Across Subsystems

**User Says:**
"Fix the auth tests, product search, and webhook timeout"

**Analysis:**
- 3 independent bugs
- Different subsystems (Laravel, Next.js, NestJS)
- Can debug in parallel

**Enhanced Plan:**

```
## Enhanced Plan: Bug Fixes

### Execution Summary
| Metric | Value |
|--------|-------|
| Total Tasks | 3 |
| Parallel Streams | 3 |
| Parallelizability | 100% |
| Estimated Agents | 3 |

### Dependency Graph
[Auth tests] (independent)
[Product search] (independent)
[Webhook timeout] (independent)

### Stream A: Laravel — laravel-senior-engineer
**Brief:** Debug and fix auth test failures
**Tasks:** 1. Fix authentication test suite

### Stream B: Next.js — nextjs-senior-engineer
**Brief:** Debug and fix product search
**Tasks:** 1. Fix product search functionality

### Stream C: NestJS — nestjs-senior-engineer
**Brief:** Debug and fix webhook timeout
**Tasks:** 1. Fix webhook processing timeout
```

### Example C: Refactor with Dependencies

**User Says:**
"Refactor the payment service: extract interface, update implementations, migrate tests"

**Analysis:**
- 3 tasks with dependencies
- Sequential: interface → implementations → tests
- Single-agent appropriate

**Enhanced Plan:**

```
## Enhanced Plan: Payment Service Refactor

### Execution Summary
| Metric | Value |
|--------|-------|
| Total Tasks | 3 |
| Parallel Streams | 1 |
| Parallelizability | 33% |
| Estimated Agents | 1 |

### Dependency Graph
[Extract interface] → [Update implementations] → [Migrate tests]

### Stream A: Refactor — laravel-senior-engineer
**Brief:** Sequential refactor of payment service
**Tasks:**
1. Extract PaymentServiceInterface
2. Update PaymentStripeService, PaymentPaypalService
3. Migrate payment tests to use interface

**Note:** Low parallelizability (33%). Sequential execution recommended.
```

### Example D: Single-Agent Plan

**User Says:**
"Add validation to the user registration form"

**Analysis:**
- Single task
- Single file area
- No parallelization benefit

**Enhanced Plan:**

```
## Enhanced Plan: Form Validation

### Execution Summary
| Metric | Value |
|--------|-------|
| Total Tasks | 1 |
| Parallel Streams | 1 |
| Parallelizability | N/A |
| Estimated Agents | 1 |

### Stream A: Frontend — nextjs-senior-engineer
**Brief:** Add Zod validation to registration form
**Tasks:** 1. Add validation schema and error display

**Note:** Single task. Parallel enhancement not applicable.
```

---

## Quality Checklist (Must Score 8/10)

Score yourself honestly before marking the plan enhanced:

### Task Decomposition (0-2 points)
- **0 points:** Tasks not clearly defined, scope unclear
- **1 point:** Some tasks defined, but granularity inconsistent
- **2 points:** All tasks specific, measurable, appropriately scoped

### Dependency Detection (0-2 points)
- **0 points:** No dependency analysis performed
- **1 point:** Some dependencies noted, but checks incomplete
- **2 points:** Full dependency graph with all 5 checks applied

### Agent Matching (0-2 points)
- **0 points:** No agents assigned to tasks
- **1 point:** Agents assigned without technology justification
- **2 points:** Each task matched to correct agent with indicators documented

### Brief Quality (0-2 points)
- **0 points:** No briefs prepared
- **1 point:** Generic briefs without specific files/output
- **2 points:** Complete briefs with scope, files, output, success criteria

### Plan Structure (0-2 points)
- **0 points:** Linear plan without parallel grouping
- **1 point:** Some parallel grouping, but streams unclear
- **2 points:** Full parallel streams with dependency ordering and launch command

**Minimum passing score: 8/10**

---

## Common Rationalizations (All Wrong)

These are excuses. Don't fall for them:

- **"This plan is simple enough"** → STILL run dependency checks
- **"I already know the best agent"** → STILL document the matching rationale
- **"There are only 2 tasks"** → Check if they can run in parallel
- **"Everything depends on everything"** → Run the 5 dependency checks to verify
- **"The user just wants a plan"** → Plans are for execution; enhance for execution
- **"Agent allocation is overkill"** → Agents save time; allocation ensures quality
- **"I'll figure out parallelization during execution"** → Plan it now, execute faster later
- **"Parallelizability score is just a number"** → It determines how many agents to launch

---

## Failure Modes

### Failure Mode 1: Skipping Dependency Analysis

**Symptom:** Plan marked enhanced but no dependency graph, parallel streams launched that conflict
**Fix:** Complete Phase 2 entirely. Run all 5 dependency checks.

### Failure Mode 2: Generic Briefs

**Symptom:** Briefs say "implement feature" without specific files or success criteria
**Fix:** Each brief must have Scope, Files, Output, Success criteria filled with actual values.

### Failure Mode 3: Wrong Agent Assignment

**Symptom:** Laravel work assigned to `nextjs-senior-engineer`, frontend to backend agent
**Fix:** Use technology detection patterns. Match `*.php` → Laravel agent, `*.tsx` → Next.js agent.

### Failure Mode 4: Ignoring Low Parallelizability

**Symptom:** Launching 3 agents for a 33% parallelizable plan, agents stepping on each other
**Fix:** If score < 40%, recommend single-agent execution. Note it in the plan.

### Failure Mode 5: Missing Launch Command

**Symptom:** Enhanced plan but no guidance on how to execute it
**Fix:** Include explicit launch command section with Task tool invocations.

---

## Quick Workflow Summary

```
PHASE 1: PLAN ANALYSIS (MANDATORY)
├── Read plan file or user requirements
├── Extract discrete tasks
├── Identify technology stack per task
└── Gate: Task inventory complete

PHASE 2: DEPENDENCY MAPPING
├── Run 5 dependency checks per task pair
├── Create dependency graph
├── Calculate parallelizability score
└── Gate: Dependencies documented

PHASE 3: AGENT ALLOCATION
├── Match tasks to specialized agents
├── Create agent briefs
├── Verify allocation coverage
└── Gate: Every task has assigned agent

PHASE 4: PLAN RESTRUCTURING
├── Group tasks into parallel streams
├── Order sequential dependencies
├── Write launch command
└── Gate: Plan ready for approval

PHASE 5: VERIFICATION (MANDATORY)
├── Check 1: Agent assignment complete
├── Check 2: Dependencies documented
├── Check 3: Parallelizability score calculated
├── Check 4: Brief templates complete
├── Check 5: No circular dependencies
└── Gate: All 5 checks pass → ExitPlanMode
```

---

## Completion Announcement

When plan enhancement is complete, announce:

```
Plan enhanced for parallel execution.

**Quality Score: X/10**
- Task Decomposition: X/2
- Dependency Detection: X/2
- Agent Matching: X/2
- Brief Quality: X/2
- Plan Structure: X/2

**Execution Summary:**
- Total Tasks: X
- Parallel Streams: Y
- Parallelizability: Z%
- Agents: [list]

**Workflow followed:**
- Phases completed: 5/5
- Dependency checks: 5/5
- Briefs created: X

Ready for ExitPlanMode.
```

---

## Resources

### references/

- **dependency-detection-algorithm.md** — Detailed algorithm for detecting all dependency types, edge cases, conflict resolution strategies, and examples

- **agent-brief-templates.md** — Complete brief templates for each agent type with technology-specific fields, common patterns, and success criteria examples

---

## Integration with Other Skills

The `plan-enhanced` skill integrates with:

- **`start`** — Use `start` first to identify if `plan-enhanced` is needed
- **`run-parallel-agents-feature-build`** — Execute the enhanced plan with parallel agents
- **`run-parallel-agents-feature-debug`** — If plan involves debugging multiple issues
- **Plan mode** — `plan-enhanced` enhances plans BEFORE ExitPlanMode

**Workflow:** `start` → EnterPlanMode → Draft plan → `plan-enhanced` → ExitPlanMode → `run-parallel-agents-feature-build`

---

## Post-Approval Execution (MANDATORY)

<EXTREMELY-IMPORTANT>
After the plan is approved via ExitPlanMode, you **MUST** invoke the appropriate parallel agent skill:

**If parallelizability ≥ 60% AND 3+ independent tasks:**
→ Use the Skill tool to invoke `run-parallel-agents-feature-build`

**If plan involves debugging 3+ independent issues:**
→ Use the Skill tool to invoke `run-parallel-agents-feature-debug`

**Do NOT:**
- Launch agents manually without invoking the skill
- Skip the parallel skill and execute sequentially
- Forget to invoke the skill after approval

The parallel agent skills have world-class verification, quality checklists, and aggregation templates that ensure proper execution.
</EXTREMELY-IMPORTANT>

### Execution Decision Tree

```
Plan approved via ExitPlanMode
   │
   ├── Is parallelizability ≥ 60%?
   │   │
   │   ├── YES: Is this a debugging plan?
   │   │   │
   │   │   ├── YES → Invoke `run-parallel-agents-feature-debug`
   │   │   │
   │   │   └── NO → Invoke `run-parallel-agents-feature-build`
   │   │
   │   └── NO: Execute sequentially with single agent
   │
   └── Are there 3+ tasks?
       │
       ├── YES: Invoke appropriate parallel skill
       │
       └── NO: Execute with single agent
```

### Invocation Examples

**Feature Build (most common):**
```
Plan approved. Parallelizability: 75% with 4 independent tasks.
I'm invoking the `run-parallel-agents-feature-build` skill to execute this plan.
[Use Skill tool: run-parallel-agents-feature-build]
```

**Debug Plan:**
```
Plan approved. 5 independent bugs identified across 3 subsystems.
I'm invoking the `run-parallel-agents-feature-debug` skill to fix these issues.
[Use Skill tool: run-parallel-agents-feature-debug]
```

**Low Parallelizability:**
```
Plan approved. Parallelizability: 33% — sequential execution recommended.
I'll execute this plan with a single specialized agent.
[Use Task tool with appropriate agent]
```
