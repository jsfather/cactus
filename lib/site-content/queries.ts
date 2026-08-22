import { eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { siteContent } from "@/lib/db/schema";

export const defaultSiteContent = {
  key: "about",
  contactNumber: null,
  email: null,
  addressFa: null,
  addressEn: null,
  aboutUsFa: "<p>مدرسه رباتیک کاکتوس، فضای یادگیری پروژه‌محور برای سازندگان آینده است.</p>",
  aboutUsEn: "<p>Cactus Robotics School is a project-based learning space for tomorrow’s makers.</p>",
  missionFa: "<p>ماموریت ما پرورش خلاقیت، حل مسئله و مهارت ساختن است.</p>",
  missionEn: "<p>Our mission is to nurture creativity, problem-solving, and making skills.</p>",
  visionFa: "<p>چشم‌انداز ما نسلی توانمند و مسئول در استفاده از فناوری است.</p>",
  visionEn: "<p>We envision a generation empowered to use technology responsibly.</p>",
  footerTextFa: "همه حقوق برای مدرسه رباتیک کاکتوس محفوظ است.",
  footerTextEn: "All rights reserved by Cactus Robotics School.",
};

export async function getSiteContent() {
  const [content] = await getDatabase()
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, "about"))
    .limit(1);

  return content ?? defaultSiteContent;
}
