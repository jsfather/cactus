import assert from "node:assert/strict";
import test from "node:test";
import { visitorScope, chatRetentionMs } from "../lib/live-chat/identity";
test("history scopes separate shared-IP browsers and changed addresses", () => {
  const previous = process.env.CHAT_CLIENT_IP_HEADER;
  process.env.CHAT_CLIENT_IP_HEADER = "x-forwarded-for";
  try {
    const now = Date.UTC(2026, 9, 12),
      token = `${now}.${"a".repeat(64)}`,
      other = `${now}.${"b".repeat(64)}`;
    const headers = new Headers({ "x-forwarded-for": "192.0.2.1, 10.0.0.1" }),
      changed = new Headers({ "x-forwarded-for": "192.0.2.2" });
    assert.equal(
      visitorScope(token, headers, now),
      visitorScope(token, new Headers({ "x-forwarded-for": "192.0.2.1" }), now),
    );
    assert.notEqual(
      visitorScope(token, headers, now),
      visitorScope(other, headers, now),
    );
    assert.notEqual(
      visitorScope(token, headers, now),
      visitorScope(token, changed, now),
    );
    assert.equal(
      visitorScope(token, new Headers({ "x-forwarded-for": "not-an-ip" }), now),
      null,
    );
    assert.equal(visitorScope(token, new Headers(), now), null);
  } finally {
    if (previous === undefined) delete process.env.CHAT_CLIENT_IP_HEADER;
    else process.env.CHAT_CLIENT_IP_HEADER = previous;
  }
});
test("legacy, expired and future visitor tokens are not reusable", () => {
  const previous = process.env.CHAT_CLIENT_IP_HEADER;
  delete process.env.CHAT_CLIENT_IP_HEADER;
  try {
    const now = Date.UTC(2026, 9, 12),
      headers = new Headers();
    assert.equal(visitorScope("a".repeat(64), headers, now), null);
    assert.equal(
      visitorScope(
        `${now - chatRetentionMs - 1}.${"a".repeat(64)}`,
        headers,
        now,
      ),
      null,
    );
    assert.equal(
      visitorScope(`${now + 1}.${"a".repeat(64)}`, headers, now),
      null,
    );
    assert.ok(visitorScope(`${now}.${"a".repeat(64)}`, headers, now));
  } finally {
    if (previous === undefined) delete process.env.CHAT_CLIENT_IP_HEADER;
    else process.env.CHAT_CLIENT_IP_HEADER = previous;
  }
});
