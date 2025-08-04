# Contributing to UIGen

Thank you for your interest in contributing to UIGen! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/uigen.git`
3. Install dependencies: `npm install`
4. Set up the database: `npm run setup`
5. Start the development server: `npm run dev`

## Development Workflow

1. Create a new branch for your feature/fix: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Write or update tests as needed
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes with a descriptive message
7. Push to your fork and create a pull request

## Code Style

- Follow the existing code style and conventions
- Use TypeScript for all new code
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting a PR
- Test both happy path and error scenarios
- Use React Testing Library for component tests
- Mock external dependencies appropriately

## Pull Request Guidelines

- Fill out the PR template completely
- Include a clear description of changes
- Reference any related issues
- Ensure CI checks pass
- Request review from maintainers

## Architecture Notes

UIGen uses:
- **Next.js 15** with App Router
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prisma** with SQLite for data persistence
- **Vitest** for testing
- **AI integration** via Anthropic Claude

### Key Concepts

- **Virtual File System**: In-memory file management
- **AI-Powered Generation**: Natural language to React components
- **Real-time Preview**: Live component rendering
- **User Experience Modes**: Simple vs Developer interfaces

## Questions?

Feel free to open an issue for any questions or clarifications needed.