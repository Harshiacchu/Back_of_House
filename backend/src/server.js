import { env } from './config/env.js';
import { connectDb } from './db/connection.js';
import { ensureIndexes } from './db/indexes.js';
import { createApp } from './app.js';

try {
  await connectDb();
  await ensureIndexes();
  createApp().listen(env.port, () => {
    console.log(`Back of House API running at http://localhost:${env.port}`);
  });
} catch (err) {
  console.error('Failed to start:', err.message);
  process.exit(1);
}
