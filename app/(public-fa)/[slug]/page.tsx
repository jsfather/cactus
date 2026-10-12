import { LandingPage, landingMetadata } from "@/components/public/managed-landing-page";
export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {return landingMetadata((await params).slug, "fa");}
export default async function Page({params}: {params: Promise<{slug: string}>}) {return <LandingPage slug={(await params).slug} locale="fa" />;}
