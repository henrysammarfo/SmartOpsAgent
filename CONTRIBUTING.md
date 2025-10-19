# Contributing to SmartOpsAgent

Thank you for your interest in contributing to SmartOpsAgent! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/smartops-agent.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Development Setup

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Commit Messages

Follow conventional commits format:

\`\`\`
feat: add new monitoring feature
fix: resolve WebSocket connection issue
docs: update setup instructions
refactor: improve agent orchestration logic
test: add unit tests for notification service
\`\`\`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update the README.md if needed
5. Request review from maintainers

## Testing

\`\`\`bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
\`\`\`

## Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists
- Describe the use case clearly
- Explain why it would be valuable
- Consider implementation complexity

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## Questions?

Open an issue with the "question" label or reach out to the maintainers.

Thank you for contributing!
\`\`\`

```json file="" isHidden
