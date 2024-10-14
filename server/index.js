const express = require("express");
const fileUpload = require("express-fileupload");
const server = express();
const routes = require("./routes/index");
const next = require("next");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

const dev = !process.env.DEV ? false : true;
const hostname = dotenv.parsed.HOSTNAME;
const port = dotenv.parsed.PORT;
const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  // server.use(bodyParser.json());
  // server.use(bodyParser.urlencoded({ extended: false }));
  server.use(express.json({ limit: "50mb" }));
  server.use(express.urlencoded({ limit: "50mb", extended: true }));

  dev && server.use(logger("dev"));
  server.use(cookieParser());
  server.use(
    cors({
      origin: ["https://easyrubero.com", "https://app.easyrubero.com"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Origin",
        "X-Requested-With",
        "Accept",
        "x-client-key",
        "x-client-token",
        "x-client-secret",
        "Authorization",
      ],
      credentials: true,
    })
  );
  server.use(express.static(path.join(__dirname, "../public")));
  server.use(fileUpload());

  server.use("/api", routes);

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      `> Ready on ${
        dev ? "Development" : "Production"
      } http://${hostname}:${port}`
    );
  });
});
