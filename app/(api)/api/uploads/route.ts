import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { mediaAssets, mediaKind, type MediaKind } from "@/lib/db/schema";
import {
  getUploadRoot,
  hasValidImageSignature,
  imageTypes,
  MAX_IMAGE_SIZE,
  type SupportedImageType,
} from "@/lib/media/storage";

export const runtime = "nodejs";

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

const metadataSchema = z.object({
  kind: z.enum(mediaKind.enumValues),
  originalName: z.string().trim().max(255),
  altFa: z.string().trim().max(240),
  altEn: z.string().trim().max(240),
});

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Authentication required.", 401);

  const requestedKind = new URL(request.url).searchParams.get("kind");
  const kind = mediaKind.enumValues.includes(requestedKind as MediaKind)
    ? (requestedKind as MediaKind)
    : null;
  const filters = user.role === "admin"
    ? kind ? eq(mediaAssets.kind, kind) : undefined
    : and(eq(mediaAssets.uploaderId, user.id), eq(mediaAssets.kind, "avatar"));

  const assets = await getDatabase()
    .select({
      id: mediaAssets.id,
      url: mediaAssets.url,
      originalName: mediaAssets.originalName,
      mimeType: mediaAssets.mimeType,
      size: mediaAssets.size,
      kind: mediaAssets.kind,
      altFa: mediaAssets.altFa,
      altEn: mediaAssets.altEn,
      createdAt: mediaAssets.createdAt,
    })
    .from(mediaAssets)
    .where(filters)
    .orderBy(desc(mediaAssets.createdAt))
    .limit(100);

  return Response.json({ assets });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Authentication required.", 401);

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_IMAGE_SIZE + 1024 * 1024) {
    return errorResponse("The image is too large.", 413);
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const metadata = metadataSchema.safeParse({
    kind: formData.get("kind"),
    originalName: formData.get("originalName") || "",
    altFa: formData.get("altFa") || "",
    altEn: formData.get("altEn") || "",
  });

  if (!(file instanceof File) || !metadata.success) {
    return errorResponse("A valid image and upload kind are required.", 400);
  }

  const { kind, originalName, altFa, altEn } = metadata.data;

  if (kind !== "avatar" && user.role !== "admin") {
    return errorResponse("You do not have permission to upload this image.", 403);
  }

  if (file.size < 1 || file.size > MAX_IMAGE_SIZE) {
    return errorResponse("Images must be smaller than 5 MB.", 413);
  }

  if (!(file.type in imageTypes)) {
    return errorResponse("Only JPEG, PNG, WebP, and GIF images are supported.", 415);
  }

  const mime = file.type as SupportedImageType;
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidImageSignature(bytes, mime)) {
    return errorResponse("The uploaded file is not a valid image.", 415);
  }

  const now = new Date();
  const relativeParts = [
    kind,
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
  ];
  const filename = `${randomUUID()}-${now.getTime()}.${imageTypes[mime]}`;
  const pathname = [...relativeParts, filename].join("/");
  const directory = path.join(getUploadRoot(), ...relativeParts);
  const absolutePath = path.join(directory, filename);
  const url = `/media/${pathname}`;

  await mkdir(directory, { recursive: true });
  await writeFile(absolutePath, bytes, { flag: "wx" });

  try {
    const [asset] = await getDatabase()
      .insert(mediaAssets)
      .values({
        url,
        pathname,
        originalName: originalName || file.name.trim().slice(0, 255) || filename,
        mimeType: mime,
        size: file.size,
        kind,
        altFa: altFa || null,
        altEn: altEn || null,
        uploaderId: user.id,
      })
      .returning({ id: mediaAssets.id, url: mediaAssets.url, originalName: mediaAssets.originalName, altFa: mediaAssets.altFa, altEn: mediaAssets.altEn });

    revalidatePath("/panel/admin/media");
    revalidatePath("/panel/admin");

    return Response.json(asset, { status: 201 });
  } catch (error) {
    await unlink(absolutePath).catch(() => undefined);
    throw error;
  }
}
