import { TicketsPage } from "@/components/workflows/support-pages"; export default async function Page({params}:{params:Promise<{id:string}>}){return <TicketsPage id={(await params).id} edit/>;}
