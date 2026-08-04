import { describe, expect, it } from "vitest";
import { excerptFor, readingTimeFor, splitFrontmatter, validateFrontmatter } from "./logs";

describe("splitFrontmatter", () => {
  it("splits a valid frontmatter block from the body", () => {
    // The date is quoted so js-yaml parses it as a plain string rather
    // than auto-converting it to a Date (the YAML timestamp schema).
    const raw = '---\ntitle: Test\ndate: "2026-01-01"\n---\nHello world';
    const { data, content } = splitFrontmatter(raw, "test.md");
    expect(data).toEqual({ title: "Test", date: "2026-01-01" });
    expect(content).toBe("Hello world");
  });

  it("throws when there is no frontmatter block", () => {
    expect(() => splitFrontmatter("Just a body, no frontmatter", "test.md")).toThrow(
      /missing YAML frontmatter block/
    );
  });
});

describe("validateFrontmatter", () => {
  const valid = {
    title: "A Log Entry",
    date: "2026-07-18",
    type: "log",
    status: "Resolved",
    pillars: ["Anecho"],
    tags: ["rust"],
  };

  it("accepts a fully valid frontmatter object", () => {
    expect(validateFrontmatter(valid, "test.md")).toEqual(valid);
  });

  it("rejects a missing field", () => {
    const { title, ...rest } = valid;
    expect(() => validateFrontmatter(rest, "test.md")).toThrow(/missing frontmatter field.*title/);
  });

  it("rejects a malformed date", () => {
    expect(() => validateFrontmatter({ ...valid, date: "07-18-2026" }, "test.md")).toThrow(
      /"date" must be in YYYY-MM-DD format/
    );
  });

  it("rejects an invalid type", () => {
    expect(() => validateFrontmatter({ ...valid, type: "note" }, "test.md")).toThrow(/"type" must be one of/);
  });

  it("rejects an invalid status", () => {
    expect(() => validateFrontmatter({ ...valid, status: "Done" }, "test.md")).toThrow(
      /"status" must be one of/
    );
  });

  it("rejects non-array pillars or tags", () => {
    expect(() => validateFrontmatter({ ...valid, pillars: "Anecho" }, "test.md")).toThrow(
      /"pillars" and "tags" must be arrays/
    );
  });
});

describe("readingTimeFor", () => {
  it("returns a minimum of 1 minute for short text", () => {
    expect(readingTimeFor("just a few words here")).toBe(1);
  });

  it("scales roughly with word count at 200 words/minute", () => {
    const words = new Array(400).fill("word").join(" ");
    expect(readingTimeFor(words)).toBe(2);
  });
});

describe("excerptFor", () => {
  it("strips markdown syntax and collapses whitespace", () => {
    expect(excerptFor("# Heading\n\nSome **bold** text with a `code` span.")).toBe(
      "Heading Some bold text with a code span."
    );
  });

  it("strips fenced code blocks entirely", () => {
    expect(excerptFor("Before\n```js\nconst x = 1;\n```\nAfter")).toBe("Before After");
  });

  it("truncates long text with an ellipsis", () => {
    const long = new Array(60).fill("word").join(" ");
    const result = excerptFor(long, 20);
    expect(result.length).toBeLessThanOrEqual(21);
    expect(result.endsWith("…")).toBe(true);
  });

  it("leaves short text untouched", () => {
    expect(excerptFor("Short text.")).toBe("Short text.");
  });
});
