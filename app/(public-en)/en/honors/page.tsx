import type { Metadata } from "next";
import { HonorsPage } from "@/components/public/honors-page";

export const metadata: Metadata = { title: "Honors and Certificates", description: "Awards, honors, and certificates earned by Cactus Robotics School." };
export default function EnglishHonorsPage() { return <HonorsPage locale="en" />; }
