import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/svelte/svelte5";

import Layout from "../src/routes/+layout.svelte";

describe("Layout Component", () => {
  let component: ReturnType<typeof render>;
  let container: HTMLElement;

  beforeEach(() => {
    component = render(Layout);
    container = component.container;
  });

  it.each(["html", "head", "body"])("renders a <%s> tag", (tag) => {
    const el = document.querySelector(tag);
    expect(el).toBeInTheDocument();
  });

  describe("<head>", () => {
    it.each([
      "name='viewport'",
      "name='robots'",
      "name='author'",
      "property='og:type'",
      "property='og:image'"
    ])(`renders expected 'meta[%s]' tag`, (name) => {
      const meta = document.querySelector(`meta[${name}]`);
      expect(meta).toBeInTheDocument();
      expect(meta?.hasAttribute("content")).toBeTruthy();

      const contentVal = meta?.getAttribute("content");
      expect(contentVal).not.toBe(String());
      expect(contentVal).toStrictEqual(expect.any(String));
    });

    it("renders a favicon", () => {
      const icon = document.querySelector("link[rel='icon']");
      expect(icon).toBeInTheDocument();
      expect(icon?.hasAttribute("href")).toBeTruthy();
      expect(icon?.getAttribute("href")).toContain("data:image");
    });

    it("sets charset utf-8", () => {
      const charset = document.querySelector("meta[charset]");
      expect(charset).toBeInTheDocument();
      expect(charset?.hasAttribute("charset")).toBeTruthy();
      expect(charset?.getAttribute("charset")).toBe("utf-8");
    });

    it("renders a meta['author'] tag", () => {
      const author = document.querySelector("meta[name='author']");
      expect(author).toBeInTheDocument();
      expect(author?.hasAttribute("content")).toBeTruthy();
      expect(author?.getAttribute("content")).toContain("devs");
    });

    it("preloads a font", () => {
      const preload = document.querySelector("link[rel='preload']");
      expect(preload).toBeInTheDocument();
      expect(preload?.hasAttribute("href")).toBeTruthy();
    });
  });

  describe("<body>", () => {
    it("renders proper SvelteKit components", () => {
      expect(container).toBeTruthy();
    });

    it.each(["header", "h1", "main", "footer", "h2"])(
      `renders the correct <%s> structure`,
      (tag) => {
        const main = container.querySelector(tag);
        expect(main).toBeInTheDocument();
      }
    );

    it("has the correct main container id", () => {
      const main = container.querySelector("main#data-app");
      expect(main).toBeInTheDocument();
    });

    it("renders the header with site title link", () => {
      const header = screen.getByRole("banner");
      const headerLink = within(header).getByRole("link", { name: /Data API/i });

      expect(headerLink).toBeInTheDocument();
      expect(headerLink.getAttribute("href")).toBe("/");
    });
  });

  describe("<footer>", () => {
    it("renders copyright information", () => {
      const footer = container.querySelector("footer");

      expect(footer).toBeInTheDocument();
      expect(footer?.getAttribute("aria-label")).toBe("Site footer");
    });

    it("renders copyright symbol", () => {
      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
      expect(footer?.textContent).toContain("©");
    });

    it("displays the Data API link", () => {
      const footer = screen.getByRole("contentinfo");
      const links = screen.getAllByRole("link", { name: /Data\s*API/i });

      expect(links.some((link) => footer.contains(link))).toBe(true);
    });

    it("displays the Gasworks Data link", () => {
      const gasworksLink = screen.getByRole("link", { name: /gasworks data/i });

      expect(gasworksLink).toBeInTheDocument();
      expect(gasworksLink.getAttribute("href")).toBe("https://gasworksdata.com/");
    });

    it("displays the human-made link", () => {
      const humanMadeLink = screen.getByRole("link", { name: /human-made/i });

      expect(humanMadeLink).toBeInTheDocument();
      expect(humanMadeLink.getAttribute("href")).toBe("https://thehumanmade.org");
    });

    it("displays the human-made badge image", () => {
      const badge = container.querySelector("img.human-made");

      expect(badge).toBeInTheDocument();
      expect(badge?.getAttribute("alt")).toBe("TheHumanMade badge");
      expect(badge?.getAttribute("width")).toBe("50");
      expect(badge?.getAttribute("height")).toBe("50");
    });

    it("displays the current year in copyright", () => {
      const footer = container.querySelector("footer");
      const currentYear = new Date().getFullYear();

      expect(footer?.textContent).toContain(currentYear.toString());
    });

    it("displays 'all rights reserved' text", () => {
      const footer = container.querySelector("footer");

      expect(footer?.textContent).toContain("All rights reserved");
    });

    it("renders a JSON-LD schema.org block", () => {
      const jsonLd = container.querySelector("script[type='application/ld+json']");

      expect(jsonLd).toBeInTheDocument();
    });

    it("renders a darkvisitors script tag", () => {
      const darkVisitors = container.querySelector("script[async]");

      expect(darkVisitors).toBeInTheDocument();
    });
  });
});
