import { and, eq, inArray, ne, sql } from "drizzle-orm";
import type { CurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { learningActivities, termEnrollments, termTeachers, terms } from "@/lib/db/schema";
export function accessibleTermIds(user: CurrentUser) {
  const db=getDatabase();
  return user.role==="teacher"?db.select({id:termTeachers.termId}).from(termTeachers).where(eq(termTeachers.teacherId,user.id)):db.select({id:termEnrollments.termId}).from(termEnrollments).where(and(eq(termEnrollments.studentId,user.id),ne(termEnrollments.status,"withdrawn")));
}
export async function canAccessTerm(user:CurrentUser,termId:string,manage=false){
  if(user.role==="admin")return true;
  if(manage&&user.role!=="teacher")return false;
  if(!["teacher","student"].includes(user.role))return false;
  const [row]=await getDatabase().select({id:terms.id}).from(terms).where(and(eq(terms.id,termId),inArray(terms.id,accessibleTermIds(user)))).limit(1);return Boolean(row);
}
export async function getActivity(user:CurrentUser,id:string,manage=false){
  const [item]=await getDatabase().select().from(learningActivities).where(eq(learningActivities.id,id));
  if(!item||!await canAccessTerm(user,item.termId,manage))return null;
  if(user.role==="student"&&(item.status!=="published"||item.kind==="reports"))return null;
  return item;
}
export const userNameSql=(locale:string)=>locale==="en"?sql<string>`concat_ws(' ', users.first_name_en, users.last_name_en)`:sql<string>`concat_ws(' ', users.first_name_fa, users.last_name_fa)`;
