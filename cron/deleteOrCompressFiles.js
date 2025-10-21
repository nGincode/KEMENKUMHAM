const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

const folders = [
  path.join(__dirname, "../public/upload/kunjungan"),
  path.join(__dirname, "../public/upload/kunjunganKuasaHukum"),
];

const logsRoot = path.join(__dirname, "../logs");

async function ensureTodayLogFile() {
  await fs.ensureDir(logsRoot);
  const todayFolder = path.join(
    logsRoot,
    new Date().toISOString().slice(0, 10)
  );
  await fs.ensureDir(todayFolder);
  return path.join(todayFolder, "cron.log");
}

async function writeLog(file, msg) {
  const timestamp = new Date().toISOString();
  await fs.appendFile(file, `[${timestamp}] ${msg}\n`);
}

async function cleanupOldLogs() {
  const folders = await fs.readdir(logsRoot);
  const now = Date.now();

  await Promise.all(
    folders.map(async (folder) => {
      const folderPath = path.join(logsRoot, folder);
      const stats = await fs.stat(folderPath);
      const ageInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      if (ageInDays > 30) {
        await fs.remove(folderPath);
        console.log(`Deleted old log folder: ${folder}`);
      }
    })
  );
}

async function processFiles() {
  const logFile = await ensureTodayLogFile();
  await cleanupOldLogs();

  const now = Date.now();

  for (const directoryPath of folders) {
    const files = await fs.readdir(directoryPath);

    // Jalankan paralel dengan batas (max 5 sekaligus)
    const BATCH_SIZE = 5;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (file) => {
          const filePath = path.join(directoryPath, file);
          try {
            const stats = await fs.stat(filePath);
            const ageInDays =
              (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

            if (ageInDays > 30) {
              await fs.unlink(filePath);
              console.log(`Deleted ${file} (${Math.floor(ageInDays)} days)`);
              await writeLog(logFile, `Deleted ${file} from ${directoryPath}`);
            } else if (ageInDays > 10) {
              const data = await sharp(filePath)
                .resize({ width: 100 })
                .jpeg({ quality: 10 })
                .toBuffer();
              await fs.writeFile(filePath, data);
              console.log(`Compressed ${file} (${Math.floor(ageInDays)} days)`);
              await writeLog(
                logFile,
                `Compressed ${file} from ${directoryPath}`
              );
            } else {
              console.log(`Keep ${file} (${Math.floor(ageInDays)} days)`);
              await writeLog(logFile, `Keep ${file} from ${directoryPath}`);
            }
          } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
            await writeLog(logFile, `Error ${file}: ${err.message}`);
          }
        })
      );
    }
  }
}

module.exports = processFiles;

// Jika file ini dijalankan langsung (bukan di-require)
if (require.main === module) {
  (async () => {
    console.log(`[${new Date().toISOString()}] Manual cleanup started...`);
    try {
      await processFiles();
      console.log(`[${new Date().toISOString()}] Manual cleanup finished.`);
    } catch (err) {
      console.error("Manual cleanup failed:", err);
    }
  })();
}
