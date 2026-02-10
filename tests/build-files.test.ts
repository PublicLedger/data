import { describe, it, expect } from "vitest";
import { promises as fs } from "fs";
import path from "path";

describe("build output", () => {
  const buildDir = path.resolve(__dirname, "../build");

  it.each(["CNAME", ".nojekyll", "robots.txt", "sitemap.xml"])(
    "should contain %s",
    async (file) => {
      const filePath = path.join(buildDir, file);
      let exists = false;
      let err = undefined;
      try {
        const stat = await fs.stat(filePath);
        exists = stat.isFile();
      } catch (e) {
        err = e;
        exists = false;
      }
      expect(exists).toBe(true);
      expect(err).toBeUndefined();
    }
  );

  it("should contain at least one compressed sitemap.xml", async () => {
    const files = await fs.readdir(buildDir);
    const sitemapBr = files.filter((f) => f.startsWith("sitemap.xml") && f.endsWith(".br"));
    expect(sitemapBr.length).toBeGreaterThanOrEqual(1);
  });
});
