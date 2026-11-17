# Back of House: Project Plan

**Team:** Harshitha Seetharaman (**H**, `@Harshiacchu`) · Ayush Nimeshkumar Patel (**A**, `@ayushp2207`)
**Due:** Nov 18 · **Code freeze:** 24 h before class

Live task lists: [Harshitha](tasks/harshitha.md) · [Ayush](tasks/ayush.md).

## 1. Work split (balanced: ~31 h / ~30 h)

|                            | Harshitha                                                                | Ayush                                                                          |
| -------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Feature                    | Kitchen Reports & Visit Log                                              | Group Picks & My Spots                                                         |
| Collections with full CRUD | `visits`                                                                 | `polls`, `spots`                                                               |
| Read-only collections      | `restaurants`, `inspections` (seeded), `users`                           | n/a                                                                            |
| Platform                   | Scaffold, tooling, auth, design system, intro page, seed, **deployment** | CI workflow                                                                    |
| Docs and delivery          | Project plan, Google Form                                                | Design doc, mockups, README, **video script, video edit, presentation slides** |
| Both                       | Narrated video, peer review, final cleanup of own areas                  | same                                                                           |

Nobody writes in the other's files. Everyone may read everything. Ownership of every path is
in [`.github/CODEOWNERS`](../.github/CODEOWNERS). Need a change in the other person's area? Add it
under "Requests for …" in your own `docs/tasks/<you>.md`; the owner makes it.

## 1a. Cross-feature contracts (import read-only, never edit)

Ayush may import these Harshitha-owned pieces read-only. Their shapes are stable. Ask
before relying on anything not listed here.

| Contract                                                                                                                 | Where                                                        | Use                                                   |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------- |
| `findSummariesByIds(objectIds)`                                                                                          | `backend/src/features/restaurants/restaurants.repository.js` | Restaurant summaries for poll comparison and My Spots |
| `COLLECTIONS`                                                                                                            | `backend/src/db/collections.js`                              | Collection names (`polls`, `spots`, `restaurants`, …) |
| `getDb()`                                                                                                                | `backend/src/db/connection.js`                               | Database handle in repositories                       |
| `HttpError`, `notFound`, `forbidden`, `ValidationError`                                                                  | `backend/src/lib/errors.js`                                  | Errors → JSON `{ error, details }`                    |
| `validator()`, `toObjectId()`, `isNonEmptyString()` …                                                                    | `backend/src/lib/validation.js`                              | Input validation                                      |
| `req.user = { id, email, displayName }`                                                                                  | set by Passport                                              | The logged-in user on private routes                  |
| `GET /api/restaurants?q=&limit=`                                                                                         | Harshitha's API                                              | Search, e.g. for pickers                              |
| `request()`, `ApiError`                                                                                                  | `frontend/src/api/client.js`                                 | The only way to call the backend                      |
| `<RestaurantPicker value onChange label>`                                                                                | `frontend/src/features/restaurants/components/`              | Search-and-pick a restaurant                          |
| `<SeverityBadge score>`, `<TrajectoryBadge trajectory>`                                                                  | `frontend/src/components/`                                   | Score and trend chips                                 |
| `<PageHeader eyebrow title lead actions>`                                                                                | `frontend/src/components/`                                   | Top of every page (large title, grey lead)            |
| `<LoadingState>`, `<ErrorMessage>`, `<EmptyState>`, `<Skeleton width height round>`                                      | `frontend/src/components/`                                   | Standard states                                       |
| `<Pagination from to total hasPrevious hasNext onPrevious onNext>`, `useCursorPagination(resetKey)`                      | `frontend/src/components/`, `frontend/src/hooks/`            | Cursor (keyset) paging                                |
| `<ShareButton label makeImage>`                                                                                          | `frontend/src/components/`                                   | Share sheet on phones, PNG download on desktop        |
| `useFetch(loader)`, `useDebouncedValue()`, `useInView()`, `useAuth()`, `useDocumentTitle()`                              | `frontend/src/hooks/`                                        | Data loading, auth, titles                            |
| `restaurantSummaryShape`, `TRAJECTORIES`                                                                                 | `frontend/src/utils/propShapes.js`                           | PropTypes                                             |
| `.btn .btn--primary .btn--secondary .btn--ghost .btn--small .field .eyebrow .link-more .card`, tokens in `variables.css` | `frontend/src/styles/`                                       | Shared look: use tokens, never raw colours            |

Restaurant summary shape:
`{ _id, name, address, neighborhood, summary: { severityScore 0-100, trajectory 'Improving'|'Steady'|'Slipping', lastInspectionDate, lastResult } }`

## 2. Architecture

