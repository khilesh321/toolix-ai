import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/toolix-ai";
const dbName = process.env.MONGODB_DB || "toolix-ai";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global.mongoClientPromise || new MongoClient(uri).connect();

if (process.env.NODE_ENV !== "production") {
  global.mongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
