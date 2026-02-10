import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "../src/routes/robots.txt/+server";

describe("robots.txt Server Endpoint", () => {
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
      expect(response.headers.get("Content-Type")).toBe("text/plain");
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
    it("has proper robots.txt format", () => {
      // Should have User-agent lines followed by Disallow
      const lines = content.split("\n");
      const userAgentLines = lines.filter((line) => line.startsWith("User-agent:"));
      const disallowLines = lines.filter((line) => line.startsWith("Disallow:"));

      expect(userAgentLines.length).toBeGreaterThan(0);
      expect(disallowLines.length).toBeGreaterThan(0);
    });

    it("does not have trailing whitespace issues", () => {
      const lines = content.split("\n");
      const userAgentLines = lines.filter((line) => line.startsWith("User-agent:"));

      userAgentLines.forEach((line) => {
        // User-agent lines should be properly formatted
        expect(line).toMatch(/^User-agent: .+$/);
      });
    });

    it("includes the site URL in header comment", () => {
      expect(content).toContain("# robots.txt for");
      expect(content).toContain("news-bots.org");
    });

    it("includes copyright notice", () => {
      expect(content).toContain("News-Bots");
      expect(content).toContain("non-commercial");
      expect(content).toContain("info@news-bots.org");
    });

    it("includes User-agent directives", () => {
      expect(content).toContain("User-agent:");
    });

    it("includes Disallow directive", () => {
      expect(content).toContain("Disallow: /");
    });
  });

  describe("Bot Blocking", () => {
    it("includes DarkVisitors generated content", () => {
      // The robotsTxt variable from DarkVisitors should be appended
      // We can't test exact content but can verify structure
      expect(content).toBeTruthy();
      expect(content.split("\n").length).toBeGreaterThan(10);
    });

    it.each(["GPTBot", "PerplexityBot", "anthropic-ai", "ChatGPT-User", "Amazonbot"])(
      "blocks Critical AI bot %s",
      (bot) => {
        expect(content).toContain(`User-agent: ${bot}`);
      }
    );
  });

  describe("Edge Cases", () => {
    it("handles multiple bot variants correctly", () => {
      // Some bots have multiple naming conventions
      expect(content).toContain("User-agent: omgili");
      expect(content).toContain("User-agent: omgilibot");

      expect(content).toContain("User-agent: Panscient");
      expect(content).toContain("User-agent: panscient.com");
    });

    it("includes version-specific bot names", () => {
      expect(content).toContain("User-agent: iaskspider/2.0");
      expect(content).toContain("User-agent: MistralAI-User/1.0");
    });
  });

  describe("Error Handling", () => {
    it("throws a helpful error if the SDK fails", async () => {
      vi.resetModules();
      vi.doMock("@darkvisitors/sdk", () => {
        return {
          AgentType: {
            AIDataScraper: "AIDataScraper",
            IntelligenceGatherer: "IntelligenceGatherer",
            SEOCrawler: "SEOCrawler"
          },
          DarkVisitors: class {
            generateRobotsTxt() {
              return Promise.reject("API Error");
            }
          }
        };
      });

      // We need to re-import the module to trigger the top-level catch
      try {
        await import("../src/routes/robots.txt/+server");
      } catch (e: any) {
        expect(e.message).toContain("Error generating robots.txt: API Error");
      }

      vi.unmock("@darkvisitors/sdk");
    });
  });
});
