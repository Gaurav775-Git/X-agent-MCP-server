import dotenv from "dotenv";
import cron from "node-cron";
import { getDue, markFailed, markPosted } from "./db.js";
import { postTweet } from "./twitter.js";

dotenv.config();

const timezone = process.env.TIMEZONE || "UTC";

export function startScheduler() {
  cron.schedule(
    "* * * * *",
    async () => {
      const due = await getDue(new Date());
      for (const item of due) {
        try {
          await postTweet(item.text);
          await markPosted(item._id.toString());
          console.log(`Posted ${item._id.toString()}`);
        } catch (err) {
          const message = err?.message || String(err);
          await markFailed(item._id.toString(), message);
          console.error(`Failed ${item._id.toString()}: ${message}`);
        }
      }
    },
    { timezone }
  );
}
