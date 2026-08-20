import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { resolveUploadPath } from "@/lib/media/storage";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;
  const absolutePath = resolveUploadPath(parts);
  if (!absolutePath) return new Response(null, { status: 404 });

  try {
    const [file, fileStats] = await Promise.all([
      readFile(absolutePath),
      stat(absolutePath),
    ]);
    const contentType = contentTypes[path.extname(absolutePath).toLowerCase()];
    if (!contentType || !fileStats.isFile()) return new Response(null, { status: 404 });

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
