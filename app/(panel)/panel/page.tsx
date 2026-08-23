import { redirect } from "next/navigation";
import { roleHome } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

export default async function PanelPage() {
  const user = await requireUser();
  if (!user.profileComplete) redirect("/panel/profile?onboarding=1");
  redirect(roleHome[user.role]);
}
