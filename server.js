const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");
const cp = require("cookie-parser");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(helmet());
server.use(cp());
const nodeEnv = process.env.NODE_ENV;
const domains =
  nodeEnv === "production" ?
    ["'self'", "https://www.kevinstonge.com", "https://kevinstonge.com", "http://www.kevinstonge.com", "http://kevinstonge.com"]:
    ['*'] ;
    
server.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": [...domains],
      "img-src": [...domains, "blob:"],
      upgradeInsecureRequests: [],
    },
  })
);
const corsConfig = { credentials: true, origin: nodeEnv === "production" ? domains : true };
server.use(cors(corsConfig));

const path = require("path");
server.use("/public", express.static("./public"));
server.use(express.static("./client/build/"));
server.get("*", (req, res) => {
  if (['js', 'css', 'png', 'map', 'json'].includes(req.path.split('.').slice(-1)[0])) {
    res.sendFile(path.join(__dirname, "./client/build", req.path));
  } else {
    res.sendFile(path.join(__dirname, "./client/build", "index.html"));
  }
});

module.exports = server;