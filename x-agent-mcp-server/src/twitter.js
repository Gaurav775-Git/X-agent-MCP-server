import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const {
  X_API_KEY,
  X_API_SECRET,
  X_ACCESS_TOKEN,
  X_ACCESS_SECRET,
} = process.env;

if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
  throw new Error("Missing X API credentials in .env");
}

const client = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
});

export async function postTweet(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Tweet text is required");
  }
  if (text.length > 280) {
    throw new Error("Tweet text exceeds 280 characters");
  }
  const result = await client.v2.tweet(text);
  return result?.data?.id;
}
