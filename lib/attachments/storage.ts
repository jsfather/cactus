import path from "node:path";
import { and,eq } from "drizzle-orm";
import type { CurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { attachments } from "@/lib/db/schema";
export const attachmentRoot=()=>path.resolve(process.env.UPLOAD_DIR||path.join(process.cwd(),".data/uploads"),"private/attachments");
export function attachmentType(bytes:Buffer){if(bytes.subarray(0,5).toString()==="%PDF-")return {mime:"application/pdf",ext:"pdf"};if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return {mime:"image/jpeg",ext:"jpg"};if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {mime:"image/png",ext:"png"};if(bytes.subarray(0,4).toString()==="RIFF"&&bytes.subarray(8,12).toString()==="WEBP")return {mime:"image/webp",ext:"webp"};if(bytes.subarray(0,4).equals(Buffer.from([80,75,3,4])))return {mime:"application/zip",ext:"zip"};if(bytes.subarray(4,8).toString()==="ftyp")return {mime:"video/mp4",ext:"mp4"};return null;}
export async function ownsAttachment(user:CurrentUser,url:string){if(!url.startsWith("/api/attachments/"))return true;const id=url.slice("/api/attachments/".length);const [item]=await getDatabase().select({id:attachments.id}).from(attachments).where(and(eq(attachments.id,id),user.role==="admin"?undefined:eq(attachments.uploaderId,user.id)));return Boolean(item);}
