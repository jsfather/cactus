import { SoftwarePage } from "@/components/public/software-page";
import { getSoftwareSeo } from "@/lib/resources/software-seo";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return getSoftwareSeo((await params).id, "en");
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SoftwarePage id={id} locale="en" />;
}
