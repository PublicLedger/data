import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  PUBLIC_BASE_URL: "https://data.publicledger.news",
  PUBLIC_RELEASE_VERSION: "1.0.0",
  PUBLIC_RELEASE_PUBLISHED_AT: "2026-01-01T00:00:00.000Z",
  PUBLIC_RELEASE_CREATED_AT: "2026-01-01T00:00:00.000Z"
}));

vi.mock("$env/static/public", () => mocks);

import { generateSchemaJSContent } from "../src/lib/utils";

describe("utils.ts", () => {
  beforeEach(() => {
    mocks.PUBLIC_BASE_URL = "https://data.publicledger.news";
    mocks.PUBLIC_RELEASE_VERSION = "1.0.0";
    mocks.PUBLIC_RELEASE_PUBLISHED_AT = "2026-01-01T00:00:00.000Z";
    mocks.PUBLIC_RELEASE_CREATED_AT = "2026-01-01T00:00:00.000Z";
  });

  describe("generateSchemaJSContent", () => {
    it("returns a valid script tag with JSON-LD", () => {
      const content = generateSchemaJSContent();
      expect(content).toMatch(/^<script type="application\/ld\+json">.*<\/script>$/s);

      const jsonStr = content
        .replace('<script type="application/ld+json">', "")
        // eslint-disable-next-line no-useless-escape
        .replace("<\/script>", "");
      const data = JSON.parse(jsonStr);

      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe("SoftwareSourceCode");
      expect(data.version).toBe("1.0.0");
    });

    it("escapes </script> tags to prevent breaking the HTML", () => {
      const content = generateSchemaJSContent();
      const body = content.slice(content.indexOf(">") + 1, content.lastIndexOf("<"));
      expect(body).not.toContain("</script>");
    });

    it("uses default values when environment variables are missing", () => {
      // @ts-expect-error -- intentionally setting undefined to test default values
      mocks.PUBLIC_RELEASE_VERSION = undefined;
      // @ts-expect-error -- intentionally setting undefined to test default values
      mocks.PUBLIC_RELEASE_PUBLISHED_AT = undefined;
      // @ts-expect-error -- intentionally setting undefined to test default values
      mocks.PUBLIC_RELEASE_CREATED_AT = undefined;

      const content = generateSchemaJSContent();
      const jsonStr = content
        .replace('<script type="application/ld+json">', "")
        // eslint-disable-next-line no-useless-escape
        .replace("<\/script>", "");
      const data = JSON.parse(jsonStr);

      expect(data.version).toBe("0.0.0");
      expect(data.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
