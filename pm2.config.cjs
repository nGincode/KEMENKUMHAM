module.exports = {
  apps: [
    {
      name: "app.easyrubero.com",
      script: "server/index.js",
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      version: "1.0.0",
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
