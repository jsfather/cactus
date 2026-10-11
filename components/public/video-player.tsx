"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n/config";

type VideoFrame = "auto" | "portrait" | "landscape" | "square";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function VideoPlayer({ url, label, locale, frame = "auto" }: { url: string; label: string; locale: Locale; frame?: VideoFrame }) {
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [naturalFrame, setNaturalFrame] = useState<VideoFrame>("landscape");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const reduceMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduceMotion && !manuallyPaused.current) void element.play().catch(() => {});
      else element.pause();
    }, { threshold: .3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [url, reduceMotion]);
  if (!/^https?:\/\//.test(url) || !URL.canParse(url)) return null;
  const fa = locale === "fa";
  return <figure className={`public-video public-video--${frame === "auto" ? naturalFrame : frame}`}>
    <div className="public-video-stage">
      <video ref={video} autoPlay={!reduceMotion} controls playsInline muted={muted} loop preload="metadata" aria-label={label} src={url}
        onLoadedMetadata={e => { const v = e.currentTarget; setNaturalFrame(v.videoHeight > v.videoWidth * 1.15 ? "portrait" : v.videoWidth > v.videoHeight * 1.15 ? "landscape" : "square"); }}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onVolumeChange={e => setMuted(e.currentTarget.muted)} />
      <div className="public-video-actions">
        <button type="button" aria-label={`${fa ? playing ? "توقف" : "پخش" : playing ? "Pause" : "Play"}: ${label}`} onClick={() => {
          const element = video.current; if (!element) return;
          manuallyPaused.current = playing;
          if (playing) element.pause(); else void element.play().catch(() => {});
        }}>{playing ? "Ⅱ" : "▶"}</button>
        <button type="button" aria-label={`${fa ? muted ? "فعال کردن صدا" : "بی‌صدا کردن" : muted ? "Enable sound" : "Mute"}: ${label}`} onClick={() => setMuted(!muted)}>{fa ? muted ? "صدا خاموش" : "صدا روشن" : muted ? "Sound off" : "Sound on"}</button>
      </div>
    </div>
    <figcaption><span>{label}</span><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${fa ? "باز کردن ویدیو" : "Open video"}: ${label}`}>↗</a></figcaption>
  </figure>;
}
export function VideoGallery({ urls, frames = "", locale, title }: { urls: string; frames?: string; locale: Locale; title: string }) {
  const videos = urls.split("\n").map(v => v.trim()).filter(Boolean);
  const shapes = frames.split("\n");
  return videos.length ? <section className="space-y-5"><h2 className="text-2xl font-bold">{title}</h2><div className="public-video-grid">{videos.map((url, i) => <VideoPlayer key={`${i}:${url}`} url={url} frame={(["portrait", "landscape", "square"].includes(shapes[i]) ? shapes[i] : "auto") as VideoFrame} label={`${title} ${(i + 1).toLocaleString(locale)}`} locale={locale} />)}</div></section> : null;
}
