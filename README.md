# Claude Code Configuration

Production-tested [Claude Code](https://docs.anthropic.com/en/docs/claude-code) setup with specialized agents, reusable skills, and a self-improving learnings system.

## Why This Exists

- Claude Code benefits from domain-specific context that generic prompts cannot provide
- Repeated workflows (commits, PRs, debugging) should encode best practices once
- **Lessons learned in one session should propagate to all future sessions** (this is the core innovation)
- Multi-agent coordination requires consistent patterns and handoff protocols

The **learnings system** is what makes this configuration self-improving. Every mistake becomes a documented pattern, every insight gets captured, and future sessions benefit automatically.

## What's Included

- **10 Specialized Agents** — Domain experts for specific tech stacks
- **15 Skills** — Reusable workflows invoked via slash commands
- **Self-Improving Learnings System** — 360° coverage with three core skills:
  - `/update-agent-learnings` — Code patterns → synced to all agents
  - `/update-skill-learnings` — Skill patterns → central knowledge base
  - `/update-claude-learnings` — Behavioral rules → project CLAUDE.md

## Repository Structure

```
.claude/
├── agents/
│   ├── devops-aws-senior-engineer.md
│   ├── devops-docker-senior-engineer.md
│   ├── expo-react-native-engineer.md
│   ├── express-senior-engineer.md
│   ├── fastapi-senior-engineer.md
│   ├── laravel-senior-engineer.md
│   ├── nextjs-senior-engineer.md
│   ├── nodejs-cli-senior-engineer.md
│   ├── python-senior-engineer.md
│   └── react-vite-tailwind-engineer.md
├── learnings/
│   ├── agent-learnings.md
│   └── skill-learnings.md
└── skills/
    ├── ast-grep/
    │   ├── SKILL.md
    │   └── references/
    │       └── rule_reference.md
    ├── commit/
    │   └── SKILL.md
    ├── create-pr/
    │   ├── SKILL.md
    │   └── references/
    │       └── pr-body-examples.md
    ├── git-worktrees/
    │   ├── SKILL.md
    │   └── references/
    │       ├── troubleshooting.md
    │       ├── workflow-patterns.md
    │       └── worktree-commands.md
    ├── plan-enhanced/
    │   ├── SKILL.md
    │   └── references/
    │       ├── agent-brief-templates.md
    │       └── dependency-detection-algorithm.md
    ├── run-parallel-agents-feature-build/
    │   ├── SKILL.md
    │   └── references/
    │       └── agent_matching_logic.md
    ├── run-parallel-agents-feature-debug/
    │   ├── SKILL.md
    │   └── references/
    │       ├── agent_matching_logic.md
    │       └── debug_patterns.md
    ├── start/
    │   ├── SKILL.md
    │   └── references/
    │       ├── agent_matching_logic.md
    │       ├── discovery.md
    │       ├── skill_discovery_patterns.md
    │       └── sync-claude-md.md
    ├── ulpi-generate-hooks/
    │   ├── SKILL.md
    │   └── references/
    │       ├── framework-rules.md
    │       └── language-rules.md
    ├── update-agent-learnings/
    │   └── SKILL.md
    ├── update-claude-md-after-install/
    │   └── SKILL.md
    ├── update-skill-learnings/
    │   └── SKILL.md
    ├── update-claude-learnings/
    │   ├── SKILL.md
    │   └── references/
    │       └── claude-md-template.md
    └── frontend-design-ui-ux/
        └── SKILL.md
```

## Agents

Agents are specialized personas Claude Code adopts for specific tech stacks. Each encodes domain knowledge, coding standards, and best practices.

| Agent | Stack | Use Case |
|-------|-------|----------|
| `devops-aws-senior-engineer` | AWS CDK, CloudFormation, Terraform, Lambda | Infrastructure as code, cloud architecture |
| `devops-docker-senior-engineer` | Docker, Compose, container orchestration | Containerization, deployment configs |
| `expo-react-native-engineer` | Expo SDK 52+, React Native | Mobile app development |
| `express-senior-engineer` | Express.js, TypeScript, Node.js | Backend API development |
| `fastapi-senior-engineer` | FastAPI, Pydantic v2, SQLAlchemy 2.0 | Python async APIs |
| `laravel-senior-engineer` | Laravel 12.x, PHP, Eloquent | PHP backend development |
| `nextjs-senior-engineer` | Next.js 14/15, App Router, RSC | Full-stack React applications |
| `nodejs-cli-senior-engineer` | Commander.js, Pino, CLI patterns | Command-line applications |
| `python-senior-engineer` | Python 3.12+, uv, ruff, pytest | Python applications |
| `react-vite-tailwind-engineer` | React 19, Vite, Tailwind CSS 3 | Frontend SPAs |

Claude Code selects agents automatically based on task context. Explicit selection is available via the Task tool's `subagent_type` parameter.

## Skills

Skills encode reusable workflows triggered via slash commands or auto-invoked by other skills.

| Skill | Command | Purpose |
|-------|---------|---------|
| `start` | `/start` | Initialize session, discover project context, select agent |
| `commit` | `/commit` | Analyze changes, run checks, create conventional commit |
| `create-pr` | `/create-pr` | Validate branch, generate PR with summary and test plan |
| `git-worktrees` | `/git-worktrees` | Manage parallel branch workflows |
| `ast-grep` | `/ast-grep` | Structural code search with AST patterns |
| `plan-enhanced` | `/plan-enhanced` | Structure plans for parallel agent execution |
| `run-parallel-agents-feature-build` | Auto | Orchestrate parallel agents for independent features |
| `run-parallel-agents-feature-debug` | Auto | Orchestrate parallel agents for isolated bugs |
| `ulpi-generate-hooks` | `/ulpi-generate-hooks` | Generate ULPI Hooks rules.yml for project tech stack |
| `update-agent-learnings` | `/update-agent-learnings` | Extract session insights, propagate to agents |
| `update-skill-learnings` | `/update-skill-learnings` | Extract skill creation insights, update skill patterns |
| `update-claude-learnings` | `/update-claude-learnings` | Extract Claude Code behavior rules, update CLAUDE.md |
| `update-claude-md-after-install` | Auto | Replace generic CLAUDE.md examples with real project patterns |
| `frontend-design-ui-ux` | `/frontend-design-ui-ux` | Generate UI/UX design specifications and component briefs |

## When to Use What

| Scenario | Use | Why |
|----------|-----|-----|
| Working on a specific tech stack | Agent | Deep domain expertise, stack-specific patterns |
| Performing a workflow (commit, PR) | Skill | Encoded process with quality gates |
| Complex task spanning multiple domains | Agent + Skills | Agent handles implementation, skills handle workflow |
| Multiple independent features | Parallel Agents | Concurrent execution, faster completion |
| Multiple unrelated bugs | Parallel Debug Agents | Isolated diagnosis, no cross-contamination |

## Learnings System (Core Feature)

The learnings system is the **foundation** of this configuration. It provides **360° coverage** for capturing patterns and mistakes from real sessions, ensuring Claude Code continuously improves.

### Why This Matters

Without a learnings system:
- Same mistakes repeat across sessions
- Best practices stay in one developer's head
- New team members start from scratch
- Institutional knowledge is lost

With this learnings system:
- Mistakes become documented patterns to avoid
- Best practices propagate to all agents automatically
- New sessions benefit from all previous insights
- Knowledge compounds over time

### The Three Core Learning Skills

These skills form the backbone of the self-improving system:

```
┌─────────────────────────────────────────────────────────────────┐
│                    360° LEARNING COVERAGE                       │
├─────────────────────┬─────────────────────┬─────────────────────┤
│                     │                     │                     │
│  /update-agent-     │  /update-skill-     │  /update-claude-    │
│  learnings          │  learnings          │  learnings          │
│                     │                     │                     │
│  ┌───────────────┐  │  ┌───────────────┐  │  ┌───────────────┐  │
│  │ agent-        │  │  │ skill-        │  │  │ CLAUDE.md     │  │
│  │ learnings.md  │  │  │ learnings.md  │  │  │               │  │
│  └───────┬───────┘  │  └───────────────┘  │  └───────────────┘  │
│          │          │                     │                     │
│          ▼          │                     │                     │
│  ┌───────────────┐  │                     │                     │
│  │ All Agent     │  │                     │                     │
│  │ Files Synced  │  │                     │                     │
│  └───────────────┘  │                     │                     │
│                     │                     │                     │
│  WHO: Subagents     │  WHO: Skill         │  WHO: Main Claude   │
│  writing app code   │  creators           │  Code agent         │
│                     │                     │                     │
│  WHAT: Code         │  WHAT: Skill        │  WHAT: Behavioral   │
│  patterns           │  structure          │  rules              │
│                     │                     │                     │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

---

### `/update-agent-learnings`

**Purpose:** Capture patterns about writing application code and propagate them to all subagents.

**When to use:** After sessions where subagents (nodejs-cli, fastapi, nextjs, etc.) made mistakes or discovered better patterns while writing code.

**Target:** `learnings/agent-learnings.md` → synced to all agent files

| Scope | Description | Propagation |
|-------|-------------|-------------|
| **Global** | Scope control, session management, testing | All subagents |
| **Agent-Specific** | Framework/language patterns | Relevant agent only |

**Categories:**
- Scope Control — Prevent over-engineering, confirm before expanding
- Session Management — Checkpoints, progress summaries, timeout handling
- Multi-Agent Coordination — Focus boundaries, handoffs, completion signaling
- Autonomous Iteration — Test cycles, error handling, retry limits
- Testing Integration — Validation requirements per tech stack

**Example learnings:**
- "Run tsc --noEmit after TypeScript edits"
- "Mock stdin/stdout for CLI prompt tests"
- "Never modify test files unless explicitly requested"

---

### `/update-skill-learnings`

**Purpose:** Capture patterns about creating and improving skills.

**When to use:** After creating a new skill, improving an existing skill, or discovering structural patterns that make skills more effective.

**Target:** `learnings/skill-learnings.md`

| Category | Description |
|----------|-------------|
| **Structural Patterns** | Required sections, quality signals, file organization |
| **Content Patterns** | Writing clarity, user interaction, examples |
| **Anti-Patterns** | Common mistakes to avoid in skills |
| **Skill-Specific** | Per-skill insights |

**Example learnings:**
- "Include EXTREMELY-IMPORTANT block after frontmatter"
- "Add Gate checkpoints between all workflow steps"
- "Include Quality Checklist with 8/10 scoring system"

---

### `/update-claude-learnings`

**Purpose:** Capture behavioral rules for the main Claude Code agent.

**When to use:** After discovering that Claude Code should use skills instead of manual commands, or when session management / scope control issues occur.

**Target:** Project's `CLAUDE.md` file

| Category | Description |
|----------|-------------|
| **Workflow Rules** | Skill usage, command patterns, tool preferences |
| **Session Management** | Checkpoints, timeouts, progress tracking |
| **Scope Control** | Expansion rules, confirmation patterns |
| **Behavioral Patterns** | Project-specific behaviors |

**Example learnings:**
- "Use /commit instead of manual git add && git commit"
- "Provide checkpoint summaries every 3-5 edits on complex tasks"
- "Ask before expanding scope to adjacent code"

---

### Decision Guide: Which Skill to Use?

| Session Revealed... | Example | Use This Skill |
|---------------------|---------|----------------|
| Application code pattern | "Always run tests after code changes" | `/update-agent-learnings` |
| Skill structure insight | "Skills need Gate checkpoints" | `/update-skill-learnings` |
| Claude Code behavior rule | "Use /commit skill not manual commands" | `/update-claude-learnings` |

**Quick test:** Ask yourself "Who needs this learning?"
- Subagents writing code → `/update-agent-learnings`
- Someone creating skills → `/update-skill-learnings`
- Main Claude Code agent → `/update-claude-learnings`

---

### Workflow: After Every Significant Session

```
Session ends
     │
     ▼
Did something go wrong or could be improved?
     │
     ├── Yes → Identify the pattern
     │         │
     │         ├── Code pattern? ────────→ /update-agent-learnings
     │         ├── Skill pattern? ───────→ /update-skill-learnings
     │         └── Behavior pattern? ────→ /update-claude-learnings
     │
     └── No → Continue (knowledge preserved from previous sessions)
```

## Customization

### Modifying an Agent

Edit the agent file in `.claude/agents/`. Key sections:
- `## Expertise` — Domain knowledge areas
- `## Rules` — Always/Never/Prefer directives
- `## Examples` — Few-shot patterns
- `## Learnings` — Auto-synced from central repository

### Modifying a Skill

Edit `SKILL.md` in the skill's directory. Skills use YAML frontmatter for metadata. Reference files go in `references/` subdirectory.

### Adding New

**Agent:** Create `.claude/agents/{name}.md`, follow existing structure, run `/update-agent-learnings` to sync global learnings.

**Skill:** Create `.claude/skills/{name}/SKILL.md` with YAML frontmatter containing `name` and `description`.

## Installation

Copy to project:

```bash
cp -r .claude/ /path/to/your/project/
```

Or symlink for shared configuration:

```bash
git clone https://github.com/user/dotAiAgent.git ~/.claude-config
ln -s ~/.claude-config/.claude /path/to/your/project/.claude
```

## License

MIT
