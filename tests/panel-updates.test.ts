import assert from "node:assert/strict";
import test from "node:test";
import { formatPanelDate } from "../lib/date/panel";
import {
  defaultNavigation,
  navigationSchema,
} from "../lib/site-content/navigation";

test("both panel locales use the Persian calendar", () => {
  const nowruz = "2026-03-21";
  assert.match(formatPanelDate(nowruz, "en"), /1405/);
  assert.match(formatPanelDate(nowruz, "fa"), /۱۴۰۵/);
  assert.equal(formatPanelDate("invalid", "fa"), "—");
});

test("timestamps use Tehran's local calendar day", () => {
  const value = new Date("2026-03-20T21:00:00Z");
  assert.match(formatPanelDate(value, "en", true), /1405/);
});

test("previous navigation records get defaults without losing configured links", () => {
  const {
    siteTitleFa,
    siteTitleEn,
    descriptionFa,
    descriptionEn,
    googleVerification,
    socialLinks,
    ...legacy
  } = defaultNavigation;
  void [
    siteTitleFa,
    siteTitleEn,
    descriptionFa,
    descriptionEn,
    googleVerification,
    socialLinks,
  ];
  const parsed = navigationSchema.parse(legacy);
  assert.deepEqual(parsed.headerLinks, legacy.headerLinks);
  assert.deepEqual(parsed.socialLinks, []);
  assert.equal(parsed.siteTitleFa, defaultNavigation.siteTitleFa);
});

test("verification accepts a token, never arbitrary markup", () => {
  for (const token of ["google-token_123", ""]) {
    assert.equal(
      navigationSchema.safeParse({
        ...defaultNavigation,
        googleVerification: token,
      }).success,
      true,
    );
  }
  assert.equal(
    navigationSchema.safeParse({
      ...defaultNavigation,
      googleVerification:
        '<meta name="google-site-verification" content="token">',
    }).success,
    false,
  );
});

test("social profiles require secure external links", () => {
  const link = {
    labelFa: "تلگرام",
    labelEn: "Telegram",
    href: "https://t.me/cactus",
  };
  assert.equal(
    navigationSchema.safeParse({ ...defaultNavigation, socialLinks: [link] })
      .success,
    true,
  );
  for (const href of [
    "javascript:alert(1)",
    "/shop",
    "http://example.com",
    "//example.com",
  ]) {
    assert.equal(
      navigationSchema.safeParse({
        ...defaultNavigation,
        socialLinks: [{ ...link, href }],
      }).success,
      false,
    );
  }
});
