# Feature-Sliced Design (FSD) Structure

This app follows the Feature-Sliced Design architecture pattern.

## Layers (from top to bottom)

### `app/`
- App initialization, providers, routing configuration
- Global setup (providers, store initialization)
- **Example**: `app/providers.tsx`

### `pages/`
- Page components (composition layer)
- Each page is a composition of widgets/features
- **Example**: `pages/home/index.tsx`

### `widgets/`
- Complex UI blocks
- Compositions of multiple features/entities
- **Example**: `widgets/user-table/index.tsx`

### `features/`
- User interactions and business features
- Self-contained user actions
- **Example**: `features/update-user-tier/index.tsx`

### `entities/`
- Business entities (data models)
- Domain logic for entities
- **Example**: `entities/user/index.tsx`

### `shared/`
- Reusable infrastructure code
- **Subfolders**:
  - `shared/ui` - UI components (buttons, inputs, etc.)
  - `shared/lib` - Utilities and helpers
  - `shared/api` - API client and request utilities
  - `shared/config` - App configuration

## Import Rules (FSD)

- ✅ **Can import from lower layers**: `pages` → `widgets` → `features` → `entities` → `shared`
- ❌ **Cannot import from upper layers**: `shared` cannot import from `entities`
- ✅ **Can import from same layer**: `features/auth` can import from `features/login`

## Path Aliases

- `@/app/*` - App layer
- `@/pages/*` - Pages layer
- `@/widgets/*` - Widgets layer
- `@/features/*` - Features layer
- `@/entities/*` - Entities layer
- `@/shared/*` - Shared layer

## Example Usage

```tsx
// pages/home/index.tsx
import { UserTable } from '@/widgets/user-table';
import { UpdateUserTier } from '@/features/update-user-tier';

export function HomePage() {
  return (
    <div>
      <UserTable />
      <UpdateUserTier />
    </div>
  );
}
```

