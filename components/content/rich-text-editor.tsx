"use client";

import { useCallback, useState } from "react";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { MediaPickerDialog, type MediaSelection } from "@/components/media/media-picker-dialog";
import { PanelInput } from "@/components/panel/form-controls";
import type { Locale } from "@/lib/i18n/config";

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className="grid min-h-9 min-w-9 place-items-center rounded-lg px-2 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-950 aria-pressed:bg-emerald-100 aria-pressed:text-emerald-800 disabled:opacity-35 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white dark:aria-pressed:bg-emerald-950 dark:aria-pressed:text-emerald-300"
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  name,
  initialValue,
  locale,
  contentDirection,
  required = false,
}: {
  name: string;
  initialValue: string;
  locale: Locale;
  contentDirection: "rtl" | "ltr";
  required?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const { toast } = useFeedback();
  const isFa = locale === "fa";
  const closeMedia = useCallback(() => setMediaOpen(false), []);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ allowBase64: false, inline: false }),
      Placeholder.configure({
        placeholder: isFa ? "محتوا را اینجا بنویسید…" : "Write your content here…",
      }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class:
          "rich-editor-content min-h-72 px-5 py-4 text-base leading-8 text-zinc-800 outline-none dark:text-zinc-200",
        dir: contentDirection,
      },
    },
    onUpdate: ({ editor: currentEditor }) => setValue(currentEditor.getHTML()),
  });

  const beginLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    setLinkValue(previous || "https://");
    setLinkOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;
    const href = linkValue.trim();
    if (!href) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
  };

  const selectImage = (selection: MediaSelection) => {
    if (!editor) return;
    const alt = contentDirection === "rtl" ? selection.altFa || "" : selection.altEn || "";
    editor.chain().focus().setImage({ src: selection.url, alt }).run();
    toast.success(isFa ? "تصویر به محتوا اضافه شد." : "Image added to the content.");
  };

  if (!editor) {
    return <div className="h-80 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />;
  }

  return (
    <>
    <div className="overflow-hidden rounded-2xl border border-zinc-300 bg-white focus-within:border-emerald-600 focus-within:ring-3 focus-within:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950">
      <input type="hidden" name={name} value={value} required={required} />
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
        <ToolbarButton label={isFa ? "پررنگ" : "Bold"} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolbarButton>
        <ToolbarButton label={isFa ? "مورب" : "Italic"} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolbarButton>
        <ToolbarButton label={isFa ? "عنوان" : "Heading"} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
        <ToolbarButton label={isFa ? "فهرست نقطه‌ای" : "Bullet list"} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• ≡</ToolbarButton>
        <ToolbarButton label={isFa ? "فهرست شماره‌ای" : "Numbered list"} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolbarButton>
        <ToolbarButton label={isFa ? "نقل قول" : "Quote"} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>“”</ToolbarButton>
        <ToolbarButton label={isFa ? "پیوند" : "Link"} active={editor.isActive("link")} onClick={beginLink}>↗</ToolbarButton>
        <ToolbarButton label={isFa ? "تصویر" : "Image"} onClick={() => setMediaOpen(true)}>▧</ToolbarButton>
        <span className="mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
        <ToolbarButton label={isFa ? "بازگشت" : "Undo"} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↶</ToolbarButton>
        <ToolbarButton label={isFa ? "تکرار" : "Redo"} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↷</ToolbarButton>
      </div>
      {linkOpen ? <div className="flex flex-col gap-2 border-b border-zinc-200 bg-white p-3 sm:flex-row dark:border-zinc-800 dark:bg-zinc-950"><PanelInput value={linkValue} onChange={(event) => setLinkValue(event.target.value)} dir="ltr" className="nums-en" aria-label={isFa ? "نشانی پیوند" : "Link URL"} /><button type="button" onClick={applyLink} className="shrink-0 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950">{isFa ? "اعمال پیوند" : "Apply link"}</button><button type="button" onClick={() => setLinkOpen(false)} className="shrink-0 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium dark:border-zinc-700">{isFa ? "انصراف" : "Cancel"}</button></div> : null}
      <EditorContent editor={editor} />
    </div>
    <MediaPickerDialog open={mediaOpen} locale={locale} kind="content" onClose={closeMedia} onSelect={selectImage} />
    </>
  );
}
