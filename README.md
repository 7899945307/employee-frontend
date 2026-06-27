# Employee Frontend

React app that fetches employee data from the Python backend and displays it in a simple employee directory UI.

## Run locally

```bash
npm install
npm run dev
```

The frontend calls the backend API at `http://localhost:4000` by default.
You can change that with `VITE_API_BASE_URL`.

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
