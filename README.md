# Claude Code Configuration

Production-tested [Claude Code](https://docs.anthropic.com/en/docs/claude-code) setup with specialized agents, reusable skills, and a self-improving learnings system.

## Why This Exists

- Claude Code benefits from domain-specific context that generic prompts cannot provide
- Repeated workflows (commits, PRs, debugging) should encode best practices once
- Lessons learned in one session should propagate to all future sessions
- Multi-agent coordination requires consistent patterns and handoff protocols

## What's Included

- **10 Specialized Agents** — Domain experts for specific tech stacks
- **14 Skills** — Reusable workflows invoked via slash commands
- **Learnings System** — Institutional knowledge that improves over time (agents + skills)

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

## Learnings System

The learnings system captures patterns and mistakes from real sessions and propagates them appropriately.

### Agent Learnings

Central repository: `learnings/agent-learnings.md`

| Scope | Description | Propagation |
|-------|-------------|-------------|
| **Global** | Scope control, session management, testing | All subagents |
| **Claude Code Only** | Skills, configs, orchestration | Main agent only |
| **Agent-Specific** | Framework/language patterns | Relevant agent only |

**Categories:** Scope Control, Session Management, Multi-Agent Coordination, Autonomous Iteration, Testing Integration

**Command:** `/update-agent-learnings`

### Skill Learnings

Central repository: `learnings/skill-learnings.md`

| Category | Description |
|----------|-------------|
| **Structural Patterns** | Required sections, quality signals |
| **Content Patterns** | Clarity, user interaction |
| **Anti-Patterns** | Common mistakes to avoid |
| **Skill-Specific** | Per-skill insights |

**Command:** `/update-skill-learnings`

### When to Update Learnings

Run the appropriate command after sessions where:
- A preventable mistake occurred
- A better pattern emerged
- User feedback indicated a behavior change needed
- A new skill was created or improved

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
