import dotenv from "dotenv";
import { enqueue, listQueue } from "./db.js";
import { postTweet } from "./twitter.js";
import { generateTweet } from "./llm.js";
import { startScheduler } from "./scheduler.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

function getFlag(args, name) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
}

function requireFlag(args, name) {
  const value = getFlag(args, name);
  if (!value) {
    throw new Error(`Missing --${name}`);
  }
  return value;
}

function addSeconds(date, seconds) {
  return new Date(date.getTime() + seconds * 1000);
}

function parseDelayToSeconds(input) {
  if (!input) return null;
  const value = input.trim().toLowerCase();
  const match = value.match(/^(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours)$/);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2];
  if (unit.startsWith("s")) return amount;
  if (unit.startsWith("m")) return amount * 60;
  return amount * 3600;
}

function resolveRunAt(args) {
  const at = getFlag(args, "at");
  if (at) return at;
  const delay = getFlag(args, "in") || getFlag(args, "delay");
  const seconds = parseDelayToSeconds(delay);
  if (!seconds) {
    throw new Error('Missing --at or --in/--delay (e.g. --in "10m")');
  }
  return addSeconds(new Date(), seconds).toISOString();
}

async function handlePost(args) {
  const text = requireFlag(args, "text");
  const id = await postTweet(text);
  console.log(`Posted: ${id}`);
}

async function handleGenerate(args) {
  const topic = requireFlag(args, "topic");
  const tone = getFlag(args, "tone") || "neutral";
  const style = getFlag(args, "style") || "short";
  const text = await generateTweet({ topic, tone, style });
  const id = await postTweet(text);
  console.log(`Generated + posted: ${id}`);
  console.log(text);
}

async function handleSchedule(args) {
  const text = requireFlag(args, "text");
  const runAt = resolveRunAt(args);
  const id = await enqueue(text, runAt);
  console.log(`Scheduled: ${id}`);
}

async function handleScheduleAi(args) {
  const topic = requireFlag(args, "topic");
  const tone = getFlag(args, "tone") || "neutral";
  const style = getFlag(args, "style") || "short";
  const runAt = resolveRunAt(args);
  const text = await generateTweet({ topic, tone, style });
  const id = await enqueue(text, runAt);
  console.log(`Generated + scheduled: ${id}`);
  console.log(text);
}

async function handleList(args) {
  const limitRaw = getFlag(args, "limit") || "20";
  const limit = Number(limitRaw);
  const rows = await listQueue(Number.isNaN(limit) ? 20 : limit);
  for (const row of rows) {
    console.log(
      JSON.stringify(
        {
          id: row._id.toString(),
          status: row.status,
          runAt: row.runAt,
          createdAt: row.createdAt,
          error: row.error || null,
          text: row.text,
        },
        null,
        2
      )
    );
  }
}

function showHelp() {
  console.log(`Commands:
  post --text "Hello"
  generate --topic "AI agents" --tone "friendly" --style "short"
  schedule --text "Hello later" --at "2026-03-27T22:00:00+05:30"
  schedule-ai --topic "AI" --tone "friendly" --style "short" --at "2026-03-27T22:00:00+05:30"
  schedule --text "Hello later" --in "10m"
  schedule-ai --topic "AI" --tone "friendly" --style "short" --in "2h"
  list --limit 10
  worker
`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  if (!cmd || cmd === "help" || cmd === "--help") {
    showHelp();
    return;
  }
  if (cmd === "post") return handlePost(args);
  if (cmd === "generate") return handleGenerate(args);
  if (cmd === "schedule") return handleSchedule(args);
  if (cmd === "schedule-ai") return handleScheduleAi(args);
  if (cmd === "list") return handleList(args);
  if (cmd === "worker") {
    startScheduler();
    console.log("Scheduler running...");
    return;
  }
  throw new Error(`Unknown command: ${cmd}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
