# Architecture

Modular architecture where code is organized by domain/feature for separation of concerns and reusability.

## Structure

```
src/
├── app/          # Pages, layouts, API routes
├── modules/      # Feature modules (e.g., conversations)
└── shared/       # Reusable components, hooks, utilities
```

## Directories

### `app/`
Pages, layouts, and API routes.
- `api/` - API endpoints

### `modules/`
Each module is organized by domain (e.g., `conversations/`):
```
modules/conversations/
├── service/      # Business logic & server methods
├── components/   # React components
├── hooks/        # Custom hooks
├── types/        # TypeScript types
├── utils/        # Helper functions
└── tests/        # Tests
```

### `shared/`
Reusable code across modules:
- `components/` - Common UI components
- `layouts/` - Global layouts
- `hooks/` - Common hooks
- `utils/` - Common utilities
- `types/` - Global types
- `constants/` - App constants

## Principles

1. **Modularity** - Each feature is self-contained
2. **Separation of Concerns** - service (logic), components (UI), hooks (state), types (contracts), utils (helpers)
3. **Dependencies** - Modules → shared (never reverse)
4. **Scalability** - Add new modules without affecting existing code
5. **No Circular Dependencies** - Modules shouldn't import from each other