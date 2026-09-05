import { StudentTermsPage } from "@/components/workflows/student-pages";export default async function Page({params}:{params:Promise<{id:string}>}){return <StudentTermsPage id={(await params).id}/>;}
