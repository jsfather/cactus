import type { Metadata } from "next";
import { AboutPage } from "@/components/public/about-page";

export const metadata: Metadata = {
  title: "About us",
  description: "The story, mission, vision, and contact details of Cactus Robotics School.",
};

export default function Page() { return <AboutPage locale="en" />; }
