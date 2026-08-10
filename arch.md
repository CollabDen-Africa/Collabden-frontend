Ran command: `npm run dev`
Listed directory Collabden
Listed directory collabden-frontend
Viewed package.json:1-40
Listed directory app
Viewed globals.css:1-204
Listed directory constants
Listed directory lib
Listed directory context
Listed directory services
Listed directory components
Listed directory features
Listed directory ui
Listed directory layout
Listed directory %28dashboard%29
Listed directory %28app-shell%29
Listed directory %28admin%29
Listed directory admin
Listed directory %28marketing%29
Listed directory %28standalone%29
Viewed middleware.ts:1-67
Viewed routes.ts:1-42
Viewed axios.ts:1-29
Viewed AuthContext.tsx:1-294
Listed directory docs
Listed directory hooks
Listed directory types

Here is a comprehensive architectural and design audit of the **Collabden Frontend** (`collabden-frontend`) codebase.

---

### 1. Technology Stack & Ecosystem

* **Framework & Core**: [Next.js 15.5](file:///c:/Users/Stella/Desktop/Web%20Practices/Next%20Projects/Collabden/collabden-frontend/package.json#L18) (App Router, Server Components & Route Handlers), [React 19](file:///c:/Users/Stella/Desktop/Web%20Practices/Next%20Projects/Collabden/collabden-frontend/package.json#L20), and TypeScript 5.
* **Styling**: [Tailwind CSS v4](file:///c:/Users/Stella/Desktop/Web%20Practices/Next%20Projects/Collabden/collabden-frontend/app/globals.css#L1-L74) (`@import "tailwindcss"`, `@theme inline`, native CSS variable integration).
* **Data Fetching & State**: [TanStack React Query v5](file:///c:/Users/Stella/Desktop/Web%20Practices/Next%20Projects/Collabden/collabden-frontend/package.json#L15) paired with custom domain hooks and `AuthContext`.
* **HTTP Client & Unified API Communication**: Unified [axiosInstance](file:///c:/Users/Stella/Desktop/Web%20Practices/Next%20Projects/Collabden/collabden-frontend/lib/axios.ts) configured with `withCredentials: true` for direct cross-origin API calls with HTTP-only cookies (`NEXT_PUBLIC_API_BASE_URL`). Hybrid Next.js internal `/api/*` proxies have been deprecated in favor of direct API communication.
* **Form Handling & Validation**: React Hook Form with Zod schemas & `@hookform/resolvers`.
* **Icons & Animation**: `@hugeicons/react`, `react-icons`, Framer Motion, and `recharts` for dashboards.

---

### 2. Brand Identity & Design System

The application relies on a dark-mode default theme (`--background: #000000; --foreground: #FFFFFF`), configured in [globals.css](file:///c:/Users/Stella/Desktop/Web%20Practices/Next%20Projects/Collabden/collabden-frontend/app/globals.css).

#### **Color Palette & Design Tokens**

| Category | Token / Variable | Hex Value | Primary Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `--primary-blue` | `#204F99` | Secondary buttons, primary accents |
| **Primary Brand** | `--primary-green` | `#73BF44` | Primary brand accent, main action buttons, scrollbar thumbs |
| **Secondary Brand**| `--secondary-blue` | `#6495ED` | Highlighted text & secondary elements |
| **Accents** | `--accent-green-bright` | `#1EFD05` | Hover state for scrollbars & glowing status |
| | `--accent-green-success`| `#34A853` | Success notifications / indicators |
| | `--accent-red` / `-alt` | `#FF0404` / `#FF0000` | Errors, destructive actions |
| | `--accent-pink` | `#D924F9` | Special badges / accents |
| | `--accent-yellow` | `#FBBC04` | Warnings / pending states |
| **Soft Tones** | `--accent-soft-blue` | `#D6E6FF` | Light backgrounds / badges |
| | `--accent-soft-green`| `#D9FBC4` | Subtle success alerts |
| | `--accent-soft-pink` | `#FFD4F4` | Soft callouts |
| **Surfaces & Cards**| `--card-bg` | `#505050` | Primary container background |
| | `--card-bg-alt` | `#444444` | Secondary surface background |
| **Typography** | Font Family | `Raleway` (sans), `Geist Mono` (code) | Primary headings and text |

#### **Buttons & Interactive Components**
* **Primary Buttons** (`.btn-primary`): Feature green gradient background with `translateY(-2px)` hover effect and soft drop shadows (`--shadow-btn-primary`).
* **Secondary Buttons** (`.btn-secondary`): Deep primary blue (`#204F99`) with brightness scale hover state.
* **Custom Scrollbar** (`.custom-scrollbar`): Thin custom scrollbar styled with `--primary-green` and hover glow `#1EFD05`.
* **Messaging Bubbles**: Asymmetric rounded corners (`.rounded-msg-me`: top-right/bottom-left curved, `.rounded-msg-them`: top-left/bottom-right curved).

---

### 3. Folder & Directory Architecture

```
collabden-frontend/
├── app/                      # Next.js 15 App Router
│   ├── (admin)/              # Route Group: Admin Authentication & Management Dashboard
│   ├── (dashboard)/          # Route Group: User Dashboard & App Shell (messages, projects, payments)
│   ├── (marketing)/          # Route Group: Landing page, Waitlist, Marketing pages
│   ├── (standalone)/         # Route Group: User profile, settings, project details
│   ├── auth/                 # Login, Signup, Password Reset, Email Verification flows
│   ├── globals.css           # Tailwind v4 theme setup and CSS variable tokens
│   └── middleware.ts         # Edge route protection & token authentication checks
├── components/
│   ├── features/             # Feature-based modular components (agreements, messaging, wallet, admin)
│   ├── layout/               # Global navigation, footers, headers, sidebars
│   ├── providers/            # React Query & Auth provider wrappers
│   └── ui/                   # Reusable atomic UI components (Button, Input, Modal, Table, Pill, etc.)
├── constants/                # Route definitions (`routes.ts`) and API endpoints (`api-endpoints.ts`)
├── context/                  # Global context stores (AuthContext, WorkspaceContext, TourContext)
├── hooks/                    # Domain-specific React Query hooks (auth, admin, escrow, messaging, etc.)
├── lib/                      # Axios clients (`axiosInstance`), error handlers, mock data, and Zod validators
├── services/                 # Class/Object API service abstractions for direct backend communication
└── types/                    # TypeScript interfaces for API payloads and entities
```

---

### 4. Application Architecture & Data Flow

#### **1. Authentication & Route Guarding**
* **Middleware Guard** ([middleware.ts](file:///c:/Users/Stella/Desktop/Web%20Practices/Next%20Projects/Collabden/collabden-frontend/middleware.ts#L17-L50)): Inspects HTTP cookies (`auth-token`) for protected routes (`/dashboard`, `/projects`, `/workspace`, `/intro`, `/admin/*`). In development, bypass logic allows active iteration.
* **Unified Direct API Strategy**:
  * `axiosInstance`: Direct requests to backend service (`NEXT_PUBLIC_API_BASE_URL`) configured with `withCredentials: true` to ensure HTTP-only session cookies pass directly from the client browser to the backend server across all environments.
* **Auth Context** ([AuthContext.tsx](file:///c:/Users/Stella/Desktop/Web%20Practices/Next%20Projects/Collabden/collabden-frontend/context/AuthContext.tsx#L54-L285)): Manages global user state (`user`, `isAuthenticated`, `isLoading`), handles onboarding redirection, and integrates React Query mutations for standard login, admin 2FA verification, signup, and logout.

#### **2. Service Layer & Hooks Pattern**
The architecture enforces strict separation of concerns:
* **`services/*.service.ts`**: Pure async API methods handling HTTP calls via `axiosInstance` and `API_ENDPOINTS`.
* **`hooks/*/*.ts`**: Custom React Query hooks wrapping services for caching, revalidation, and loading/error states.
* **`components/features/*`**: Smart container & presentation components subscribing to custom hooks.

---

### Summary & Key Deductions

1. **Production-grade Next.js 15 setup**: Clear separation between route groups (`(dashboard)`, `(admin)`, `(marketing)`), preventing unnecessary bundle overhead.
2. **Clean Brand Design Token Standard**: Well-defined Tailwind v4 inline theme mapping primary brand blue (`#204F99`) and green (`#73BF44`) across components.
3. **Structured Admin & User Workflows**: Dedicated 2FA flow for admin users alongside regular user onboarding (`/intro` to `/dashboard`).
4. **Admin Roles & Permissions Architecture**: Integrated `/admin/roles` route group backed by `adminRolesService` (`services/admin/roles.service.ts`), `useAdminRoles` custom hook, `RoleCard`, `CreateRoleModal`, and `RoleDetailsModal` feature components for RBAC management.
5. **Unified Direct API Communication**: Standardized direct backend requests using `axiosInstance` with `withCredentials: true`, eliminating hybrid proxy overhead.