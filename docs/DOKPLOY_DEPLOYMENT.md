# Deploy Cactus with Dokploy

This repository deploys one Next.js frontend container. Its internal port is
`3000`; its backend is external and must stay at:

```text
https://la.ecactus.co/api
```

Do not assign `la.ecactus.co` to this frontend in Dokploy. That hostname is the
backend origin. Use the real frontend hostname (for example `ecactus.co`) or a
temporary generated Dokploy hostname.

## 1. DNS

Create an `A` record for the frontend hostname pointing to the VPS public IPv4.
If Cloudflare proxies the record, use `DNS only` until Dokploy has issued the
first certificate; proxying can be enabled afterward.

The existing `la.ecactus.co` DNS record must continue pointing at the backend.

## 2. Create the Compose service

1. In Dokploy create or select a Project.
2. Add a `Docker Compose` service (not Docker Stack).
3. Choose GitHub as the provider and authorize the `jsfather/cactus` repository.
4. Select the production branch (`main` is recommended).
5. Set Compose Path to `./docker-compose.yml`.
6. Save.

## 3. Set environment variables

In the Compose service's Environment tab add exactly:

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://la.ecactus.co/api
NEXT_PUBLIC_STATIC_BASE_URL=https://la.ecactus.co
NEXT_PUBLIC_API_URL=https://la.ecactus.co
```

These are public browser values, not secrets. They are passed as Docker build
arguments because Next.js compiles `NEXT_PUBLIC_*` values into the client bundle.
Changing one requires a rebuild/redeploy, not only a container restart.

## 4. Add the frontend domain

Before the first deployment, open the Compose service's Domains tab and add:

- Service: `nextjs`
- Container port: `3000`
- Host: the frontend hostname (not `la.ecactus.co`)
- HTTPS: enabled
- Certificate: Let's Encrypt
- Path: `/`

Dokploy 0.7+ adds the Traefik labels and network automatically. The Compose file
therefore intentionally has no host port, fixed container name, or Traefik
labels. Use Preview Compose to confirm the generated route targets `nextjs:3000`.

## 5. Deploy and verify

Click Deploy. The deployment should build the Dockerfile and the container should
become healthy. Verify:

```text
https://FRONTEND_HOST/healthz
```

It must return `{"status":"ok"}`. Then open the browser developer tools and
confirm API requests start with `https://la.ecactus.co/api`.

## 6. Backend CORS

The backend must allow the final frontend origins, for example:

```text
https://ecactus.co
https://www.ecactus.co
```

It must allow the `Authorization` and `Content-Type` headers and the HTTP methods
used by the application. Do not use `*` together with credentialed requests.

## Updates and rollback

The GitHub provider can auto-deploy pushes to the selected branch. The repository
workflow only verifies the production build; it no longer SSH-deploys a second,
conflicting container to `/opt/cactus`.

Use Dokploy's Deployments tab to inspect logs or redeploy an earlier working
revision. If the old manually deployed Cactus Compose project is still running on
the VPS, stop it only after the Dokploy deployment has passed the health check.
