# Deploy Cactus with Dokploy

This repository deploys one Next.js frontend using its root `Dockerfile`. The
frontend listens on port `3000`; its external backend remains:

```text
https://la.ecactus.co/api
```

Do not assign `la.ecactus.co` to the frontend in Dokploy. Use the real frontend
hostname (for example `ecactus.co`) or a temporary generated hostname.

## 1. DNS

Create an `A` record for the frontend hostname pointing to the VPS public IPv4.
The existing `la.ecactus.co` record must continue pointing at the backend.

## 2. Create the application

1. In Dokploy create or select a Project.
2. Add an `Application`.
3. Select GitHub as the provider and authorize `jsfather/cactus`.
4. Select the production branch (`main` is recommended).
5. Select `Dockerfile` as the Build Type.
6. Set Dockerfile Path to `Dockerfile`.
7. Set Docker Context Path to `.`.
8. Leave Docker Build Stage empty and save.

The repository has no GitHub Actions workflows. Dokploy performs the clone,
Docker build, deployment, and automatic deployment on pushes itself.

## 3. Build-time configuration

The Dockerfile already has these production defaults:

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://la.ecactus.co/api
NEXT_PUBLIC_STATIC_BASE_URL=https://la.ecactus.co
NEXT_PUBLIC_API_URL=https://la.ecactus.co
```

No Dokploy variables are required while these values remain correct. To override
one, add it under the application's **Build Time Arguments**, then rebuild. Adding
only a runtime environment variable is insufficient because Next.js compiles
`NEXT_PUBLIC_*` values into the browser bundle during the build.

## 4. Add the frontend domain

Open the application's Domains tab and configure:

- Container port: `3000`
- Host: the frontend hostname, not `la.ecactus.co`
- HTTPS: enabled
- Certificate: Let's Encrypt
- Path: `/`

## 5. Deploy and verify

Click Deploy. The Dockerfile includes a container health check. Verify the public
endpoint after deployment:

```text
https://FRONTEND_HOST/healthz
```

It must return `{"status":"ok"}`. Then confirm browser API requests start with
`https://la.ecactus.co/api`.

## 6. Backend CORS

Allow the final frontend origin in the backend CORS configuration. It must allow
the `Authorization` and `Content-Type` headers and the HTTP methods used by the
application.

## Updates and rollback

Enable automatic deployments for the selected GitHub branch in Dokploy. Use
Dokploy's Deployments tab to inspect logs or redeploy a previous revision.

If an old manually deployed Cactus container is still running, stop it only after
the Dokploy deployment has passed its health check.
