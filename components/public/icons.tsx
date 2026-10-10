import type { SVGProps } from "react";
export type PublicIconName =
  | "home"
  | "shop"
  | "courses"
  | "software"
  | "teachers"
  | "honors"
  | "search"
  | "menu"
  | "close"
  | "book";
const paths: Record<PublicIconName, React.ReactNode> = {
  home: <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z" />,
  shop: (
    <>
      <path d="m12 2-9 5v10l9 5 9-5V7Z" />
      <path d="m3 7 9 5 9-5M12 12v10" />
    </>
  ),
  courses: (
    <>
      <path d="m2 9 10-6 10 6-10 6ZM6 13v5c3 3 9 3 12 0v-5M22 9v7" />
    </>
  ),
  software: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4m-4-7-3-3 3-3m8 0 3 3-3 3" />
    </>
  ),
  teachers: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M16 14a5 5 0 0 1 5 5v1" />
    </>
  ),
  honors: (
    <>
      <path d="M7 3h10v7a5 5 0 0 1-10 0ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 15v5M7 21h10" />
    </>
  ),
  search: (
    <>
      <circle cx="10.9" cy="10.9" r="7" />
      <path d="m16 16 5 5" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  book: (
    <>
      <path d="M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2ZM12 5v16" />
    </>
  ),
};
export function PublicIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: PublicIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
