import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || "x_agent";

if (!uri) {
  throw new Error("MONGO_URI is required in .env");
}

let client;
let queue;

export async function initDb() {
  if (queue) return queue;
  client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  queue = db.collection("queue");
  await queue.createIndex({ status: 1, runAt: 1 });
  return queue;
}

export async function enqueue(text, runAtIso) {
  const collection = await initDb();
  const runAt = new Date(runAtIso);
  if (Number.isNaN(runAt.getTime())) {
    throw new Error("Invalid run_at datetime");
  }
  const doc = {
    text,
    status: "queued",
    runAt,
    createdAt: new Date(),
    error: null,
  };
  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

export async function getDue(now = new Date()) {
  const collection = await initDb();
  return collection
    .find({ status: "queued", runAt: { $lte: now } })
    .sort({ runAt: 1 })
    .toArray();
}

export async function markPosted(id) {
  const collection = await initDb();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "posted", postedAt: new Date() } }
  );
}

export async function markFailed(id, error) {
  const collection = await initDb();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "failed", error, failedAt: new Date() } }
  );
}

export async function listQueue(limit = 20) {
  const collection = await initDb();
  return collection
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}
