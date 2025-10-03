const { version } = require("./package.json");

module.exports = {
  apps: [
    {
      name: "app.easyrubero.com",
      script: "server/index.js",
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      version: version,
      max_memory_restart: "300M",
      error_file: "/var/log/pm2/app.easyrubero.com-error.log",
      out_file: "/var/log/pm2/app.easyrubero.com-out.log",
      merge_logs: true,
      env: {
        NODE_ENV: "production",
        APP_VERSION: version,
      },
    },
  ],
};
