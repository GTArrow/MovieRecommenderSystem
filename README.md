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

## Setup the database and Prisma schema connection

Create a database if you don't have one yet

```bash
createdb moviedb
```

Replace the database URL with your PostgreSQL connection string in the env.local:

```bash
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/moviedb"

```

Run the following to create tables in your PostgreSQL DB:

```bash
npx prisma db push

```

Optional: Generate Prisma Client (should happen automatically):

```bash
npx prisma generate

```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Additional Resources

- [React Context API](https://react.dev/reference/react/createContext)
- [Lucide Icons](https://lucide.dev/icons/): The Shadcn UI Kit for Figma uses the Lucide icons as its main icon library.

# Development Notes

**How to solve UnknownAtRules issues**: Add Tailwind CSS VSCode extension and configure file association for '.css' file: [link](https://stackoverflow.com/questions/65247279/unknown-at-rule-tailwind-cssunknownatrules)
