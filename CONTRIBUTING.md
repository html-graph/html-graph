# Contributing to HTMLGraph

First off, thank you for considering contributing to HTMLGraph! It's people like you that make this library better for everyone.

## Getting Started

### Project Structure

```
html-graph/
├── src/
│   ├── canvas/              # Main object for managing graph visualization
│   ├── canvas-builder/      # Object responsible for canvas configuration
│   ├── canvas-error/        # Error behavior related entities
│   ├── center-fn/           # Function which determines node's center
│   ├── configurators/       # Canvas extension with useful extra features
│   ├── dimensions/          # Viewport dimensions model
│   ├── edges/               # Visualization for connections
│   ├── element/             # Model for HTML elements
│   ├── event-subject/       # Straightforward implementation of observer pattern
│   ├── graph/               # Public model for graph
│   ├── graph-controller/    # Logic for graph manipulation
│   ├── graph-store/         # Internal model for graph
│   ├── html-view/           # HTML representation for graph
│   ├── identifier/          # Identifier model for nodes, ports, and edges
│   ├── layouts/             # Automatic node coordinate calculation
│   ├── mocks/               # Unit-test related objects
│   ├── point/               # Model for point in 2D space
│   ├── priority/            # Z-index calculation for nodes and edges
│   ├── prng/                # Pseudo-random number generator
│   ├── radii/               # Cover radius model for 2D space
│   ├── schedule-fn/         # Delay for actions
│   ├── transformations/     # Analytical geometry operations
│   ├── viewport/            # Public model for viewport
│   ├── viewport-store/      # Internal model for viewport
│   └── viewport-controller/ # Logic for viewport manipulation
├── use-cases/            # Examples and E2E tests
```

## How Can I Contribute?

### Reporting Bugs

When creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (include a minimal reproduction on CodeSandbox or similar)
- **Describe the behavior you observed and what you expected to see**
- **Include screenshots or animated GIFs** if relevant
- **Include your environment**: browser version, OS, HTMLGraph version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples** of how it would work
- **Describe the current behavior and why it needs improvement**
- **Explain why this enhancement would be useful** to most users
- **List any alternative solutions you've considered**

### Pull Requests

#### Process

1. **Fork the repository** and create your branch from `master`
2. **Check for open issues** that your PR would address
3. **Add or update tests** before adding or changing functionality
   This project follows a Behavior Driven Development approach:
   - Add a failing test
   - Make the failed test pass
   - Refactor
4. **Update documentation** for any API changes (see [Documentation repository](https://github.com/html-graph/html-graph.github.io))
5. **Submit the pull request** with a clear description, ensuring all validation checks pass

#### PR Guidelines

- Keep PRs focused on a single feature or fix
- Reference related issues using `#issue-number`
- Request review from maintainers after CI passes

## Development Setup

### Clone and Install

```bash
# Clone your fork
git clone https://github.com/{{YOUR_USERNAME}}/html-graph
cd html-graph

# Add upstream remote
git remote add upstream https://github.com/html-graph/html-graph

# Install dependencies
npm install

# Build the library
npm run build

# Run development server
npm run start
```

### Available Scripts

```bash
npm run start            # Start development server with hot reload
npm run build            # Build production bundle
npm run test             # Run unit tests
npm run test:watch       # Run unit tests in watch mode
npm run test:e2e         # Run end-to-end tests
npm run lint             # Check code style
npm run fix-lint         # Fix code style issues
npm run check-formatting # Check formatting with Prettier
npm run fix-formatting   # Fix formatting with Prettier
```

### Use Cases

- Add a use case for new features
- Keep use cases simple and focused
- Add Playwright end-to-end tests

### Versioning Guidelines

- **Major**: Breaking API changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

---

**Thank you for contributing to HTMLGraph!**
