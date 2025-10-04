const cron = require("node-cron");
const processFiles = require("./deleteOrCompressFiles");
const fs = require("fs-extra");
const path = require("path");

// Pastikan root log ada
const logsRoot = path.join(__dirname, "../logs");
fs.ensureDirSync(logsRoot);

// Jalankan cron setiap hari jam 00:00
cron.schedule("0 0 * * *", async () => {
  console.log("Running file cleanup cron...");
  await processFiles();
});

// Jalankan sekali saat server start
console.log("Initial cleanup on app start...");
processFiles().then(() => console.log("Initial cleanup finished"));