```
Browser (React SPA)
   │  fetch('/api/...')  same-origin cookie (boh.sid)
   ▼
Express 5 ── session (connect-mongo) ── Passport local
   ├── /api/auth         H   register · login · logout · me
   ├── /api/restaurants  H   search · neighborhoods · kitchen report      (public)
   ├── /api/visits       H   visit log CRUD                               (private)
   ├── /api/polls        A   poll CRUD · vote · comparison                (private)
   └── /api/spots        A   My Spots CRUD                                (private)
MongoDB: users · sessions · restaurants · inspections · visits · polls · spots
```

Frontend routes: `/` intro (kitchen door) · `/restaurants` · `/restaurants/:id` · `/visits` ·
`/polls` · `/polls/:id` · `/spots` · `/login` · `/register`.

## 3. Data model

| Collection    | Owner | Key fields                                                                                                                                                              | CRUD          |
| ------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `users`       | H     | `email` (unique, lowercase), `displayName`, `passwordHash` (null for Google-only), `googleId`, `emailVerified`, `verification{ codeHash, expiresAt, sentAt, attempts }` | C R U         |
| `restaurants` | H     | `licenseNo` (unique), `name`, `address`, `neighborhood`, `zip`, `summary{ severityScore, trajectory, lastInspectionDate, lastResult }`                                  | R (seeded)    |
| `inspections` | H     | `restaurantId`, `date`, `result`, `severityScore`, `violations[{ code, level, plain, description, category, comments }]`                                                | R (seeded)    |
| `visits`      | H     | `userId`, `restaurantId`, `visitDate`, `dish`, `rating` 1–5, `notes`, timestamps                                                                                        | **full CRUD** |
| `polls`       | A     | `creatorId`, `creatorName`, `title`, `restaurantIds[]`, `votes[{ userId, restaurantId, votedAt }]`, timestamps                                                          | **full CRUD** |
| `spots`       | A     | `userId`, `name`, `description`, `items[{ restaurantId, note, addedAt }]`, timestamps                                                                                   | **full CRUD** |
| `sessions`    | n/a   | managed by connect-mongo                                                                                                                                                | n/a           |

