import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/svelte/svelte5";
import "@testing-library/jest-dom/vitest";

// Mock SvelteKit modules
vi.mock("$app/paths", () => ({
  base: "",
  resolve: (path: string) => path
}));

vi.mock("$app/navigation", () => ({
  goto: vi.fn(),
  afterNavigate: vi.fn(),
  beforeNavigate: vi.fn()
}));

vi.mock("$env/static/public", () => ({
  PUBLIC_BASE_URL: "https://news-bots.org",
  PUBLIC_TITLE: "News Bots",
  PUBLIC_TAGLINE: "news + bots = news-bots",
  PUBLIC_RELEASE_VERSION: "1.0.0",
  PUBLIC_RELEASE_PUBLISHED_AT: "2026-01-01T00:00:00.000Z",
  PUBLIC_RELEASE_CREATED_AT: "2026-01-01T00:00:00.000Z"
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});
