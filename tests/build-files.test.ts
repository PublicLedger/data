import { describe, it, expect, beforeAll } from "vitest";
import { promises as fs } from "fs";
import path from "path";

describe("build output", () => {
  const buildDir = path.resolve(__dirname, "../build");
  let buildExists = false;

  beforeAll(async () => {
    try {
      const stat = await fs.stat(buildDir);
      buildExists = stat.isDirectory();
    } catch {
      buildExists = false;
    }
  });

  it.each(["CNAME", ".nojekyll", "robots.txt", "sitemap.xml"])("should contain %s", async file => {
    if (!buildExists) {
      console.log("Skipping build file check - build directory does not exist yet");
      return;
    }

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
  });

  it("should contain at least one compressed sitemap.xml", async () => {
    if (!buildExists) {
      console.log("Skipping compressed sitemap check - build directory does not exist yet");
      return;
    }

    const files = await fs.readdir(buildDir);
    const sitemapBr = files.filter(f => f.startsWith("sitemap.xml") && f.endsWith(".br"));
    expect(sitemapBr.length).toBeGreaterThanOrEqual(1);
  });
});
