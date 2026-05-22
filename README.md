This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin panel

The site has a built-in admin panel at `/admin` that lets the client edit hero slides, products, reviews, and the À-propos section without touching code. Edits are saved to `content/site.json` and the affected pages are revalidated immediately.

### Setup

Create a `.env.local` file at the project root with these two variables:

```bash
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SECRET=any-long-random-string-used-to-sign-the-session-cookie
```

- `ADMIN_PASSWORD` is the password used to log in at `/admin/login`.
- `ADMIN_SECRET` is an HMAC key used to sign the session cookie — change it to invalidate all existing sessions.

If these are not set, defaults are used (password = `admin`, secret = `dev-secret-change-me`). **Set both before going to production.**

### Usage

1. Navigate to `/admin/login` and enter the password.
2. From the dashboard, pick a section to edit (Hero · Impression, Produits, Avis, etc.).
3. Use the up/down/trash icons to reorder or delete list items, the **Ajouter un élément** button to add new ones, and **Enregistrer** to save.
4. Saved changes are visible on the public site immediately — no rebuild required.

### Storage

All editable content lives in [`content/site.json`](content/site.json). This file is the single source of truth. If you want to seed a deployment with the current content, commit this file. If you want a clean reset, edit it manually.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
