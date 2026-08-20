import { redirect } from "next/navigation";
import { roleHome } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

export default async function PanelPage() {
  const user = await requireUser();
  redirect(roleHome[user.role]);
}
