import { sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";

export async function GET() {
  try {
    await getDatabase().execute(sql`select 1`);

    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
