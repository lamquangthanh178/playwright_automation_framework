# Demoblaze Automation Framework.

Playwright + TypeScript test suite for https://www.demoblaze.com.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run UI tests
npx playwright test 'tests/ui'

# 3. Run API tests
npx playwright test 'tests/api'

# 4. Run eslint (Find and fix problems in your JavaScript code)
npx eslint . --fix 
```
## CI/CD – GitHub Actions

The pipeline lives in `.github/workflows/playwright.yml` and runs automatically on:
- **Push** to `main` or `develop`
- **Pull Request** to `main`
- **Manual trigger** via GitHub UI (`workflow_dispatch`)
- HTML report uploaded as artifact (7-day retention)

## Architecture & Design

### 1. Test Isolation

Each spec file owns an **independent user account**, stored in `ACCOUNTS` in `constants.ts`:

```typescript
export const ACCOUNTS = {
  LOGIN:       { username: 'auto_login_user',       password: '...' },
  ADD_CART:    { username: 'auto_addcart_user',      password: '...' },
  REMOVE_CART: { username: 'auto_removecart_user',   password: '...' },
  PURCHASE:    { username: 'auto_purchase_user',     password: '...' },
};
```

Every `beforeEach` calls `clearCart` before seeding test data, giving each test a deterministic starting state regardless of what the previous test left behind.

---

### 2. Preventing Data Collision During Parallel Execution

Specs are safe to run in parallel because:
- Different accounts → different session tokens → no shared browser state
- `clearCart()` at the start of each test guarantees a clean slate
  
### 3. Test Data Management Strategy

All test data is centralised in `data/constants.ts` with no magic strings in spec files:

```
PRODUCTS    → product id, name, category, price
ACCOUNTS    → one account per spec
CHECKOUT    → default billing details with per-test override support
```

### 4. API Validation Strategy

The API layer has two distinct uses:

| Layer | Used in | Purpose |
|---|---|---|
| `api/*.ts` classes | `tests/api/` | Validate API contracts |
| `helpers/ApiHelpers.ts` | `tests/ui/` | Seed / tear down data only |


### 5. Scaling to 200+ Test Cases

| Concern | Current approach | At scale |
|---|---|---|
| New pages | Add a class + one getter in `POManager` | No change needed |
| New specs | Drop a file in `tests/ui/` or `tests/api/` | Sub-folders per feature |
| More accounts | Register manually | Handle register by automation or api |
| Repeated setup | `beforeEach` in each spec | Extract to a shared Playwright fixture |
| More workers | Set `workers` in `playwright.config.ts` | Each spec = one parallel unit, no code changes |


**Parallelism** — `playwright.config.ts` already sets `workers: 4` on CI. Each spec file is a natural unit of parallelism because they use separate accounts. Adding more specs adds parallelism automatically without configuration changes.
