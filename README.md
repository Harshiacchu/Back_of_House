# Back of House

> See what happens behind the kitchen door.

Boston publishes every restaurant health inspection, but the data is buried in cryptic violation
codes. **Back of House** turns it into plain-English kitchen reports with a severity score and a
trajectory (Improving, Steady, Slipping), a personal visit log, and "Where are we eating?" group
polls with a side-by-side kitchen comparison.

- **Authors:** Harshitha Seetharaman, Ayush Nimeshkumar Patel
- **Class:** [CS5610 Web Development, Northeastern University](https://johnguerra.co/classes/webDevelopment_fall_2026/index.html)
- **Live demo:** _coming soon_
- **Video demo:** _coming soon_
- **Design document:** [docs/DESIGN.md](docs/DESIGN.md)

## Project objective

Help Boston diners understand how clean a kitchen really is, not just whether it passed, and
help groups agree on a place everyone trusts.

| Feature                     | Owner                   |
| --------------------------- | ----------------------- |
| Kitchen Reports & Visit Log | Harshitha Seetharaman   |
| Group Picks & My Spots      | Ayush Nimeshkumar Patel |

## Screenshot

_Coming soon._

## Tech stack

- **Frontend:** React (hooks), React Router, Fetch API, PropTypes, Vite
- **Backend:** Node.js, Express 5
- **Database:** MongoDB (native Node.js driver)
- **Auth:** Passport (passport-local), express-session, connect-mongo, bcryptjs
- **Data:** [City of Boston Food Establishment Inspections](https://data.boston.gov/dataset/food-establishment-inspections) (Analyze Boston)

## Instructions to build

Requirements: Node.js 20.19+ and a MongoDB database (local or Atlas).

```bash
git clone https://github.com/Harshiacchu/Back_of_House.git
cd Back_of_House
npm install                          # installs root, backend and frontend (npm workspaces)
cp backend/.env.example backend/.env # then fill in MONGODB_URI and SESSION_SECRET
npm run seed                         # loads Boston inspection data into MongoDB
npm run dev                          # API on :3000, React on http://localhost:5173
```

Production build (what the deployed server runs):

```bash
npm run build   # builds frontend/dist
npm start       # Express serves the API and the React build on PORT
```

### Scripts (run from the repo root)

| Command          | What it does                                |
| ---------------- | ------------------------------------------- |
| `npm run dev`    | Backend (watch mode) + Vite dev server      |
| `npm run build`  | Production build of the React app           |
| `npm start`      | Start Express (serves API + built frontend) |
| `npm run seed`   | Seed restaurants and inspections            |
| `npm run lint`   | ESLint across backend and frontend          |
| `npm run format` | Prettier write                              |
| `npm run check`  | Lint + Prettier check (also runs in CI)     |

## How to use

1. Open **Kitchen Reports** and search by name, neighborhood or trajectory.
2. Open a restaurant to read its decoded violations, severity score and trajectory.
3. Create an account to keep a private **Visit Log** and **My Spots** lists.
4. Start a **Group Picks** poll, share the link, and let friends vote once each.

## Project structure

```
Back_of_House/
├── backend/                  Express API (own package.json)
│   ├── scripts/              Data seeding (Analyze Boston → MongoDB)
│   └── src/
│       ├── config/           env, Passport, sessions
│       ├── db/               connection, collection names, index registry
│       ├── lib/              errors + validation helpers
│       ├── middleware/       requireAuth, error handling
│       ├── features/         one folder per feature: routes + repository + validation
│       ├── routes.js         mounts every feature under /api
│       ├── app.js            builds the Express app
│       └── server.js         entry point
├── frontend/                 React app (own package.json)
│   └── src/
│       ├── api/              Fetch wrappers, one file per feature
│       ├── components/       shared components (Layout, NavBar, badges…)
│       ├── context/ hooks/   auth state, reusable hooks
│       ├── features/         intro · auth · restaurants · visits (H) · polls · spots (A)
│       ├── pages/            Home, Not Found
│       └── styles/           design tokens + global styles
└── docs/                     design document, project plan, mockups
```

See [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md) for the work split, data model and API contract,
and [docs/tasks/](docs/tasks/) for each teammate's progress.

## License

[MIT](LICENSE)
