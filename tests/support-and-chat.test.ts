import assert from "node:assert/strict";
import test from "node:test";
import {
  chatSettingsSchema,
  defaultChatSettings,
  isChatOfficeOpen,
} from "../lib/live-chat/settings";
import { attachmentType } from "../lib/attachments/storage";
import {
  CalendarDate,
  PersianCalendar,
  GregorianCalendar,
  toCalendar,
} from "@internationalized/date";

test("live chat defaults and boundaries", () => {
  assert.equal(defaultChatSettings.idleMinutes, 10);
  for (const idleMinutes of [0, 1441])
    assert.equal(chatSettingsSchema.safeParse({ idleMinutes }).success, false);
  assert.equal(
    chatSettingsSchema.safeParse({ startHour: 18, endHour: 9 }).success,
    false,
  );
  assert.equal(
    chatSettingsSchema.safeParse({ color: "url(javascript:bad)" }).success,
    false,
  );
  assert.equal(
    chatSettingsSchema.safeParse({ logoUrl: "javascript:alert(1)" }).success,
    false,
  );
});
test("office availability uses Tehran days and hours", () => {
  const settings = chatSettingsSchema.parse({
    workingDays: [0],
    startHour: 9,
    endHour: 18,
  });
  assert.equal(
    isChatOfficeOpen(settings, new Date("2026-10-11T06:00:00Z")),
    true,
  );
  assert.equal(
    isChatOfficeOpen(settings, new Date("2026-10-11T15:00:00Z")),
    false,
  );
  assert.equal(
    isChatOfficeOpen(settings, new Date("2026-10-12T06:00:00Z")),
    false,
  );
});
test("voice acceptance requires a WebM/Opus container signature", () => {
  const audio = Buffer.concat([
    Buffer.from([0x1a, 0x45, 0xdf, 0xa3]),
    Buffer.from("webm"),
    Buffer.from("OpusHead"),
  ]);
  assert.equal(attachmentType(audio)?.mime, "audio/webm");
  assert.equal(attachmentType(Buffer.from("not a voice file")), null);
  assert.equal(
    attachmentType(
      Buffer.concat([
        Buffer.from([0x1a, 0x45, 0xdf, 0xa3]),
        Buffer.from("webm"),
      ]),
    ),
    null,
  );
});
test("academic semester boundaries preserve canonical ISO dates", () => {
  const persian = new PersianCalendar();
  const start = toCalendar(
    new CalendarDate(persian, 1405, 7, 1),
    new GregorianCalendar(),
  ).toString();
  assert.equal(start, "2026-09-23");
});
