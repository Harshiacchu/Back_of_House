# CLAUDE.md: Back of House

Boston restaurant inspections decoded into plain-English kitchen reports, a visit log, group
dinner polls and saved lists. CS5610 Project 3. Two teammates, two independent features.

Read this whole file before doing anything in this repo.

---

## 1. Who am I working for? (do this first, every session)

Run `echo $BOH_OWNER; git config user.name; git config user.email` and decide:

| Signal                                               | You are working for                             |
| ---------------------------------------------------- | ----------------------------------------------- |
| `BOH_OWNER=harshitha`, or git name/email has "harsh" | **Harshitha** (`@Harshiacchu`)                  |
| `BOH_OWNER=ayush`, or git name/email has "ayush"     | **Ayush** (`@ayushp2207`)                       |
| Neither                                              | Ask the user, then suggest `export BOH_OWNER=…` |

State it in your first reply: _"Working as Harshitha. I can write: … I will only read: …"_

## 2. The ownership rule (hard rule, no exceptions)

- **Everyone may READ every file.** Read the other person's code freely to understand contracts.
- **You may WRITE only files your person owns.** Never create, edit, rename, delete, format or
  move a file owned by the other teammate, not even a one-character fix, not even with
  `prettier --write`, `eslint --fix`, `sed`, `mv` or any shell command.
- Ownership is defined in [`.github/CODEOWNERS`](.github/CODEOWNERS) (last matching line wins).
  `.claude/hooks/guard-ownership.mjs` blocks Write/Edit on files you don't own. **Never bypass
  it with Bash, and never edit the hook, CODEOWNERS or `.claude/settings.json` to get around it.**
- When you run formatters or fixers, scope them to your own paths, e.g.
  `npx prettier --write frontend/src/features/visits` and never `npx prettier --write .`
  (Use the repo-wide `npm run check` freely: it only reads.)
- **Need something changed in the other person's area?** Don't change it. Add an entry under
  "Requests for <them>" in **your own** `docs/tasks/<you>.md`, and tell the user to ping their
  teammate. The owner makes the change.

### Who owns what

| Area               | Harshitha                                                                                                                            | Ayush                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Backend features   | `features/auth/`, `features/restaurants/`, `features/visits/`                                                                        | `features/polls/`, `features/spots/`                                  |
| Backend core       | `config/`, `db/`, `lib/`, `middleware/`, `app.js`, `routes.js`, `server.js`, `scripts/` (seed)                                       | (read-only)                                                           |
| Frontend features  | `features/auth/`, `features/intro/`, `features/restaurants/`, `features/visits/`                                                     | `features/polls/`, `features/spots/`                                  |
| Frontend API files | `api/client.js`, `api/auth.js`, `api/restaurants.js`, `api/visits.js`                                                                | `api/polls.js`, `api/spots.js`                                        |
| Frontend core      | `components/`, `context/`, `hooks/`, `styles/`, `utils/`, `pages/`, `App.jsx`, `main.jsx`, `index.html`, `public/`, `vite.config.js` | (read-only)                                                           |
| Tooling            | root `package.json`, both package files, `eslint.config.js`, Prettier, `.editorconfig`, `.claude/`, `CLAUDE.md`, `LICENSE`           | `.github/workflows/`, `render.yaml` (deploy)                          |
| Docs               | `docs/PROJECT_PLAN.md`, `docs/tasks/harshitha.md`                                                                                    | `README.md`, `docs/DESIGN.md`, `docs/mockups/`, `docs/tasks/ayush.md` |

Already wired for Ayush so he never needs Harshitha's files: his routers are mounted in
`backend/src/routes.js` (`/api/polls`, `/api/spots`, behind `requireAuth`), his pages are routed
in `frontend/src/App.jsx` (`/polls`, `/polls/:id`, `/spots`) and linked in the NavBar. Ayush's
pages are intentionally empty shells for him to build.

## 3. Contracts across the boundary (import, never edit)

