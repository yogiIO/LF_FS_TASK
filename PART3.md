# Part 3 — What I found, what I changed, why

Short notes for reviewers. I fixed what I could without turning the take-home into a platform.

## 11. API design and security

**Found**
- Auth middleware was a no-op; mutating routes used `req.user.id` and would crash.
- No login; JWT never issued.
- DB user/password and host were hardcoded.
- User payloads must never include `password_hash`.
- Error handler forwarded `err.message` (can leak SQL/Sequelize details).
- `GET /api/users` is public (fine for this app; in production you would paginate and maybe require auth).

**Changed**
- JWT in an **httpOnly** cookie (`SameSite=Lax`, `Secure` in production). Not returned in JSON. Bearer still accepted for curl/Postman.
- `JWT_SECRET` from env; verify pinned to **HS256**.
- Zod on login/register and on create post/comment (title 50, body 1000, comment 500).
- CORS allowlist + `credentials: true` for the Vite origin.
- Login failures use the same 401 message (no email enumeration).
- 500s log the real error on the server; the client only gets `Internal server error`.
- Optional auth on the feed so `liked` can be set without making the feed private.

## 12. Backend efficiency and dead code

**Found**
- Feed `findAll` with no limit.
- User profile included posts/comments **and** ran separate `count`/`sum` queries.
- Trending/search `require('sequelize')` inside handlers.
- Feed/trending loaded comment rows only to compute `comment_count`.

**Changed**
- Paginated feed (`page`/`limit`, default 20, max 50, `distinct: true`).
- Top-level `Op` import.
- Serializers that flatten `author` for the UI and never leak `password_hash` or raw like rows.

**Not fully cleaned (honest leftovers)**
- Profile still double-fetches (include + count). Easy later: drop the include and keep aggregates.
- `comment_count` via included ids instead of a `COUNT(*)` subquery.
- Search `LIKE '%q%'` cannot use a normal index (FULLTEXT later).
- MySQL unique on nullable `post_id`/`comment_id` still does not collide on NULL. Likes run in a row lock + transaction so the count cannot drift in the normal path.

## 13. Frontend behaviour

**Found**
- Hardcoded `userId = 1`, no login UI, token in `localStorage`.
- Like only (no unlike), no empty/error states, `content.substring` could throw.
- One long page with almost no routing or loading states.

**Changed**
- Login/register/logout, cookie `withCredentials`, `GET /api/profile` to restore session.
- Heart toggles like/unlike from a real `liked` flag (no 400-as-toggle). Optimistic update so the feed does not jump.
- Toasts for “log in to like”; empty/error/loading states; ErrorBoundary around the app.
- React Router + MUI: feed, trending, search, profile (protected), login/register.
- Logged-in feed: infinite scroll, 20 at a time, bottom loader, then “You're all caught up”.
- Guests: 20 posts, then “Log in to view more”.
- Axios client, `useSession` / `useFeed` / `useInfiniteScroll`.

## 14. Environments

**Found**
- Hardcoded DB, API URLs, and secrets.

**Changed**
- `.env` / `.env.example`: `DB_*`, `JWT_SECRET`, `PORT`, `FRONTEND_ORIGIN`, `VITE_API_BASE_URL`.
- Sequelize logging off when `NODE_ENV=production`.
- Scripts: `npm run dev` (API + Vite), or `dev:api` / `dev:web` separately.

Copy `.env.example` → `.env` per machine. Never commit `.env`.

## 15. Structure

**Found**
- Entire backend in one file; frontend similar.

**Changed**

```
src/config              database, JWT/cookie
src/models              schema + associations
src/middleware          auth, validate, errors
src/validators          Zod
src/controllers         HTTP actions
src/routes              URL wiring
src/serializers         API shape for the UI
src/frontend/api        axios instance
src/frontend/hooks      session, feed, infinite scroll
src/frontend/context    session, toasts
src/frontend/pages      routes
src/frontend/components layout, cards, ErrorBoundary
backend_express.js      boot only
main.jsx                Vite entry
```

No extra service layer. Controllers stay thin enough for this app.

## How to run

1. MySQL: `social_media_db`, `schema.sql`, `insert_data.sql`
2. `.env` with real `DB_PASSWORD` and a random `JWT_SECRET` (`openssl rand -hex 64`)
3. `npm run dev` → API `:3000` and UI `:5173`  
   or `node backend_express.js` and `npx vite` separately
4. **Register a new user** (seed password hashes are not bcrypt)
