import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte/svelte5";
import Link from "../src/lib/Link.svelte";

describe("Link svelte component", () => {
  it("renders with default rel='noreferrer'", () => {
    render(Link, { props: { to: "https://example.com" } });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("adds 'me' to rel when me prop is true", () => {
    render(Link, { props: { to: "https://example.com", me: true } });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "noreferrer me");
  });

  it("does not add 'me' to rel when me prop is false", () => {
    render(Link, { props: { to: "https://example.com", me: false } });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("passes through other attributes", () => {
    render(Link, { props: { to: "https://example.com", class: "custom-class", id: "my-link" } });
    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
    expect(link).toHaveAttribute("id", "my-link");
  });
});
