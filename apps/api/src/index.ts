import "dotenv/config";
import { getDb } from "./db/connection.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT ?? 3001;
const db = getDb();
const app = createApp(db);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
