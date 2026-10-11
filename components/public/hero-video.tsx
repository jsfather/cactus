"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n/config";
function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function HeroVideo({ url, poster, locale }: { url: string; poster?: string; locale: Locale }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduceMotion = useSyncExternalStore(subscribe, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (reduceMotion) video.current?.pause();
    else void video.current?.play().catch(() => {});
  }, [reduceMotion, url]);
  return <><video ref={video} className="home-hero-media" src={url} poster={poster || undefined} autoPlay={!reduceMotion} muted loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label={locale === "fa" ? "فعالیت‌های رباتیک کاکتوس" : "Cactus robotics activities"} /><button type="button" className="hero-video-toggle" aria-label={locale === "fa" ? playing ? "توقف ویدیوی هیرو" : "پخش ویدیوی هیرو" : playing ? "Pause hero video" : "Play hero video"} onClick={() => { if (playing) video.current?.pause(); else void video.current?.play().catch(() => {}); }}>{playing ? "Ⅱ" : "▶"}<span>{locale === "fa" ? playing ? "توقف ویدیو" : "پخش ویدیو" : playing ? "Pause video" : "Play video"}</span></button></>;
}
