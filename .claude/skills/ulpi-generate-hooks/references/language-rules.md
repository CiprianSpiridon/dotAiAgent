# Language-Specific Rules

## Node.js / TypeScript

```yaml
permissions:
  auto-approve-npm:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "npm"
    decision: allow

  auto-approve-pnpm:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "pnpm"
    decision: allow

  auto-approve-yarn:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "yarn"
    decision: allow

  auto-approve-bun:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "bun"
    decision: allow

  auto-approve-node:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "node"
    decision: allow

  auto-approve-npx:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "npx"
    decision: allow

postconditions:
  install-after-package-json:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "package.json"
    run: "{package_manager} install"
    timeout: 60000
    enabled: false
```

## Python

```yaml
permissions:
  auto-approve-pip:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "pip"
    decision: allow

  auto-approve-python:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "python"
    decision: allow

  auto-approve-poetry:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "poetry"
    decision: allow

  auto-approve-uv:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "uv"
    decision: allow

  auto-approve-pytest:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "pytest"
    decision: allow

  auto-approve-ruff:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "ruff"
    decision: allow

postconditions:
  install-after-requirements:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "requirements*.txt"
    run: "pip install -r {file_path}"
    timeout: 60000
    enabled: false
```

## Go

```yaml
permissions:
  auto-approve-go:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "go"
    decision: allow

postconditions:
  go-mod-tidy:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "go.mod"
    run: "go mod tidy"
    timeout: 30000
    enabled: false

  go-vet:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "*.go"
    run: "go vet ./..."
    timeout: 20000
    block_on_failure: false
    enabled: false
```

## Rust

```yaml
permissions:
  auto-approve-cargo:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "cargo"
    decision: allow

postconditions:
  cargo-check:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "*.rs"
    run: "cargo check"
    timeout: 60000
    block_on_failure: false
    enabled: false
```

## PHP

```yaml
permissions:
  auto-approve-composer:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "composer"
    decision: allow

  auto-approve-php:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "php"
    decision: allow

postconditions:
  composer-install:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "composer.json"
    run: "composer install"
    timeout: 60000
    enabled: false
```

## Ruby

```yaml
permissions:
  auto-approve-bundle:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "bundle"
    decision: allow

  auto-approve-ruby:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "ruby"
    decision: allow

  auto-approve-rake:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "rake"
    decision: allow

postconditions:
  bundle-install:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "Gemfile"
    run: "bundle install"
    timeout: 60000
    enabled: false
```

## Java

```yaml
permissions:
  auto-approve-mvn:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "mvn"
    decision: allow

  auto-approve-gradle:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "gradle"
    decision: allow

  auto-approve-gradlew:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "./gradlew"
    decision: allow
```

## C# / .NET

```yaml
permissions:
  auto-approve-dotnet:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "dotnet"
    decision: allow

postconditions:
  dotnet-build:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "*.cs"
    run: "dotnet build"
    timeout: 60000
    block_on_failure: false
    enabled: false
```

## Elixir

```yaml
permissions:
  auto-approve-mix:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "mix"
    decision: allow

  auto-approve-iex:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "iex"
    decision: allow

postconditions:
  mix-deps-get:
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "mix.exs"
    run: "mix deps.get"
    timeout: 60000
    enabled: false
```

## Docker (Add if Dockerfile present)

```yaml
permissions:
  auto-approve-docker:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "docker"
    decision: allow

  auto-approve-docker-compose:
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "docker compose"
    decision: allow

  block-system-prune:
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "docker system prune"
    decision: deny
    message: "docker system prune removes all unused data."
```
