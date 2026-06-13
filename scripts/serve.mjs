/**
 * Visualart — Zero-dependency static dev server
 * Run: npm run dev   (then open http://localhost:5173)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = process.env.PORT || 5173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (urlPath === "/") urlPath = "/index.html";
    // Prevent path traversal
    const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(root, safe);

    let info;
    try {
      info = await stat(filePath);
      if (info.isDirectory()) {
        filePath = join(filePath, "index.html");
        info = await stat(filePath);
      }
    } catch {
      // Fallback to 404.html
      filePath = join(root, "404.html");
      res.statusCode = 404;
    }

    const body = await readFile(filePath);
    res.setHeader("Content-Type", MIME[extname(filePath)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.end(body);
  } catch (err) {
    res.statusCode = 500;
    res.end("500 — " + err.message);
  }
});

server.listen(port, () => {
  console.log(`\n  Visualart running → http://localhost:${port}\n`);
});
