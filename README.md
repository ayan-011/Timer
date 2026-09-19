# Time Is Running



<img width="1442" height="740" alt="Screenshot 2026-09-19 at 11 44 35 PM" src="https://github.com/user-attachments/assets/33092354-06a1-490b-ab79-5fa8e44db864" />

A Next.js app that turns your age into a live experience. Users create an account with their date of birth and can see their life moving in real time.

## Pages

- **Timer** — full-screen live age timer.
- **Time Use** — enter daily screen time and sleep; see how many years those habits add up to across an 80-year life.
- **Life Progress** — see your life as a percentage and a 960-month life calendar. Lived months are white.
- **Goals** — choose day, week, month, or year and save what you want to achieve and what you achieved.
- **Thoughts** — time-related thoughts change automatically.

The profile dropdown remains available throughout the dashboard. Users can edit their name, date of birth, and profile photo, or log out.

## Setup

1. Copy `.env.example` to `.env`.
2. Add your PostgreSQL `DATABASE_URL` and a strong `AUTH_SECRET`.
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma Client and update the database:

```bash
npx prisma generate
npx prisma db push
```

5. Start the app:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Notes

- The 80-year calculations are estimates, not a prediction of anyone's lifespan.
- Profile photos are stored as data URLs, matching the original project design.
- Time-use and goals are saved to the user's Prisma record.
