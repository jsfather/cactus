import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultNavigation,
  navigationSchema,
} from "../lib/site-content/navigation";
import {
  defaultPresentation,
  presentationSchema,
  testimonialSchema,
} from "../lib/site-content/presentation";
import {
  parseSoftwareMetadata,
  softwareMetadataSchema,
  softwareSettingKey,
} from "../lib/resources/software";

test("default site settings remain valid and bilingual", () => {
  assert.equal(navigationSchema.safeParse(defaultNavigation).success, true);
  assert.equal(presentationSchema.safeParse(defaultPresentation).success, true);
});

test("navigation only accepts canonical internal paths or HTTPS", () => {
  const link = defaultNavigation.headerLinks[0];
  for (const href of [
    "javascript:alert(1)",
    "//evil.example",
    "/en/shop",
    "/en",
    "http://example.com",
    "/\\evil.example",
  ]) {
    assert.equal(
      navigationSchema.safeParse({
        ...defaultNavigation,
        headerLinks: [{ ...link, href }],
      }).success,
      false,
      href,
    );
  }
  for (const href of ["/shop", "/", "https://example.com/event"]) {
    assert.equal(
      navigationSchema.safeParse({
        ...defaultNavigation,
        headerLinks: [{ ...link, href }],
      }).success,
      true,
      href,
    );
  }
  assert.equal(
    navigationSchema.safeParse({
      ...defaultNavigation,
      headerLinks: [link, link],
    }).success,
    false,
  );
});

test("event time must be timezone-qualified and valid", () => {
  for (const bannerDeadline of [
    "",
    "2026-12-01T10:00:00+03:30",
    "2026-12-01T06:30:00Z",
  ]) {
    assert.equal(
      presentationSchema.safeParse({ ...defaultPresentation, bannerDeadline })
        .success,
      true,
    );
  }
  for (const bannerDeadline of [
    "not-a-date",
    "2026-12-01T10:00",
    "2026-99-99T10:00:00Z",
  ]) {
    assert.equal(
      presentationSchema.safeParse({ ...defaultPresentation, bannerDeadline })
        .success,
      false,
    );
  }
});

test("testimonial satisfaction stays optional, but cannot exceed 100", () => {
  const item = {
    nameFa: "",
    nameEn: "",
    termFa: "",
    termEn: "",
    achievementFa: "",
    achievementEn: "",
    imageUrl: "",
    videoUrl: "",
    studentSatisfaction: "",
    parentSatisfaction: "",
  };
  assert.equal(testimonialSchema.safeParse(item).success, true);
  for (const studentSatisfaction of [0, 95, 100])
    assert.equal(
      testimonialSchema.safeParse({ ...item, studentSatisfaction }).success,
      true,
    );
  for (const studentSatisfaction of [-1, 101, 95.5])
    assert.equal(
      testimonialSchema.safeParse({ ...item, studentSatisfaction }).success,
      false,
    );
});

test("managed rich content is sanitized before persistence", () => {
  const parsed = presentationSchema.parse({
    ...defaultPresentation,
    whyContentFa:
      '<h3>آموزش</h3><script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)">',
  });
  assert.ok(!parsed.whyContentFa.includes("script"));
  assert.ok(!parsed.whyContentFa.includes("onerror"));
  assert.ok(parsed.whyContentFa.includes("آموزش"));
});

test("software metadata safely round-trips text settings and defaults", () => {
  const data = softwareMetadataSchema.parse({
    developer: "Arduino",
    imageUrl: "/media/content/demo.png",
    summaryFa: "معرفی",
  });
  assert.deepEqual(parseSoftwareMetadata(JSON.stringify(data)), data);
  assert.equal(parseSoftwareMetadata("invalid-json").imageUrl, "");
  assert.equal(parseSoftwareMetadata(null).summaryFa, "");
  assert.equal(
    softwareMetadataSchema.safeParse({ imageUrl: "/media/../secret" }).success,
    false,
  );
  assert.equal(
    softwareMetadataSchema.safeParse({ imageUrl: "data:image/png;base64,abc" })
      .success,
    false,
  );
  assert.equal(softwareSettingKey("abc"), "software.abc");
});
