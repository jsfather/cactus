import type { Metadata } from "next";
import { TeachersPage } from "@/components/public/teachers-page";

export const metadata: Metadata = { title: "مدرسین", description: "با مدرسین مدرسه رباتیک کاکتوس آشنا شوید." };
export default function PersianTeachersPage() { return <TeachersPage locale="fa" />; }
