const cron = require("node-cron");
const processFiles = require("./deleteOrCompressFiles");
const fs = require("fs-extra");
const path = require("path");

// Pastikan folder log ada
const logsRoot = path.join(__dirname, "../logs");
fs.ensureDirSync(logsRoot);

// Flag supaya cron tidak overlap
let isRunning = false;

// Fungsi untuk eksekusi aman
const safeRun = async () => {
  if (isRunning) {
    console.log(
      `[${new Date().toISOString()}] Cleanup skipped — still running.`
    );
    return;
  }

  isRunning = true;
  console.log(`[${new Date().toISOString()}] Running file cleanup cron...`);

  const start = Date.now();
  try {
    await processFiles();
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    console.log(
      `[${new Date().toISOString()}] Cleanup finished in ${duration}s`
    );
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Cleanup error:`, err);
  } finally {
    isRunning = false;
  }
};

// Jalankan cron tiap hari jam 03:00 WIB
cron.schedule("0 3 * * *", safeRun, {
  timezone: "Asia/Jakarta",
});

// Jalankan sekali saat startup
console.log("Initial cleanup on app start...");
safeRun();
