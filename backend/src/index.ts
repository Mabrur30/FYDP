import "dotenv/config";
import app from "./app";
import connectDB from "./config/db";
import http from "http";
import { initSocket } from "./socket";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is required to start the backend");
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
