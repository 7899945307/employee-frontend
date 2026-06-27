# Employee Frontend

React app that fetches employee data from the Python backend and displays it in a simple employee directory UI.

## Run locally

```bash
npm install
npm run dev
```

The frontend uses:

- local development: `http://localhost:4000`
- production: same-origin `/api` by default

If you want the frontend to call a backend domain directly instead of using a proxy or Worker, set `VITE_API_BASE_URL`.

## API used

- `GET /api/employees`

## GitHub push

```bash
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin <your-frontend-repo-url>
git push -u origin main
```
