import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "../src/routes/sitemap.xml/+server";

describe("sitemap.xml Server Endpoint", () => {
  let response: Response;
  let content: string;

  beforeEach(async () => {
    response = await GET();
    content = await response.text();
  });

  describe("Response", () => {
    it("returns a Response object", () => {
      expect(response).toBeInstanceOf(Response);
    });

    it("has correct Content-Type header", () => {
      expect(response.headers.get("Content-Type")).toBe("application/xml");
    });

    it("returns a 200 status", () => {
      expect(response.status).toBe(200);
    });

    it("returns non-empty content", () => {
      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe("Format Validation", () => {
    it("includes the site URL", () => {
      expect(content).toContain("https://news-bots.org");
    });

    it("includes <urlset> tag", () => {
      expect(content).toContain("urlset");
    });

    it("includes <url> tag", () => {
      expect(content).toContain("url");
    });

    it("includes <loc> tag", () => {
      expect(content).toContain("loc");
    });

    it("falls back to default URL when PUBLIC_BASE_URL is missing", async () => {
      vi.doMock("$env/static/public", () => ({
        PUBLIC_BASE_URL: undefined
      }));

      const { GET: getWithFallback } = await import("../src/routes/sitemap.xml/+server");
      const res = await getWithFallback();
      const text = await res.text();

      expect(text).toContain("https://news-bots.org");

      vi.unmock("$env/static/public");
    });
  });
});