The full table is in `docs/PROJECT_PLAN.md` §1a (Cross-feature contracts). Treat it as the
only API between the two features.

## 4. Architecture

- **Backend** (`backend/`, Express 5, ESM, native MongoDB driver): `src/server.js` connects to the DB,
  ensures indexes, then starts `createApp()` from `src/app.js`. Each feature is
  `features/<name>/{<name>.routes.js, <name>.repository.js, <name>.validation.js}`.
  Repositories export `<name>Indexes`, which `db/indexes.js` collects. Express 5 forwards thrown
  and rejected errors to `middleware/errorHandler.js`, so handlers just `throw`.
- **Auth**: passport-local + express-session, sessions stored in MongoDB via connect-mongo,
  bcryptjs hashes. Private routers are mounted behind `requireAuth`. Scope every private query
  by `req.user.id`. For polls, only the creator may edit or delete.
- **Frontend** (`frontend/`, React 19 + Vite + React Router 7): `App.jsx` routes; every page,
  including the `/` product-page intro, renders inside `components/Layout.jsx`.
  Feature code lives in `features/<name>/{pages,components}/`.
- **Dev**: Vite proxies `/api` to `:3000` (no CORS). **Prod**: `npm run build`, then Express
  serves `frontend/dist`.
- **Design language: quiet product page.** System type (SF Pro on Apple, Inter elsewhere),
  near-black text on white, `--color-bg-alt` grey for app pages and alternating sections, one
  blue (`--color-accent`) for actions and `--color-link` for links. Large bold titles with tight
  letter-spacing, generous white space, 18–28 px rounded white cards, no borders or gradients.
  Severity and trend colours only carry meaning. Use `PageHeader`, `.btn`, `.field`, `.link-more`,
  `.card` and `Reveal`; never hard-code colours.

## 5. Rubric rules (each one is points; never break them)

1. **One React component per `.jsx` file**, PascalCase, `export default function Name()`.
2. **Every component with styles has its own `Name.css`** next to it, imported in `Name.jsx`.
3. **Every component declares `propTypes`** (ESLint enforces it).
4. **Hooks only**, no class components.
5. **Standard HTML for standard jobs**: `<button type="…">` for actions, `<a>`/`<Link>` for
   navigation, `<label>` + `<input>`/`<select>`, `<form>`, `<details>`, and so on. Never put
   `onClick` on a div or span.
6. **Fetch API only.** No axios, Mongoose, cors, jQuery (ESLint blocks them). No libraries beyond
   the approved list: express, mongodb, dotenv, passport, passport-local, express-session,
   connect-mongo, bcryptjs, react, react-dom, react-router-dom, prop-types, plus dev tooling.
7. **No secrets in git.** Config comes from `backend/.env` (gitignored). `backend/.env.example` is
   the template.
8. **No leftover or unused code or files**: no dead components, stub routes, `console.log`,
   default favicons or commented-out code before the freeze.
9. **`npm run check` must pass** (ESLint with zero errors + Prettier) before every commit.
10. **Each student implements full CRUD on at least one collection**: Harshitha on `visits`,
    Ayush on `polls` and `spots`.

## 6. Commands (from the repo root)

```bash
npm install            # all workspaces
npm run dev            # API :3000 + Vite :5173
npm run seed           # load Boston inspections into MongoDB (Harshitha's script)
npm run check          # lint + format check (read-only, safe for anyone)
npm run build          # production React build
```

## 7. Workflow

- Branch per task: `harshitha/<task-id>-<slug>` or `ayush/<task-id>-<slug>`. PR into `main`;
  the other teammate reviews.
- Tasks and progress live in `docs/tasks/<person>.md`. When you finish a task, tick it **in your
  own file** and update its "Done" notes.
- Commit messages: `feat(visits): …`, `fix(polls): …` (Conventional Commits). **Do not add
  `Co-Authored-By` trailers or mention AI tools in commits, PRs, code or docs.**
- Never commit, push or open PRs unless the user asks.
- Don't commit `backend/.env`. Check `git status` before every commit.
