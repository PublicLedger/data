#!/usr/bin/env node

/**
 * Fetches the latest GitHub release data and outputs it as environment variables
 * to be consumed during the build process.
 *
 * This script is automatically run as a "prebuild" step via package.json.
 *
 * Environment variables created:
 * - PUBLIC_RELEASE_VERSION: The tag name of the latest release (e.g., "v1.2.3")
 * - PUBLIC_RELEASE_PUBLISHED_AT: ISO date when the release was published
 * - PUBLIC_RELEASE_CREATED_AT: ISO date when the release was created
 *
 * If the GitHub API is unavailable or returns an error, fallback values are used.
 */

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fetchLatestRelease() {
  try {
    console.log("Fetching latest GitHub release...");

    const response = await fetch(
      "https://api.github.com/repos/news-bots/news-bots/releases/latest",
      {
        headers: {
          "User-Agent": "news-bots-website-build"
          // Add GitHub token for higher rate limits if needed:
          // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN || ''}`
        }
      }
    );

    if (!response.ok) {
      console.warn(`GitHub API request failed: ${response.status}`);
      return getFallbackData();
    }

    const release = await response.json();

    return {
      version: release.tag_name || release.name || "0.0.0",
      publishedAt: release.published_at || new Date().toISOString(),
      createdAt: release.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.warn("Failed to fetch GitHub release data:", error.message);
    return getFallbackData();
  }
}

function getFallbackData() {
  console.log("Using fallback release data");
  const now = new Date().toISOString();
  return {
    version: "0.0.0",
    publishedAt: now,
    createdAt: now
  };
}

async function main() {
  const releaseData = await fetchLatestRelease();

  // Write to .env.local for development
  const envContent = `# Auto-generated release data - do not edit manually
PUBLIC_RELEASE_VERSION=${releaseData.version}
PUBLIC_RELEASE_PUBLISHED_AT=${releaseData.publishedAt}
PUBLIC_RELEASE_CREATED_AT=${releaseData.createdAt}
`;

  const envPath = join(__dirname, "..", ".env.local");
  writeFileSync(envPath, envContent);

  console.log(`Release data written to .env.local:`);
  console.log(`- Version: ${releaseData.version}`);
  console.log(`- Published: ${releaseData.publishedAt}`);
  console.log(`- Created: ${releaseData.createdAt}`);
}

main().catch(console.error);
