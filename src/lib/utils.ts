import type { WithContext, SoftwareSourceCode } from "schema-dts";

import {
  PUBLIC_BASE_URL,
  PUBLIC_RELEASE_VERSION,
  PUBLIC_RELEASE_PUBLISHED_AT,
  PUBLIC_RELEASE_CREATED_AT
} from "$env/static/public";
import favicon from "$lib/assets/favicon.svg";

export function generateSchemaJSContent(): string {
  // GitHub release data passed from workflow at build time
  const version: string = PUBLIC_RELEASE_VERSION ?? "0.0.0";
  const datePublished: string = PUBLIC_RELEASE_PUBLISHED_AT ?? new Date().toISOString();
  const dateModified: string = PUBLIC_RELEASE_CREATED_AT ?? new Date().toISOString();

  const data: WithContext<SoftwareSourceCode> = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    url: PUBLIC_BASE_URL,
    image: favicon,
    name: "Public Ledger API",
    version,
    author: "Public Ledger devs",
    datePublished,
    dateModified,
    programmingLanguage: "TypeScript",
    license: "https://data.publicledger.news/LICENSE",
    codeRepository: "https://github.com/publicledger/data/"
  };
  const tagBody = JSON.stringify(data, null, 2).replace(/<\/script>/gi, "<\\/script>");

  // build HTML-renderable script tags for analytics
  // eslint-disable-next-line no-useless-escape
  return `<script type="application/ld+json">${tagBody}<\/script>`;
}
