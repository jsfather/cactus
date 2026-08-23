import type { Metadata } from "next";
import { TeacherPage } from "@/components/public/teacher-page";
import { getPublicTeacher } from "@/lib/teacher-profiles/queries";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> { const teacher = await getPublicTeacher((await params).username); return teacher ? { title: `${teacher.firstNameFa} ${teacher.lastNameFa}`.trim(), description: "پروفایل حرفه‌ای مدرس کاکتوس" } : { title: "مدرس یافت نشد" }; }
export default async function PersianTeacherPage({ params }: { params: Promise<{ username: string }> }) { return <TeacherPage locale="fa" username={(await params).username} />; }