- `restaurants.summary` is precomputed by the seed, so lists and comparisons need no joins.
- Violation `level`: `Minor` | `Moderate` | `Serious` (from the dataset's `*` / `**` / `***`).
- Visit "kitchen that day" = latest inspection with `date <= visitDate`.
- One vote per user: filter `{ _id, 'votes.userId': { $ne: userId } }` to add; `$set` to change.

## 3a. How scores are calculated

Source: City of Boston Food Establishment Inspections (public domain). The seed loads **active**
restaurants (license types FS and FT, "Eating & Drinking" with or without take-out) inspected
since **2023-01-01**: about 3,300 restaurants and 34,500 inspections.

- **Violation decoding:** Boston cites FDA Food Code sections (`590.003/3-501.16-P` → section
  `3-501.16`). 80 hand-written plain-English translations cover ~89% of failed violations; the
  rest fall back to the official description. Only items the inspector marked **Fail** count.
- **Inspection severity (0–100):** Minor `*` = 2, Moderate `**` = 5, Serious `***` = 10 points,
  ×1.6 for pests and ×1.3 for food temperature, capped at 100.
- **Headline severity:** the worst of the last three inspections, so a quick clean re-check doesn't
  hide a failed inspection. Bands: under 20 Minor, 20–49 Concerns, 50+ Serious (≈75% / 22% / 3%).
- **Trajectory:** a straight-line fit through the last six inspection scores. A fitted change of
  8+ points better is **Improving**, 8+ worse is **Slipping**, otherwise **Steady**. Fewer than
  three inspections: no trajectory.
- **Neighborhood:** the dataset's `city` field, or the ZIP code for addresses listed as "Boston".

## 4. API contract

Errors are always `{ error, details? }` with 400 / 401 / 403 / 404 / 409 / 500.

| Method             | Path                                                           | Auth | Owner | Response                                                                                                                                          |
| ------------------ | -------------------------------------------------------------- | ---- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET                | `/api/auth/providers`                                          | –    | H     | `{ google, emailDelivery }`                                                                                                                       |
| POST               | `/api/auth/register`                                           | –    | H     | `{ displayName, email, password }` → 202 `{ email, verificationRequired }` (emails a 6-digit code)                                                |
| POST               | `/api/auth/verify`                                             | –    | H     | `{ email, code }` → `{ user }` (signs in)                                                                                                         |
| POST               | `/api/auth/resend`                                             | –    | H     | `{ email }` → `{ ok }` (60 s cooldown)                                                                                                            |
| POST               | `/api/auth/login`                                              | –    | H     | `{ email, password }` → `{ user }`; 403 `{ verificationRequired }` if unverified                                                                  |
| POST               | `/api/auth/logout`                                             | ✓    | H     | 204                                                                                                                                               |
| GET                | `/api/auth/me`                                                 | –    | H     | `{ user \| null }`                                                                                                                                |
| GET                | `/api/auth/google?next=`                                       | –    | H     | Redirects to Google; callback signs in and redirects to `next`                                                                                    |
| GET                | `/api/restaurants?q&neighborhood&trajectory&sort&cursor&limit` | –    | H     | `{ items, total, nextCursor }` (cursor pagination; `total` on the first page only)                                                                |
| GET                | `/api/restaurants/suggest?q=`                                  | –    | H     | `{ suggestions: [{ _id, name, neighborhood, summary }] }` (autocomplete)                                                                          |
| GET                | `/api/restaurants/heatmap`                                     | –    | H     | `{ hoods, points: [[lng, lat, hood]], quarters: [{ label, cells: [point, score, …] }] }` (Kitchen Weather dot map; built once per server process) |
| GET                | `/api/restaurants/neighborhoods`                               | –    | H     | `{ neighborhoods: [string] }`                                                                                                                     |
| GET                | `/api/restaurants/:id`                                         | –    | H     | `{ restaurant, inspections }` (newest first)                                                                                                      |
| GET                | `/api/visits`                                                  | ✓    | H     | `{ items: [visit] }` with `restaurant` + `inspectionAtVisit`                                                                                      |
| GET                | `/api/visits/recap?year=`                                      | ✓    | H     | `{ recap: { year, meals, neighborhoods, cleanShare, topNeighborhood, safeFavorite, guiltyPleasure } }`                                            |
| POST               | `/api/visits`                                                  | ✓    | H     | body `{ restaurantId, visitDate, dish, rating, notes }` → `{ visit }`                                                                             |
| GET / PUT / DELETE | `/api/visits/:id`                                              | ✓    | H     | `{ visit }` / `{ visit }` / 204                                                                                                                   |
| GET                | `/api/polls`                                                   | ✓    | A     | polls I created or voted in                                                                                                                       |
| POST               | `/api/polls`                                                   | ✓    | A     | create                                                                                                                                            |
| GET                | `/api/polls/:id`                                               | ✓    | A     | poll + comparison + tallies + my vote                                                                                                             |
| PUT / DELETE       | `/api/polls/:id`                                               | ✓    | A     | creator only                                                                                                                                      |
| POST               | `/api/polls/:id/vote`                                          | ✓    | A     | cast or change my vote                                                                                                                            |
| GET / POST         | `/api/spots`                                                   | ✓    | A     | my lists / create                                                                                                                                 |
| GET / PUT / DELETE | `/api/spots/:id`                                               | ✓    | A     | one list with summaries / update / delete                                                                                                         |

## 5. Planned components

| Feature     | Owner | Pages                                     | Components                                                                                                                                                                                                                                                                                                                    |
| ----------- | ----- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| intro       | H     | `IntroPage`                               | `ProductShot`, `DecodeSection`, `InsightSection`, `SeverityCard`, `TrajectoryCard`, `FeatureTiles`, `FeatureTile`, `ClosingCta`, `PhotoCredits`                                                                                                                                                                               |
| restaurants | H     | `RestaurantsPage`, `RestaurantDetailPage` | `KitchenWeather`, `WeatherMap`, `QuarterScrubber`, `RestaurantFilters`, `SearchBox`, `MatchHighlight`, `CardGuide`, `RestaurantCard`, `RestaurantCardSkeleton`, `ScoreTile`, `InspectionStrip`, `ReportHero`, `InspectionTimeline`, `InspectionDetail`, `ProblemAreas`, `ReportSkeleton`, `ViolationList`, `RestaurantPicker` |
| visits      | H     | `VisitLogPage`                            | `VisitForm`, `VisitItem`, `RatingInput`                                                                                                                                                                                                                                                                                       |
| polls       | A     | `PollsPage`, `PollDetailPage`             | `PollForm`, `PollCard`, `PollComparison`, `VoteButton` (suggested)                                                                                                                                                                                                                                                            |
| spots       | A     | `SpotsPage`                               | `SpotListForm`, `SpotListCard` (suggested)                                                                                                                                                                                                                                                                                    |
| shared      | H     | `NotFoundPage`                            | `Layout`, `NavBar`, `ProtectedRoute`, `PageHeader`, `Reveal`, `SeverityBadge`, `TrajectoryBadge`, `LoadingState`, `ErrorMessage`, `EmptyState`, `Skeleton`, `Pagination`, `ShareButton`                                                                                                                                       |

## 6. Schedule

| Day        | Harshitha                     | Ayush                                                      |
| ---------- | ----------------------------- | ---------------------------------------------------------- |
| 1          | H-3 seed, H-4 scoring         | A-1 polls API, A-5 spots API                               |
| 2          | H-5, H-6 restaurants API + UI | A-2 voting, A-3 polls UI, A-6 spots UI                     |
| 3          | H-7, H-8 visits               | A-4 comparison, A-7 deploy, A-8 mockups                    |
| 4 (freeze) | deploy, form, cleanup         | video script → record together, video edit, slides, README |
