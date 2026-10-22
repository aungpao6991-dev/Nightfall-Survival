"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 8000;
const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/game.js", ["game.js", "text/javascript; charset=utf-8"]]
]);

http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad Request");
    return;
  }

  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404);
    response.end("Not Found");
    return;
  }

  fs.readFile(path.join(root, file[0]), (error, content) => {
    if (error) {
      console.error(`Unable to read ${file[0]}:`, error);
      response.writeHead(500);
      response.end("Unable to load game file");
      return;
    }

    response.writeHead(200, {
      "Content-Type": file[1],
      "Cache-Control": "no-store"
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
}).listen(port, "0.0.0.0", () => {
  console.log(`Nightfall Survivors is listening on port ${port}.`);
});
