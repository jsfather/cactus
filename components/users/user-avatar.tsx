export function UserAvatar({
  name,
  src,
  className = "size-10",
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <span className={`${className} relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : initials || "C"}
    </span>
  );
}
