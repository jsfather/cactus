import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { attachments } from "@/lib/db/schema";
import { attachmentRoot, attachmentType } from "@/lib/attachments/storage";
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  if (
    !origin ||
    (origin !== request.nextUrl.origin && origin !== process.env.SITE_URL)
  )
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const max = 20 * 1024 * 1024;
  if (Number(request.headers.get("content-length") || 0) > max + 16384)
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > max)
    return NextResponse.json({ error: "Invalid file size" }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const type = attachmentType(bytes);
  if (
    !type ||
    (file.type !== type.mime &&
      !(type.ext === "zip" && file.type === "application/x-zip-compressed"))
  )
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 },
    );
  const filename = `${randomUUID()}-${Date.now()}.${type.ext}`;
  await mkdir(attachmentRoot(), { recursive: true });
  await writeFile(path.join(attachmentRoot(), filename), bytes, { flag: "wx" });
  try {
    const [item] = await getDatabase()
      .insert(attachments)
      .values({
        uploaderId: user.id,
        pathname: filename,
        originalName: file.name
          .replace(/[\x00-\x1f\x7f/\\]/g, "_")
          .slice(0, 240),
        mimeType: type.mime,
        size: file.size,
      })
      .returning({ id: attachments.id });
    return NextResponse.json({
      url: `/api/attachments/${item.id}`,
      name: file.name,
    });
  } catch {
    await unlink(path.join(attachmentRoot(), filename));
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
