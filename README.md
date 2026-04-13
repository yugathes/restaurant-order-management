# Restaurant Order Management System

## Overview

A role-based restaurant operations platform built as a single-page application. It streamlines the full order lifecycle — from table assignment and item selection through kitchen preparation to completion — replacing paper tickets and fragmented workflows with a unified, real-time interface.

Designed for small-to-mid-scale restaurant operations, the system gives servers, kitchen staff, and managers distinct, purpose-built views of the same live data, reducing miscommunication and order processing time.

## Features

- **Role-based access control** — Three discrete roles (Server, Kitchen, Manager) with context-aware navigation and views
- **Table management** — Visual floor map with real-time available/occupied status and seat capacity
- **Order lifecycle tracking** — Full state machine: `New → Preparing → Ready → Completed`
- **Kitchen Display System (KDS)** — Dedicated kitchen view with animated new-order indicators and elapsed time tracking
- **Menu management** — Full CRUD for menu items with dynamic category support and image URL association
- **Order item editing** — Add/remove items with quantity control and per-item special instructions
- **Dashboard analytics** — Live summary cards for active order counts by status and table occupancy at a glance
- **Persistent sessions** — Authentication state preserved via `localStorage` across page refreshes

## Tech Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 18, TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS, tailwindcss-animate |
| **Component Library** | shadcn/ui (Radix UI primitives) |
| **Routing** | React Router v6 |
| **State Management** | React Context API (Auth, Menu, Order, Table) |
| **Server State / Caching** | TanStack React Query v5 |
| **Form Handling** | React Hook Form + Zod schema validation |
| **Data Visualization** | Recharts |

## Architecture

The application follows a **layered Context + Component** architecture:

```
src/
├── context/        # Global state slices (AuthContext, MenuContext, OrderContext, TableContext)
├── pages/          # Route-level view components (Dashboard, Orders, Kitchen, Tables, MenuManagement)
├── components/     # Shared UI primitives and layout (AppLayout, AppSidebar, ProtectedRoute)
├── types/          # Centralized TypeScript domain types (Order, Table, MenuItem, User, Role)
└── hooks/          # Reusable custom hooks
```

State is managed through four isolated React Contexts, keeping domain concerns separate. Route guards via `ProtectedRoute` enforce authentication before rendering any protected view. Form validation is schema-driven using Zod, decoupling validation rules from component logic.

## Setup & Installation

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
# Clone the repository
git clone https://github.com/yugathes/restaurant-order-management.git
cd restaurant-order-management

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

**Demo credentials** (no password required — match username exactly):

| Username | Role |
|---|---|
| `Server User` | Server |
| `Kitchen User` | Kitchen |
| `Manager User` | Manager |

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

## Key Views

| Route | Description |
|---|---|
| `/` | Dashboard — live order status summary and table occupancy overview |
| `/tables` | Table floor map — create new orders or view active orders per table |
| `/orders` | Order management — add/remove items, set quantities, update order status |
| `/kitchen` | Kitchen Display — queue of active orders with elapsed time and status controls |
| `/menu-management` | Menu CRUD — add, edit, and delete items across dynamic categories |

## Deployment

The application is a static SPA and can be deployed to any static hosting provider.

**Recommended platforms:**
- **Vercel** — `vercel --prod` after linking the repository
- **Netlify** — drag-and-drop the `dist/` folder or connect via Git with auto-deploy
- **GitHub Pages** — configure Vite's `base` path and deploy the `dist/` output

```bash
npm run build
# Deploy the generated dist/ directory
```

For custom domain setup, configure DNS A/CNAME records to point to your hosting provider and update the app's base URL in `vite.config.ts` if deploying to a subpath.

## Future Improvements

- **Backend API integration** — Replace mock context state with a REST or GraphQL API (e.g., Node.js/Express, Laravel) and persistent database (PostgreSQL, MySQL)
- **WebSocket / SSE support** — Push real-time order updates to kitchen and server views without polling
- **Receipt & billing module** — Generate itemised bills, apply discounts, and record payment methods
- **Inventory tracking** — Link menu items to stock levels and auto-flag out-of-stock items
- **Analytics dashboard** — Revenue trends, peak-hour heatmaps, and item popularity reports using Recharts
- **Multi-tenant support** — Namespace data per restaurant branch with tenant-aware routing
- **PWA / offline mode** — Service worker caching for resilience in low-connectivity kitchen environments

## Author

**Yugathes**
[github.com/yugathes](https://github.com/yugathes)
