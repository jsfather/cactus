import type { Metadata } from "next";
import { HonorPage } from "@/components/public/honor-page";
import { getPublishedHonor } from "@/lib/honors/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const honor = await getPublishedHonor((await params).slug); return honor ? { title: honor.titleFa, description: honor.descriptionFa.slice(0, 160), openGraph: { images: [honor.certificateImageUrl] } } : { title: "افتخار یافت نشد" }; }
export default async function PersianHonorPage({ params }: { params: Promise<{ slug: string }> }) { return <HonorPage locale="fa" slug={(await params).slug} />; }
