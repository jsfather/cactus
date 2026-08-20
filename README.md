# Cactus

This is a [Next.js](https://nextjs.org) application configured for local development and Docker deployment on Dokploy.

## Local development

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
pnpm build
pnpm start
```

## Deploy with Dokploy

This repository includes a multi-stage `Dockerfile` that produces a small, non-root standalone Next.js image.

1. In Dokploy, create an **Application** and connect this Git repository.
2. Select the branch you want to deploy (for this version, `next`).
3. Set the build type to **Dockerfile**, the Dockerfile path to `Dockerfile`, and the Docker context path to `.`.
4. Leave **Docker Build Stage** empty so the final `runner` stage is used.
5. Add the domain in Dokploy with container/target port `3000`, then deploy. You do not need to publish a host port when routing through a domain.

No custom start command is required; the image starts the standalone Next.js server on `0.0.0.0:3000`.

### Environment variables

Add server-only environment variables in Dokploy's environment settings. Variables prefixed with `NEXT_PUBLIC_` are compiled into the browser bundle. If you add one, declare a matching `ARG`/`ENV` in the Dockerfile's `builder` stage and set it under Dokploy's **Build Time Arguments**; changing it requires a redeploy. Never pass secrets as public variables or build arguments.

### Verify the image locally

```bash
docker build -t cactus .
docker run --rm -p 3000:3000 cactus
```

Then open [http://localhost:3000](http://localhost:3000).
