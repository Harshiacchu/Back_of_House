import { MongoClient } from 'mongodb';

import { env } from '../config/env.js';

let client;
let db;

export async function connectDb() {
  if (db) return db;
  client = new MongoClient(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  db = client.db(env.dbName);
  return db;
}

export function getDb() {
  if (!db) throw new Error('Database not connected. Call connectDb() first.');
  return db;
}

export function getClient() {
  if (!client) throw new Error('Database not connected. Call connectDb() first.');
  return client;
}

export async function closeDb() {
  if (client) await client.close();
  client = undefined;
  db = undefined;
}
