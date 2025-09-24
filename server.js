// import http from "http";
// import dotenv from "dotenv";
// import pool from "./src/config/db.js";
// import app from "./src/app.js";

// dotenv.config();
// const port = process.env.PORT || 5000;

// // Test connection, inspect database, insert test user
// pool.connect()
//   .then(async client => {
//     client.release();
//   })
//   .catch(err => {
//     console.error("❌ PostgreSQL connection error:", err.message);
//   });

// // Create HTTP server
// const server = http.createServer(app);

// server.listen(port, () => {
//   console.log(`\nServer is running on http://localhost:${port}`);
// });
import http from "http";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import app from "./src/app.js";
import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf-8"));

dotenv.config();
const port = process.env.PORT || 5000;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to check Firebase connection
async function checkFirebaseConnection() {
  try {
    await admin.auth().listUsers(1); // lightweight request
    console.log("✅ Firebase connected successfully");
    return true;
  } catch (err) {
    console.error("❌ Firebase connection error:", err.message);
    return false;
  }
}

// Test Postgres + Firebase connection before starting server
(async function init() {
  try {
    // Test Postgres connection
    const client = await pool.connect();
    console.log(`✅ PostgreSQL connected to database: ${process.env.DB_NAME}`);
    client.release();

    // Test Firebase connection
    const firebaseOk = await checkFirebaseConnection();
    if (!firebaseOk) throw new Error("Firebase connection failed");

    // Start server
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Initialization error:", err.message);
    process.exit(1); // Exit if any connection fails
  }
})();
