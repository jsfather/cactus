import { OrdersPage } from "@/components/workflows/order-pages"; export default async function Page({params}:{params:Promise<{id:string}>}){return <OrdersPage id={(await params).id}/>;}
