import { ActionButton } from "@/components/workflows/action-form";
import { joinOnlineClass,prepareOnlineClass } from "@/lib/terms/online-class-actions";
import { text } from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
export function OnlineClassControls({termId,locale,manager=false}:{termId:string;locale:Locale;manager?:boolean}){return <div className="flex flex-wrap gap-3">{manager&&<ActionButton locale={locale} label={text(locale,"آماده‌سازی اتاق اسکای‌روم","Prepare Skyroom classroom")} action={prepareOnlineClass.bind(null,termId,locale)}/>}<ActionButton locale={locale} label={text(locale,"ورود به کلاس آنلاین","Join online classroom")} action={joinOnlineClass.bind(null,termId,locale)}/></div>;}
