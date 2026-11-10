# Harshitha: Kitchen Reports & Visit Log

Owner of this file: Harshitha. Ayush reads it; only Harshitha edits it.
Estimate: **~31 h** (Ayush: ~30 h). Tick tasks here as you finish them.

## Tasks

| ID   | Task                                                                                  | Est. | Status                                  |
| ---- | ------------------------------------------------------------------------------------- | ---- | --------------------------------------- |
| H-0  | Repo scaffold, ESLint/Prettier, CI, CODEOWNERS                                        | 3 h  | ✅ Done                                 |
| H-1  | Auth: Passport local, sessions in MongoDB, register/login/logout/me, `ProtectedRoute` | 3 h  | ✅ Done                                 |
| H-2  | Intro page + design system + shared components                                        | 4 h  | ✅ Done                                 |
| H-2b | Email sign-up with 6-digit verification + Continue with Google (no new libraries)     | 3 h  | ✅ Done                                 |
| H-3  | Seed script: Analyze Boston API → `restaurants` + `inspections` (2–3k restaurants)    | 4 h  | ✅ Done                                 |
| H-4  | Violation decoding table + severity score + trajectory                                | 4 h  | ✅ Done                                 |
| H-5  | `GET /api/restaurants` (search, neighborhood, trajectory, paging) + `/neighborhoods`  | 3 h  | ✅ Done                                 |
| H-6  | `GET /api/restaurants/:id` kitchen report; wire + polish Kitchen Reports UI           | 3 h  | ✅ Done                                 |
| H-7  | Visits CRUD API, with `inspectionAtVisit` = latest inspection on/before the visit     | 3 h  | ✅ Done                                 |
| H-8  | Visit Log UI wiring + manual test of create/edit/delete                               | 1 h  | API tested; click-through in browser ⬜ |

Seeded: 3,334 restaurants and 34,495 inspections (Boston, active restaurants, since 2023).
Re-run with `npm run seed`, or `npm run seed -- --refresh` to download fresh data.

## Shared final tasks (my half)

- [ ] F-H1 Deploy to Render (env vars, Atlas network access, production seed)
- [ ] F-H2 Google Form submission (thumbnail + links)
- [ ] F-H3 Record my part of the narrated video (Kitchen Reports + Visit Log), following Ayush's script
- [ ] F-H4 Remove unused code/stubs in my areas; `npm run check` clean
- [ ] F-H5 Peer review

## Requests for Ayush

_(Write here when you need something changed in Ayush's files. He makes the change.)_

- README: in the License section, add “Photos, data and fonts are under their own licenses: see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).”
- Deployment (A-7): Harshitha is deploying to Render herself, so A-7 comes off your list.
- **To balance the hours, please take over these three (add them to `docs/tasks/ayush.md`):**
  - **F-A6 Video script (~1.5 h):** a narrated demo of about 3–5 minutes, split into who-says-what. Open with the problem, then Kitchen Reports (Harshitha), Visit Log (Harshitha), Group Picks (you), My Spots (you), and close. Both of us must appear on camera (rubric). Share it with me at least 2 days before the freeze so I can rehearse my part.
  - **F-A2 Video edit:** already yours. Cut from both recordings, add captions if possible, upload as a **public** link.
  - **F-A7 Presentation slides (~2 h):** for class. Problem, personas, the two features, a live-demo slot, tech stack (no Mongoose, axios or CORS; Passport auth), and what we'd build next. Match the site's look (system font, white/black, one blue).

## Notes

-
