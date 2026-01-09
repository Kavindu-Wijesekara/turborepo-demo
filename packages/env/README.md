# @acme/env

Type-safe environment variables for the monorepo using Zod.

## Usage

```typescript
import { ENV } from "@acme/env";

// Use environment variables with full type safety
const databaseUrl = ENV.DATABASE_URL;
const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
```

## Adding New Variables

1. Add the variable to the appropriate schema in [src/index.ts](./src/index.ts)
2. Add it to [.env.example](../../.env.example)
3. The app will fail to build if the variable is not provided
