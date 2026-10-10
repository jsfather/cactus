"use client";
import { PublicError } from "@/components/public/public-status";
export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <PublicError locale="fa" retry={retry} />;
}
