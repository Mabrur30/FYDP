import "dotenv/config";
import app from "./app";
import connectDB from "./config/db";
import http from "http";
import { initSocket } from "./socket";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://mabrurdcc2020_db_user:FFAOAWGcuqvaRBDf@cluster0.sumqfeb.mongodb.net/?appName=Cluster0";

async function start() {
  if (!process.env.MONGO_URI) {
    console.warn(
      "MONGO_URI not found in environment — using provided fallback URI",
    );
  }

  await connectDB(MONGO_URI);
  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
