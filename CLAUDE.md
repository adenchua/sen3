# SEN3 — Claude Code Guide

## Project Overview

SEN3 is a **Telegram keyword alert system**. It crawls messages from subscribed Telegram channels and groups, then sends notifications to users only when their chosen keywords appear. An admin dashboard manages chats, subscribers, and alert configurations ("decks").

## Architecture

Six Docker services work together:

| Service | Tech | Port | Purpose |
|---|---|---|---|
| `opensearch-node` | OpenSearch 2.18 | 9200 | Primary database |
| `opensearch-dashboards` | OpenSearch Dashboards | 5601 | DB admin UI |
| `telegram-service` | Python 3.13 / Flask | 5099 | Telegram API bridge |
| `backend-service` | Node.js 22 / Express 5 | 5098 | REST API |
| `scripts` | Python 3.13 | — | Background jobs (crawl + notify) |
| `frontend` | React 19 / Nginx | 3400 | Admin dashboard |

Services start in dependency order via Docker health checks. `scripts` waits for all other services to be healthy before running.

## Tech Stack

- **Backend**: Node.js 22, Express 5, TypeScript 5.7, OpenSearch Client 3
- **Frontend**: React 19, Vite 6, MUI 7, TanStack Query 5, React Router 7, Recharts
- **Python services**: Python 3.13, python-telegram-bot 22, HTTPX
- **Database**: OpenSearch 2.18 (replaces Elasticsearch)
- **Infrastructure**: Docker + Docker Compose

## Project Structure

```
sen3/
├── backend/              Express REST API (TypeScript)
├── frontend/             React admin dashboard
├── telegram-service/     Python Flask — Telegram API wrapper
├── telegram-bot-runner/  Python — Telegram bot (commands + notification delivery)
├── scripts/              Python — background jobs (crawling, notification dispatch)
├── database/mappings/    OpenSearch index mapping definitions
├── .env.template         All environment variable definitions with descriptions
├── docker-compose.yml          Production
└── docker-compose.local.yml    Local development
```

## Commands

### Run the stack

```bash
docker compose -f docker-compose.local.yml up    # local dev
docker compose up                                  # production
```

### Backend

```bash
cd backend
npm run start:dev   # hot-reload dev server (uses .env.development)
npm run build       # compile TypeScript → dist/
npm run lint        # ESLint + tsc --noEmit
npm run format      # Prettier
```

### Frontend

```bash
cd frontend
npm run start:dev   # Vite dev server
npm run build       # tsc + Vite production build
npm run lint        # ESLint + tsc --noEmit
npm run format      # Prettier
```

## Environment Setup

Copy `.env.template` → `.env` and fill in:

- `OPENSEARCH_USERNAME` / `OPENSEARCH_PASSWORD`
- `TELEGRAM_API_ID` / `TELEGRAM_API_HASH` / `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_SERVICE_API_URL` — URL backend uses to reach telegram-service
- `VITE_BACKEND_API_URL` — URL frontend uses to reach backend (empty in prod when co-hosted)
- `TELEGRAM_BOT_ADMIN_TOKEN` — secret token required by the `/approve_user` admin bot command
- Background job intervals: `CHAT_MESSAGES_JOB_INTERVAL_MINS`, `SUBSCRIBER_NOTIFICATION_JOB_INTERVAL_MINS`, `CHAT_UPDATE_JOB_INTERVAL_DAYS`

## Backend Patterns

### Layered architecture

```
Routes → Controllers → Models → Services (DatabaseService / TelegramService)
```

### Key files

- `backend/src/index.ts` — Express server setup, middleware, route mounting
- `backend/src/singletons.ts` — Shared `DatabaseService` and `TelegramService` instances
- `backend/src/classes/QueryBuilder.ts` — Fluent OpenSearch query builder
- `backend/src/services/DatabaseService.ts` — All OpenSearch operations
- `backend/src/services/TelegramService.ts` — Calls out to `telegram-service`

### Controllers

Each controller file exports an object with:
- `controller` — async Express handler
- `validator` — express-validator chain

### Response envelopes

Success: `{ data: ..., status: "success", meta: { datetime } }`
Error: `{ status: "error", error: { errorCode, message, details }, meta: { datetime } }`

### API base path

All endpoints under `/api/v1/`: `chats`, `messages`, `subscribers`, `decks`, `deck-templates`, `notifications`, `telegram`, `analytics`

