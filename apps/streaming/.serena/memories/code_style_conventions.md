# Code Style and Conventions

## General Conventions
- TypeScript is used throughout the project
- "use client" directive for client components
- Functional components with hooks
- Interface definitions for prop types
- Consistent naming: PascalCase for components, camelCase for variables/functions

## Component Structure
- Components are in `src/components/` directory
- Each component has its own .tsx file
- Props interfaces defined above the component
- Export as named functions

## Styling
- Tailwind CSS for all styling
- Responsive design patterns (sm:, md:, lg: breakpoints)
- Dark theme focus with appropriate color schemes
- Hover states and transitions for interactive elements

## Import Organization
- Next.js imports first
- React hooks and third-party libraries
- Local component imports
- API imports last

## State Management
- useState for local component state
- useQuery from Convex for data fetching
- Custom hooks for reusable logic