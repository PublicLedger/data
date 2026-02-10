import { AgentType, DarkVisitors } from "@darkvisitors/sdk";
import { PUBLIC_BASE_URL } from "$env/static/public";

export const prerender = true;

// https://github.com/ai-robots-txt/ai.robots.tx
// https://darkvisitors.com/docs/robots-txt
const darkVisitors = new DarkVisitors("2ef5d16a-e852-4cbf-8cac-0d9bcdcafa42");

let robotsTxt = "";
try {
  robotsTxt = await darkVisitors.generateRobotsTxt(
    [
      AgentType.AIDataScraper,
      // AgentType.Scraper,
      AgentType.IntelligenceGatherer,
      AgentType.SEOCrawler
    ],
    "/"
  );
} catch (e) {
  throw new Error("Error generating robots.txt: " + e);
}

const robotsList = [
  "AddSearchBot",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "aiHitBot",
  "Amazonbot",
  "Andibot",
  "anthropic-ai",
  "Applebot",
  "Applebot-Extended",
  "Awario",
  "bedrockbot",
  "bigsur.ai",
  "Brightbot 1.0",
  "Bytespider",
  "CCBot",
  "ChatGPT Agent",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "Claude-Web",
  "ClaudeBot",
  "CloudVertexBot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Cotoyogi",
  "Crawlspace",
  "Datenbank Crawler",
  "Devin",
  "Diffbot",
  "DuckAssistBot",
  "Echobot Bot",
  "EchoboxBot",
  "FacebookBot",
  "facebookexternalhit",
  "Factset_spyderbot",
  "FirecrawlAgent",
  "FriendlyCrawler",
  "Gemini-Deep-Research",
  "Google-CloudVertexBot",
  "Google-Extended",
  "Google-Firebase",
  "GoogleAgent-Mariner",
  "GoogleOther",
  "GoogleOther-Image",
  "GoogleOther-Video",
  "GPTBot",
  "iaskspider/2.0",
  "ICC-Crawler",
  "ImagesiftBot",
  "img2dataset",
  "ISSCyberRiskCrawler",
  "Kangaroo Bot",
  "LinerBot",
  "meta-externalagent",
  "Meta-ExternalAgent",
  "meta-externalfetcher",
  "Meta-ExternalFetcher",
  "MistralAI-User",
  "MistralAI-User/1.0",
  "MyCentralAIScraperBot",
  "netEstate Imprint Crawler",
  "NovaAct",
  "OAI-SearchBot",
  "omgili",
  "omgilibot",
  "OpenAI",
  "Operator",
  "PanguBot",
  "Panscient",
  "panscient.com",
  "Perplexity-User",
  "PerplexityBot",
  "PetalBot",
  "PhindBot",
  "Poseidon Research Crawler",
  "QualifiedBot",
  "QuillBot",
  "quillbot.com",
  "SBIntuitionsBot",
  "Scrapy",
  "SemrushBot-OCOB",
  "SemrushBot-SWA",
  "ShapBot",
  "Sidetrade indexer bot",
  "Thinkbot",
  "TikTokSpider",
  "Timpibot",
  "VelenPublicWebCrawler",
  "WARDBot",
  "Webzio-Extended",
  "wpbot",
  "YaK",
  "YandexAdditional",
  "YandexAdditionalBot",
  "YouBot"
];

// TODO: future dedupe with darkVisitors set
export const GET = async () => {
  const sitemap = `
# robots.txt for ${PUBLIC_BASE_URL}
# News-Bots.org content is made available for your personal, non-commercial
# use only. You may not copy, reproduce, republish, upload, post, transmit,
# or distribute in any way any material from this site for commercial use 
# without prior written permission from News-Bots.org: info@news-bots.org

${robotsList.map((bot) => `User-agent: ${bot}`).join("\n")}
Disallow: /

${robotsTxt}`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
};
