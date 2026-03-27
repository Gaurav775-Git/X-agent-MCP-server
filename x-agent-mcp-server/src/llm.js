import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY;
const baseUrl = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const model = process.env.LLM_MODEL || "arcee-ai/trinity-large-preview:free";
const site = process.env.OPENROUTER_SITE || "";
const app = process.env.OPENROUTER_APP || "X-Agent-MCP";

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is required for LLM generation");
}

export async function generateTweet({ topic, tone, style }) {
  const system =
    "You write tweets that are concise, clear, and under 280 characters.";
  const user = [
    `Topic: ${topic || "general"}`,
    `Tone: ${tone || "neutral"}`,
    `Style: ${style || "short"}`,
    "Return ONLY the tweet text, nothing else.",
  ].join("\n");

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(site ? { "HTTP-Referer": site } : {}),
      ...(app ? { "X-Title": app } : {}),
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("LLM returned empty response");
  }
  return content.slice(0, 280);
}
