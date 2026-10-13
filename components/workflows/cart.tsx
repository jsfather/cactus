/* eslint-disable @next/next/no-img-element -- Managed media can use arbitrary validated remote hosts. */
"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelInput } from "@/components/panel/form-controls";
import { primaryButtonClass, PanelEmptyState } from "@/components/panel/ui";
import { ActionForm } from "./action-form";
import { checkout } from "@/lib/commerce/actions";
import { text } from "@/lib/workflows";
import { CircuitMark } from "@/components/public/design";
import { localizePath, type Locale } from "@/lib/i18n/config";
const key = "cactus-cart-v1";
const schema = z
  .array(
    z.object({
      productId: z.uuid(),
      variantId: z.string(),
      titleFa: z.string(),
      titleEn: z.string(),
      price: z.number().nonnegative(),
      imageUrl: z.string().max(2048).optional(),
      slug: z.string().max(200).optional(),
      quantity: z.number().int().min(1).max(100),
    }),
  )
  .max(50);
export type CartItem = z.infer<typeof schema>[number];
function subscribe(fn: () => void) {
  window.addEventListener("storage", fn);
  window.addEventListener("cactus-cart", fn);
  return () => {
    window.removeEventListener("storage", fn);
    window.removeEventListener("cactus-cart", fn);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}
function parse(raw: string) {
  try {
    const p = schema.safeParse(JSON.parse(raw));
    return p.success ? p.data : [];
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("cactus-cart"));
}
function useCart() {
  return parse(useSyncExternalStore(subscribe, snapshot, () => "[]"));
}
export function AddToCart({
  locale,
  item,
  inventory,
  iconOnly = false,
  quantity = 1,
}: {
  locale: Locale;
  item: Omit<CartItem, "quantity">;
  inventory: number;
  iconOnly?: boolean;
  quantity?: number;
}) {
  const { toast } = useFeedback();
  return (
    <button
      className={iconOnly ? "public-button cart-icon-button" : "public-button"}
      type="button"
      aria-label={text(locale, "افزودن به سبد", "Add to cart")}
      title={text(locale, "افزودن به سبد", "Add to cart")}
      disabled={inventory < 1}
      onClick={() => {
        try {
          const cart = parse(snapshot());
          const existing = cart.find(
            (i) =>
              i.productId === item.productId && i.variantId === item.variantId,
          );
          if (
            !Number.isInteger(quantity) || quantity < 1 || (existing?.quantity ?? 0) + quantity > Math.min(inventory, 100) ||
            (!existing && cart.length >= 50)
          ) {
            toast.error(
              text(
                locale,
                "موجودی یا ظرفیت سبد کافی نیست.",
                "Stock or cart limit reached.",
              ),
            );
            return;
          }
          write(
            existing
              ? cart.map((i) =>
                  i === existing ? { ...i, quantity: i.quantity + quantity } : i,
                )
              : [...cart, { ...item, quantity }],
          );
          toast.success(text(locale, "به سبد اضافه شد.", "Added to cart."));
        } catch {
          toast.error(
            text(
              locale,
              "ذخیره سبد ممکن نیست.",
              "Cart storage is unavailable.",
            ),
          );
        }
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="size-5"><path d="M6 7h14l-2 10H8L5 3H2M9 21h1m6 0h1" /></svg>
      {!iconOnly && text(locale, "افزودن به سبد", "Add to cart")}
    </button>
  );
}
export function CartLink({ locale }: { locale: Locale }) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const { toast } = useFeedback();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function close() { dialog.current?.close(); }
  function change(item: CartItem, delta: number | null) {
    try {
      const current = parse(snapshot());
      const matches = (row: CartItem) => row.productId === item.productId && row.variantId === item.variantId;
      if (delta === null) {
        write(current.filter((row) => !matches(row)));
        toast.success(text(locale, "از سبد حذف شد.", "Removed from cart."));
      } else {
        write(current.map((row) => matches(row) ? { ...row, quantity: Math.max(1, Math.min(100, row.quantity + delta)) } : row));
      }
    } catch { toast.error(text(locale, "ذخیره سبد ممکن نیست.", "Cart storage is unavailable.")); }
  }
  return (
    <div className="public-cart-control">
    <button
      type="button"
      ref={trigger}
      className="public-cart-link"
      aria-label={`${text(locale, "سبد خرید", "Shopping cart")}: ${count.toLocaleString(locale)}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={id}
      onClick={() => { dialog.current?.showModal(); setOpen(true); }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className="size-5"
      >
        <path d="M6 7h14l-2 10H8L5 3H2M9 21h1m6 0h1" />
      </svg>
      <span>{text(locale, "سبد", "Cart")}</span>
      <span>
        {count.toLocaleString(locale)}
      </span>
    </button>
    <dialog ref={dialog} id={id} className="public-cart-dialog" dir={locale === "fa" ? "rtl" : "ltr"} aria-modal="true" aria-labelledby={`${id}-title`} onClose={() => { setOpen(false); if (trigger.current?.isConnected) trigger.current.focus(); }} onClick={(event) => { if (event.target === dialog.current) close(); }}>
      <header className="mini-cart-header">
        <div><h2 id={`${id}-title`}>{text(locale, "سبد خرید شما", "Your shopping cart")}</h2><p>{count.toLocaleString(locale)} {text(locale, "کالا در سبد", "items in your cart")}</p></div>
        <button autoFocus type="button" onClick={close} className="mini-cart-icon" aria-label={text(locale, "بستن سبد خرید", "Close shopping cart")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
      </header>
      <div className="mini-cart-items">
        {cart.length ? cart.map((item) => {
          const title = locale === "fa" ? item.titleFa : item.titleEn || item.titleFa;
          return <article key={`${item.productId}:${item.variantId}`} className="mini-cart-item">
            {item.imageUrl && /^(\/media\/|https?:\/\/)/.test(item.imageUrl) ? <img className="mini-cart-thumbnail" src={item.imageUrl} alt="" width={64} height={64} /> : <span className="mini-cart-thumbnail"><CircuitMark /></span>}
            <div className="mini-cart-item-info">
              <h3>{item.slug ? <Link href={localizePath(locale, `/shop/${encodeURIComponent(item.slug)}`)} onClick={close}>{title}</Link> : title}</h3>
              <p>{(item.price * item.quantity).toLocaleString(locale)} {text(locale, "تومان", "toman")}</p>
              <div className="mini-cart-item-actions">
                <div className="mini-cart-quantity" role="group" aria-label={`${text(locale, "تعداد", "Quantity")} — ${title}`}>
                  <button type="button" disabled={item.quantity >= 100} onClick={() => change(item, 1)} aria-label={`${text(locale, "افزایش تعداد", "Increase quantity")} — ${title}`}>+</button>
                  <span aria-live="polite">{item.quantity.toLocaleString(locale)}</span>
                  <button type="button" disabled={item.quantity <= 1} onClick={() => change(item, -1)} aria-label={`${text(locale, "کاهش تعداد", "Decrease quantity")} — ${title}`}>−</button>
                </div>
                <button className="mini-cart-remove" type="button" onClick={() => change(item, null)} aria-label={`${text(locale, "حذف از سبد", "Remove from cart")} — ${title}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7M14 10v7" /></svg></button>
              </div>
            </div>
          </article>;
        }) : <div className="mini-cart-empty"><span><CircuitMark /></span><h3>{text(locale, "سبد خریدتان خالی است", "Your cart is empty")}</h3><p>{text(locale, "محصولات مورد نیازتان را انتخاب کنید و اینجا ببینید.", "Choose the products you need and find them here.")}</p></div>}
      </div>
      <footer className="mini-cart-footer">
        {cart.length ? <><div className="mini-cart-total"><span>{text(locale, "جمع تقریبی", "Estimated total")}</span><strong>{total.toLocaleString(locale)} {text(locale, "تومان", "toman")}</strong></div><p>{text(locale, "قیمت و موجودی هنگام ثبت سفارش بررسی می‌شود.", "Prices and stock are checked when you place your order.")}</p><Link className="public-button" href={localizePath(locale, "/shop/checkout")} onClick={close}>{text(locale, "مشاهده سبد و تکمیل سفارش", "Review cart and checkout")}<span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span></Link></> : <Link className="public-button" href={localizePath(locale, "/shop")} onClick={close}>{text(locale, "رفتن به فروشگاه", "Explore the shop")}</Link>}
      </footer>
    </dialog>
    </div>
  );
}
export function CartCheckout({
  locale,
  requestKey,
}: {
  locale: Locale;
  requestKey: string;
}) {
  const items = useCart();
  const { toast } = useFeedback();
  function update(next: CartItem[]) {
    try {
      write(next);
      return true;
    } catch {
      toast.error(
        text(locale, "ذخیره سبد ممکن نیست.", "Cart storage is unavailable."),
      );
      return false;
    }
  }
  return items.length ? (
    <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <div className="space-y-4">
        {items.map((i) => (
          <div
            key={`${i.productId}:${i.variantId}`}
            className="public-cart-row"
          >
            {i.imageUrl && /^(\/media\/|https?:\/\/)/.test(i.imageUrl) ? (
              <img className="cart-thumbnail" src={i.imageUrl} alt="" />
            ) : (
              <span className="cart-thumbnail">
                <CircuitMark />
              </span>
            )}
            <div className="min-w-0 flex-1 basis-40">
              <h2 className="font-bold">
                {i.slug ? (
                  <Link href={localizePath(locale, `/shop/${i.slug}`)}>
                    {locale === "en" ? i.titleEn || i.titleFa : i.titleFa}
                  </Link>
                ) : locale === "en" ? (
                  i.titleEn || i.titleFa
                ) : (
                  i.titleFa
                )}
              </h2>
              <p className="mt-2 text-zinc-500">
                {(i.price * i.quantity).toLocaleString(locale)}{" "}
                {text(locale, "تومان", "toman")}
              </p>
            </div>
            <PanelInput
              className="!w-24"
              aria-label={`${text(locale, "تعداد", "Quantity")} — ${locale === "en" ? i.titleEn || i.titleFa : i.titleFa}`}
              type="number"
              min={1}
              max={100}
              value={i.quantity}
              onChange={(e) => {
                const quantity = Number(e.target.value);
                if (
                  Number.isInteger(quantity) &&
                  quantity >= 1 &&
                  quantity <= 100
                )
                  update(
                    items.map((row) =>
                      row === i ? { ...row, quantity } : row,
                    ),
                  );
              }}
            />
            <button
              className="public-link text-sm"
              aria-label={`${text(locale, "حذف", "Remove")} — ${locale === "en" ? i.titleEn || i.titleFa : i.titleFa}`}
              onClick={() => {
                if (update(items.filter((row) => row !== i)))
                  toast.success(
                    text(locale, "از سبد حذف شد.", "Removed from cart."),
                  );
              }}
            >
              {text(locale, "حذف", "Remove")}
            </button>
          </div>
        ))}
        <div className="cart-order-summary">
          <p className="cart-total">
            {text(locale, "جمع تقریبی", "Estimated total")}:{" "}
            {items
              .reduce((n, i) => n + i.price * i.quantity, 0)
              .toLocaleString(locale)}{" "}
            {text(locale, "تومان", "toman")}
          </p>
          <p className="text-sm text-zinc-500">
            {text(
              locale,
              "قیمت و موجودی هنگام ثبت سفارش بررسی می‌شود.",
              "Prices and stock are checked when you place the order.",
            )}
          </p>
        </div>
      </div>
      <ActionForm
        locale={locale}
        action={checkout}
        heading={text(locale, "نشانی تحویل", "Delivery address")}
        submitLabel={text(locale, "ثبت سفارش", "Place order")}
        fields={[
          {
            name: "address",
            label: text(locale, "نشانی کامل", "Full address"),
            type: "textarea",
            required: true,
          },
          {
            name: "postalCode",
            label: text(locale, "کد پستی ۱۰ رقمی", "10-digit postal code"),
            required: true,
          },
          {
            name: "notes",
            label: text(locale, "توضیحات سفارش", "Order notes"),
            type: "textarea",
          },
        ]}
      >
        <input type="hidden" name="cart" value={JSON.stringify(items)} />
        <input type="hidden" name="requestKey" value={requestKey} />
      </ActionForm>
    </div>
  ) : (
    <PanelEmptyState
      title={text(locale, "سبد شما خالی است", "Your cart is empty")}
      description={text(
        locale,
        "ابزارهای مورد نیاز پروژه بعدی خود را پیدا کنید.",
        "Find the tools for your next project.",
      )}
      action={
        <Link
          className={primaryButtonClass}
          href={localizePath(locale, "/shop")}
        >
          {text(locale, "رفتن به فروشگاه", "Browse the shop")}
        </Link>
      }
    />
  );
}

// Remove only purchased quantities once; another tab may have added more items.
export function CompleteCart({
  orderId,
  items,
}: {
  orderId: string;
  items: {
    productId: string | null;
    variantId: string | null;
    quantity: number;
  }[];
}) {
  useEffect(() => {
    const marker = `cactus-cart-order:${orderId}`;
    try {
      if (localStorage.getItem(marker)) return;
      write(
        parse(snapshot()).flatMap((row) => {
          const purchased = items.find(
            (item) =>
              item.productId === row.productId &&
              (item.variantId || "") === row.variantId,
          );
          const quantity = row.quantity - (purchased?.quantity ?? 0);
          return quantity > 0 ? [{ ...row, quantity }] : [];
        }),
      );
      localStorage.setItem(marker, "1");
    } catch {
      /* Checkout remains valid when browser storage is disabled. */
    }
  }, [orderId, items]);
  return null;
}
