import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte/svelte5";
import NorefLink from "../src/lib/NorefLink.svelte";

describe("NorefLink svelte component", () => {
  it("renders with default rel='nofollow noreferrer noopener'", () => {
    render(NorefLink, { props: { to: "https://example.com" } });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("rel", "nofollow noreferrer noopener");
  });

  it("passes through other attributes", () => {
    render(NorefLink, {
      props: { to: "https://example.com", class: "custom-class", target: "_blank" }
    });
    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
