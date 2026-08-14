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
NEXT_PUBLIC_HOME_HERO_VIDEO_URL=https://la.ecactus.co/site_videos/robocup-2024.mp4
NEXT_PUBLIC_HOME_VIDEO_1_URL=https://la.ecactus.co/site_videos/intro-1.mp4
NEXT_PUBLIC_HOME_VIDEO_2_URL=https://la.ecactus.co/site_videos/intro-2.mp4
NEXT_PUBLIC_HOME_VIDEO_3_URL=https://la.ecactus.co/site_videos/intro-3.mp4
```

No Dokploy variables are required while these values remain correct. To override
one, add it under the application's **Build Time Arguments**, then rebuild. Adding
only a runtime environment variable is insufficient because Next.js compiles
`NEXT_PUBLIC_*` values into the browser bundle during the build.

### Homepage video files

The homepage expects these four public files:

| Position | Public URL                                           | File to upload     |
| -------- | ---------------------------------------------------- | ------------------ |
| Hero     | `https://la.ecactus.co/site_videos/robocup-2024.mp4` | `robocup-2024.mp4` |
| About 1  | `https://la.ecactus.co/site_videos/intro-1.mp4`      | `intro-1.mp4`      |
| About 2  | `https://la.ecactus.co/site_videos/intro-2.mp4`      | `intro-2.mp4`      |
| About 3  | `https://la.ecactus.co/site_videos/intro-3.mp4`      | `intro-3.mp4`      |

They currently return `404`, so upload them into the backend domain's public
webroot at `site_videos/`. The resulting URLs must be publicly readable over
HTTPS, return `Content-Type: video/mp4`, and support byte-range requests. H.264
video with AAC audio is the safest browser-compatible encoding.

If the files will live elsewhere, add the corresponding four variables under
Dokploy **Build Time Arguments** and rebuild the application. The video player
now shows a clear unavailable state instead of a broken blank frame.

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

## 7. Required public product route

The deployed Laravel backend currently has no `GET /api/products/{id}` route.
For example, product `187` exists in `GET /api/home/products`, but
`GET /api/products/187` returns a route-level `404`. The frontend now resolves
the real product from the public product list as a compatibility fallback, but
the backend should add the dedicated detail route for correct REST behavior and
efficient loading:

```php
Route::get('/products/{product}', [ProductController::class, 'show']);
```

The `show` action should return the same public product shape as the list,
including its category and approved comments, and return a normal JSON `404`
when the product does not exist. Keep Laravel `APP_DEBUG=false` in production so
framework file paths and stack traces are not exposed to visitors.

## Updates and rollback

Enable automatic deployments for the selected GitHub branch in Dokploy. Use
Dokploy's Deployments tab to inspect logs or redeploy a previous revision.

If an old manually deployed Cactus container is still running, stop it only after
the Dokploy deployment has passed its health check.
