import type { Metadata } from "next";
import { RequirementsPage } from "@/components/public/discovery-pages";
export const metadata: Metadata = { title: "Preparation" };
export default function Page() {
  return <RequirementsPage locale="en" />;
}
