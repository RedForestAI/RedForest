# RedForest

Bring AI to the classroom

## Tech Stack

- [Next.js app router](https://nextjs.org/docs)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [DaisyUI](https://daisyui.com)
- [tRPC](https://trpc.io)
- [Supabase](https://supabase.com/docs)

## Install

Install supabase CLI for local development in your device:

```
npx supabase start
```

Then install the NextJS application and its dependencies:

```
npm install
```

Deploy the Prisma migrations to the Supabase server:

```
npm run migrate-dev
```

Generate test data through the Prisma seed:

```
npm run seed
```

Run the application:

```
npx next dev
```