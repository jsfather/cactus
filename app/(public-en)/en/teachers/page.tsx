import type { Metadata } from "next";
import { TeachersPage } from "@/components/public/teachers-page";

export const metadata: Metadata = { title: "Teachers", description: "Meet the Cactus Robotics School teaching team." };
export default function EnglishTeachersPage() { return <TeachersPage locale="en" />; }
