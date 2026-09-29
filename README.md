# Techskeleton Learning Platform

Testing tools, study material and competitive-exam prep with Free / Premium / Enterprise plans.
Admins create courses and publish them; learners see published courses, and premium ones unlock by plan.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest + Testing Library
npm run build
```

## Demo accounts
| Role | Email | Password | Plan |
|---|---|---|---|
| Admin | admin@techskeleton.com | admin123 | enterprise |
| Learner | learner@techskeleton.com | learn123 | free |
| Premium learner | pro@techskeleton.com | pro12345 | premium |

## Architecture
- `src/lib/access.js` - single source of truth for who can open which course
- `src/context/AppContext.jsx` - reducer + localStorage persistence (swap for an API later)
- `src/pages` - Catalog, CourseDetail (lessons + quiz), Pricing, Login, Admin

## Before production
Auth and payments are simulated in the browser. Replace with a real backend (JWT/OIDC, Stripe, database) before launch.

## Push to GitHub
```bash
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/techskeleton-platform.git
git push -u origin main
```
