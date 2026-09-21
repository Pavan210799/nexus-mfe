# Micro-Frontend Dashboard

A React dashboard made of **independent apps** that run together as one site.

The host is only the shell (menu, routes, login gate).  
The five feature modules are separate Vite apps loaded with **Module Federation**.

## First login

| Email | Password |
|---|---|
| `pavan@gmail.com` | `123456` |

Accounts are stored in **localStorage** in this browser.  
The login form starts empty. Type the email and password from the table above.  
Login / signup / logout still call `fetch` so the code looks like a real API. That call goes to DummyJSON `/test` and does not check passwords. If the call succeeds, localStorage does the real work.

## Deploy (Option B)

One website, six folders. The host is the public URL. Each module is a subfolder (`/auth`, `/dashboard`, `/users`, `/analytics`, `/notifications`).

```bash
npm run build:web
```

That fills the `site/` folder. Upload `site/` to Netlify, Vercel, or GitHub Pages.

Live app: [https://nexus-mfe.netlify.app](https://nexus-mfe.netlify.app)  
Source: [https://github.com/Pavan210799/nexus-mfe](https://github.com/Pavan210799/nexus-mfe)

Host production remotes point at:

- `/auth/assets/remoteEntry.js`
- `/dashboard/assets/remoteEntry.js`
- `/users/assets/remoteEntry.js`
- `/analytics/assets/remoteEntry.js`
- `/notifications/assets/remoteEntry.js`

Local `npm run dev` still uses ports 5000–5005.

## Run locally

You need **Node.js 18+**.

```bash
cd Micro-Frontend-Dashbaord
npm install
npm run dev
```

Open [http://localhost:5000](http://localhost:5000).

What `npm run dev` does:

1. Builds the five feature apps
2. Serves each one with `vite preview`
3. Starts the host on port 5000

| App | Port |
|---|---|
| Host | 5000 |
| Auth | 5001 |
| Dashboard | 5002 |
| Users | 5003 |
| Analytics | 5004 |
| Notifications | 5005 |

## Architecture

```text
Host (shell)
  layout, sidebar, header
  protected routes
  lazy-loads remotes

Auth            login + signup
Dashboard       home cards
Users           table + pagination
Analytics       charts
Notifications   alerts

shared/
  api.js        fake fetch + localStorage
  storage.js    users, session, theme, notes
  theme.css     indigo light / dark
  components/   Button, Card, Spinner, ...
```

Host `vite.config.js` **imports** remotes.  
Each feature app **exposes** one file, for example `./UsersApp`.

```js
const UsersApp = lazy(function () {
  return import("users/UsersApp");
});
```

React, React DOM, and React Router are **shared singletons**, so they are not downloaded five times.

## How modules talk

All remotes run inside the host page, so they share the same localStorage.

| Event | What happens |
|---|---|
| Login | Auth writes `mfd-session`, fires `session-changed` |
| Host | Reads session, shows sidebar, allows private pages |
| Users / Analytics | Read `mfd-users` |
| Notifications | Read `mfd-notifications`, fire `notes-changed` for the badge |

No backend. No DummyJSON user accounts.

## Fake API + localStorage

Example login path:

1. `POST https://dummyjson.com/test` with email and password in the body (syntax only)
2. If `res.ok`, search `mfd-users` in localStorage
3. If email and password match, save `mfd-session`

Signup and logout use the same two-step pattern.

## User table

There are **50** seeded users (Pavan + 49 others).  
User Management shows **10 per page** (5 pages).  
Signup adds a new person to the same list.

## Theme

Indigo palette.

- Light accent: `#4F46E5`
- Dark accent: `#818CF8`
- Toggle is in the host header

See **Deploy (Option B)** at the top. `npm run build:web` builds all six apps into `site/`.