## Data Model Conventions

Every model has two representations and transform methods between them:

- **Application layer**: camelCase properties, `Date` objects (e.g. `createdDate: Date`)
- **Database layer**: snake_case properties, ISO 8601 strings (e.g. `created_date: string`)
- Transform methods: `transformToRaw()` (app → DB) and `transformTo[Type]()` (DB → app)

OpenSearch indexes use **strict mapping** — undeclared fields are rejected. Dates must be `strict_date_time` (ISO 8601). Index definitions live in `database/mappings/`.

## Domain Concepts

- **Deck**: A subscriber's alert config — which chats to monitor + which keywords to match. Has `isActive`, `isMuted`, and `lastNotificationDate` (used to deduplicate notifications).
- **DeckTemplate**: Reusable deck configuration. Templates marked `isDefault` are automatically applied to new subscribers.
- **Chat crawling**: Background job paginates through messages using `messageOffsetId` as a cursor. `crawlActive` flag enables/disables crawling per chat.
- **Notification dispatch**: Matches crawled messages against each subscriber's deck keywords. Records matched keywords and timestamp in a `notification` document.
- **participantStats**: Array on each chat tracking member count over time (appended by the daily `ChatUpdateBackgroundJob`).

## Python Services

### scripts/ (background jobs)

`scripts/main.py` runs three async jobs concurrently:
- `ChatMessagesBackgroundJob` — crawls new messages from active chats
- `ChatUpdateBackgroundJob` — updates participant counts daily
- `SubscriberNotificationBackgroundJob` — dispatches notifications to subscribers

### telegram-bot-runner/

Handles Telegram bot commands and delivers notification messages to subscribers via the Telegram Bot API.

**User commands**: `/start`, `/subscribe`, `/unsubscribe`, `/modify_keywords`, `/new_deck`, `/delete_deck`, `/mute_deck`, `/unmute_deck`

**Admin commands**: `/approve_user` — approves pending subscriber registrations; requires `TELEGRAM_BOT_ADMIN_TOKEN` for authentication.

Bot commands are registered with Telegram on startup via the `post_init` hook on `ApplicationBuilder` in `main.py`, which calls `bot.set_my_commands()` to populate the in-chat command menu automatically.

**API client (`api_client.py`) return conventions:**
- `api_get()` / `api_post()` — return `dict | None` (parsed JSON body, or `None` on error)
- `api_patch()` — returns `dict | bool | None`: parsed JSON if a body is present, `True` if the request succeeded with no body (e.g. 204 No Content), `None` on error
- `api_delete()` — returns `bool` (`True` on success, `False` on error)

**Backend PATCH and DELETE endpoints return 204 No Content** (no response body). Commands must check `if result is not None:` (not `if result:`) to gate success messages, since `True` is the success sentinel for empty responses.

### telegram-service/

Flask API that wraps the Telegram client API. The backend calls it to fetch chat info and messages without directly holding Telegram credentials.

## Code Style

- **TypeScript/JS**: Prettier, 100-char line width, 2-space indent, semicolons, no trailing commas on single-line
- **Python**: Black formatter, MyPy type checking
  - No single-letter variable names — use descriptive names everywhere (e.g. `error` not `e`, `response` not `r`)
  - Every function must have a docstring describing what it does and what it returns
- No tests are currently configured (`npm test` exits with error)

## TypeScript Configuration

`backend/tsconfig.json` uses `moduleResolution: "node10"` with `ignoreDeprecations: "6.0"` and `module: "CommonJS"`. This is intentional — TypeScript 6 deprecated `node10` in favour of `node16`, but switching to `node16` breaks deep sub-path imports from `@opensearch-project/opensearch` (e.g. `@opensearch-project/opensearch/api/_types/_common`). The package has a `"./*": "./*"` wildcard in its exports map but TypeScript's `node16` resolver does not resolve type declarations through it. Keep `node10` until the OpenSearch package adds explicit type entries in its exports map.

## npm Dependency Management

- **Never use `--legacy-peer-deps`** when installing packages.
- To resolve peer dependency conflicts: delete `node_modules/` and `package-lock.json`, then run a clean `npm install`.
- Some `node_modules` files may be owned by `root` (from Docker runs) — use `sudo rm -rf node_modules package-lock.json` if `rm -rf` fails with permission errors.
