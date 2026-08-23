import type { Metadata } from "next";
import { TeacherPage } from "@/components/public/teacher-page";
import { getPublicTeacher } from "@/lib/teacher-profiles/queries";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> { const teacher = await getPublicTeacher((await params).username); const name = teacher ? `${teacher.firstNameEn} ${teacher.lastNameEn}`.trim() : ""; return teacher ? { title: name || "Cactus Teacher", description: "Professional profile of a Cactus teacher." } : { title: "Teacher not found" }; }
export default async function EnglishTeacherPage({ params }: { params: Promise<{ username: string }> }) { return <TeacherPage locale="en" username={(await params).username} />; }
