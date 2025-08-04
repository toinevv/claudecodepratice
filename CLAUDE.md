# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview capabilities. It uses Claude AI to convert natural language descriptions into working React components with real-time rendering.

## Development Commands

```bash
# Initial setup (required after cloning)
npm run setup

# Development (recommended - uses Turbopack)
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build

# Database operations
npm run db:reset  # Reset database with fresh migrations
```

## Architecture Overview

### Virtual File System
The application uses an in-memory virtual file system (`src/lib/file-system.ts`) instead of writing files to disk. All file operations (create, update, delete) happen in memory and can be persisted to the database.

### AI Integration
- Uses Anthropic Claude via Vercel AI SDK
- Streaming responses with tool calling support
- Custom tools for file management operations
- Located in `src/app/api/chat/route.ts`

### State Management
- **FileSystemContext**: Manages virtual file system state
- **ChatContext**: Manages AI conversation and component generation
- React Context API for global state management

### Database Schema
- SQLite with Prisma ORM
- Users table for authentication
- Projects table stores file system and chat messages as JSON
- Schema in `prisma/schema.prisma`

## Key Technical Details

### Tech Stack
- Next.js 15 with App Router
- React 19
- TypeScript with strict mode
- Tailwind CSS v4
- Prisma with SQLite
- Radix UI for accessible components
- Monaco Editor for code editing

### Authentication
- JWT-based sessions
- Middleware protects API routes
- Anonymous usage supported
- Implementation in `src/middleware.ts`

### Component Structure
```
src/components/
├── auth/        # Authentication components
├── chat/        # AI chat interface
├── editor/      # Code editor components
├── preview/     # Live preview components
└── ui/          # Reusable UI components (shadcn/ui)
```

### Testing
- Vitest with React Testing Library
- Test files in `__tests__` directories
- Run single test: `npm test -- path/to/test.spec.ts`
- Add not that much tests

## Important Considerations

1. **No Direct File System Access**: All file operations must go through the virtual file system
2. **Streaming Responses**: AI responses use streaming for better UX
3. **Optional Authentication**: App works without login for quick prototyping
4. **Real-time Preview**: Component changes trigger immediate re-renders
5. **Error Boundaries**: Preview has error handling to prevent crashes from invalid code
```