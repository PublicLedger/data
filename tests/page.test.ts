import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte/svelte5";

import Page from "../src/routes/+page.svelte";

import { PUBLIC_TAGLINE, PUBLIC_TITLE } from "$env/static/public";

describe("Page", () => {
  let component: ReturnType<typeof render>;
  let container: HTMLElement;

  beforeEach(() => {
    component = render(Page);
    container = component.container;
  });

  describe("<head>", () => {
    it("renders the correct canonical tag", () => {
      const canonical = document.querySelector("link[rel='canonical']");
      expect(canonical).toBeInTheDocument();
      expect(canonical?.hasAttribute("href")).toBeTruthy();
      expect(canonical?.getAttribute("href")).toContain("data.publicledger.news");
      expect(canonical?.getAttribute("href")).not.toContain("www.");
    });

    it("renders the correct <title> tag", () => {
      const title = document.querySelector("title");
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toContain(PUBLIC_TITLE);
    });

    it("renders the correct <meta name='description'> tag", () => {
      const desc = document.querySelector(`meta[name="description"]`);
      expect(desc).toBeInTheDocument();
      expect(desc).toHaveAttribute("content");

      const content = desc?.getAttribute("content");
      expect(content).toContain(PUBLIC_TAGLINE);
    });

    it.each(["og:url", "og:description", "og:title"])(
      "renders the correct <meta property='%s'> tag",
      (tag) => {
        const meta = document.querySelector(`meta[property='${tag}']`);
        expect(meta).toBeInTheDocument();
        expect(meta).toHaveAttribute("content");

        // can't be null or empty string, must be a semi-valid text pattern
        const content = meta?.getAttribute("content");
        expect(content).not.toBe(null);
        expect(content).not.toBe(expect.stringContaining(""));
        // expect(content).toBe(expect.any(String));
      }
    );
  });

  describe("<body>", () => {
    it("displays starter text", () => {
      const h2 = container.querySelector("h2");
      expect(h2).toBeInTheDocument();
      expect(h2?.textContent).toContain("coming soon");
    });
  });
});
