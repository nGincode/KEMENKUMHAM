const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

// Folder target
const folders = [
  path.join(__dirname, "../public/upload/kunjungan"),
  path.join(__dirname, "../public/upload/kunjunganKuasaHukum"),
];

// Folder log utama
const logsRoot = path.join(__dirname, "../logs");
fs.ensureDirSync(logsRoot);

// Buat folder log harian
const todayFolder = path.join(logsRoot, new Date().toISOString().slice(0, 10));
fs.ensureDirSync(todayFolder);
const logFile = path.join(todayFolder, "cron.log");

const writeLog = (msg) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
};

// Hapus folder log lebih dari 30 hari
const cleanupOldLogs = () => {
  fs.readdirSync(logsRoot).forEach((folder) => {
    const folderPath = path.join(logsRoot, folder);
    const stats = fs.statSync(folderPath);
    const ageInDays =
      (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays > 30) {
      fs.removeSync(folderPath);
      console.log(`Deleted old log folder: ${folder}`);
    }
  });
};

// Fungsi utama untuk hapus/kompres file
const processFiles = async () => {
  cleanupOldLogs();

  const now = Date.now();

  for (const directoryPath of folders) {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.stat(filePath);
      const ageInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

      try {
        if (ageInDays > 50) {
          // Hapus file
          await fs.unlink(filePath);
          console.log(`Deleted ${file} (age ${Math.floor(ageInDays)} days)`);
          writeLog(`Deleted ${file} from ${directoryPath}`);
        } else if (ageInDays > 10) {
          // Compress foto
          const tempPath = filePath + ".tmp.jpg";
          await sharp(filePath)
            .resize({ width: 300 })
            .jpeg({ quality: 10 })
            .toFile(tempPath);
          await fs.move(tempPath, filePath, { overwrite: true });
          console.log(`Compressed ${file} (age ${Math.floor(ageInDays)} days)`);
          writeLog(`Compressed ${file} from ${directoryPath}`);
        } else {
          console.log(`Keep ${file} (age ${Math.floor(ageInDays)} days)`);
        }
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
        writeLog(
          `Error processing ${file} from ${directoryPath}: ${err.message}`
        );
      }
    }
  }
};

module.exports = processFiles;
