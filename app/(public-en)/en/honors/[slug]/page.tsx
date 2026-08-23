import type { Metadata } from "next";
import { HonorPage } from "@/components/public/honor-page";
import { getPublishedHonor } from "@/lib/honors/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const honor = await getPublishedHonor((await params).slug); return honor ? { title: honor.titleEn || honor.titleFa, description: (honor.descriptionEn || honor.descriptionFa).slice(0, 160), openGraph: { images: [honor.certificateImageUrl] } } : { title: "Honor not found" }; }
export default async function EnglishHonorPage({ params }: { params: Promise<{ slug: string }> }) { return <HonorPage locale="en" slug={(await params).slug} />; }
