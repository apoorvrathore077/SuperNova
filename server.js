import http from "http";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import app from "./src/app.js";

dotenv.config();
const port = process.env.PORT || 5000;

// Test connection, inspect database, insert test user
pool.connect()
  .then(async client => {
    console.log("Database Connected: ",process.env.DB_NAME)
    client.release();
  })
  .catch(err => {
    console.error("❌ PostgreSQL connection error:", err.message);
  });

// Create HTTP server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`\nServer is running on http://localhost:${port}`);
});
