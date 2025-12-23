# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment notes

- This project uses HashRouter for client-side routing so the app works on static hosts without server-side rewrite rules. URLs will appear like `/#/Result` when navigating in the browser.

## Smoke test (CI / local)

There's a small smoke-test script that builds the site and verifies the preview server starts. Run it locally with:

```powershell
# KetoSlim — React + Vite frontend

KetoSlim is a small React application built with Vite. The app collects a few user inputs (body fat, BMI, goals, etc.) and shows personalized recommendations and a checkout flow. This repository contains the UI, components, and tests for the client side.

This project is a modern Vite + React app with Tailwind utility classes, client-side routing, and a small component library. It's configured for fast local development and includes unit and integration tests using Jest + React Testing Library.

---

## Table of contents

- Project overview
- Getting started (setup)
- Development (dev server & scripts)
- Testing
- Build & preview
- Code style & pre-commit hooks
- Known issues / notes
- Contributing
- License

---

## Project overview

- Tech: React (Vite), Tailwind CSS, React Router, Jest + React Testing Library
- App highlights: data-driven results steps, a Home form that stores parameters in React Context (`ParameterContext`), a multi-step Sales/checkout UI, and a comprehensive Dashboard for meal plan generation and history tracking.
- Features: AI-powered health scanning, BMI/body fat visualization, and downloadable meal plans.
- Design goals: small, testable components; minimal tooling; deploy-friendly routing for static hosts.

## Getting started (setup)

1. Clone the repository

```powershell
git clone <repo-url>
cd KETOSLIM
```

2. Install dependencies

```powershell
npm install
```

> Note: in some environments we used `npm install --legacy-peer-deps` when adding testing libraries as a workaround for peer dependency mismatches. Try the plain `npm install` first.

3. (Optional) If this is a fresh fork/clone, run prepare to ensure husky hooks are installed:

```powershell
npm run prepare
```

---

## Development

Start the local dev server with Vite:

```powershell
npm run dev
```

Open http://localhost:5173 in the browser.

Routing notes
- The app currently uses client-side routing. For static hosts we support HashRouter so fallback rewrites are not required — URLs appear with `/#/Result` when navigating directly to routes.

---

## Testing

This project includes Jest + React Testing Library tests (unit & integration).

Run the test suite:

```powershell
npm test
```

Run tests in watch mode while developing:

```powershell
npm run test:watch
```

Generate test coverage:

```powershell
npm run test:coverage
```

Notes
- Tests cover core UI components (CardStep, RangeField, StatsFeatures), HomeForm integration, and basic rendering for Dashboard and UpdateStats. The test infra lives under `src/__tests__` and config in the repo root (`jest.config.cjs`, `babel.config.cjs`).

---

## Build & preview

To build the app for production:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

There is also a smoke-test script useful for CI to ensure the build completes and the preview server starts successfully:

```powershell
npm run smoke-test
```

---

## Code style & pre-commit hooks

This repo uses Prettier for formatting and Husky + lint-staged to run formatting before commits.

Commands:

```powershell
npm run format         # format everything
npm run format:check   # check formatting
```

Pre-commit hooks are already wired up. If you change the hook or add new lint rules, run `npm run prepare` to re-install Husky in your local environment.

---

## Known issues / notes

## Known issues / notes

- Many components now use PropTypes for runtime prop validation and more predictable behavior. You will find prop-types added across form fields, sales subcomponents, and CardStep.

---

## Contributing

Contributions are welcome. A suggested workflow:

1. Create a feature branch
2. Add tests for new behavior
3. Run `npm run format` to keep formatting consistent
4. Open a PR and include testing notes or deployment steps

If you're running tests locally and see environment issues, try running `npm install --legacy-peer-deps` — particularly when adding testing deps alongside newer React versions.

---

## License

This repo does not include a license file. Add a license if you plan to publish or share this project.

---

If you'd like, I can also add a short CONTRIBUTING.md or update the smoke-test to return specific CI exit codes for early detection of hosting issues — tell me which next.
