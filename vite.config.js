import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

function devApiPlugin() {
  const DATA_DIR = path.resolve(__dirname, "backend/data");
  const UPLOADS_DIR = path.resolve(DATA_DIR, "uploads");
  const SETTINGS_FILE = path.resolve(DATA_DIR, "settings.json");
  const PHOTOS_FILE = path.resolve(DATA_DIR, "photos.json");

  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const getSettings = () => {
    try {
      if (fs.existsSync(SETTINGS_FILE)) return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    } catch {}
    return {
      key: "main",
      name: "Sahaana",
      birthday_date: "2026-11-03T00:00:00+05:30",
      favourite_caption: "[Write here why this photo is so special to you — this text is yours to fill in]",
      meet_heading: "The Day Our Paths Crossed...",
      meet_date: "",
      meet_message: "[Write your personal message about the day you two first met — this text is yours to fill in]",
      timeline: [],
    };
  };

  const getPhotos = () => {
    try {
      if (fs.existsSync(PHOTOS_FILE)) return JSON.parse(fs.readFileSync(PHOTOS_FILE, "utf-8"));
    } catch {}
    return [];
  };

  return {
    name: "dev-api-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith("/api")) return next();

        const urlObj = new URL(req.url, "http://localhost");
        const pathname = urlObj.pathname;

        if (pathname === "/api/settings") {
          if (req.method === "GET") {
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify(getSettings()));
          }
          if (req.method === "PUT") {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
              const current = getSettings();
              const updated = { ...current, ...JSON.parse(body), key: "main" };
              fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(updated));
            });
            return;
          }
        }

        if (pathname === "/api/photos") {
          if (req.method === "GET") {
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify(getPhotos()));
          }
          if (req.method === "POST") {
            const boundaryMatch = req.headers["content-type"]?.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
            const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;
            const chunks = [];
            req.on("data", (chunk) => chunks.push(chunk));
            req.on("end", () => {
              const buffer = Buffer.concat(chunks);
              let filename = `photo_${Date.now()}.jpg`;
              let caption = "";
              let date = "";

              if (boundary) {
                const parts = buffer.toString("binary").split("--" + boundary);
                for (const part of parts) {
                  if (part.includes('name="caption"')) {
                    const val = part.split("\r\n\r\n")[1];
                    if (val) caption = val.split("\r\n")[0];
                  }
                  if (part.includes('name="date"')) {
                    const val = part.split("\r\n\r\n")[1];
                    if (val) date = val.split("\r\n")[0];
                  }
                  if (part.includes('name="file"')) {
                    const fnameMatch = part.match(/filename="([^"]+)"/);
                    if (fnameMatch) {
                      const ext = path.extname(fnameMatch[1]) || ".jpg";
                      filename = `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`;
                    }
                    const headerEnd = part.indexOf("\r\n\r\n");
                    if (headerEnd !== -1) {
                      const fileBinary = part.slice(headerEnd + 4, part.lastIndexOf("\r\n"));
                      fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(fileBinary, "binary"));
                    }
                  }
                }
              }

              const photos = getPhotos();
              const newPhoto = {
                id: `p_${Date.now()}`,
                url: `/api/photos/files/${filename}`,
                caption,
                date,
                is_favourite: photos.length === 0,
              };
              photos.push(newPhoto);
              fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 201;
              res.end(JSON.stringify(newPhoto));
            });
            return;
          }
        }

        if (pathname.startsWith("/api/photos/")) {
          const sub = pathname.replace("/api/photos/", "");
          if (sub.startsWith("files/")) {
            const fname = sub.replace("files/", "");
            const filePath = path.join(UPLOADS_DIR, fname);
            if (fs.existsSync(filePath)) {
              const stream = fs.createReadStream(filePath);
              res.setHeader("Content-Type", "image/jpeg");
              return stream.pipe(res);
            }
            res.statusCode = 404;
            return res.end("Not found");
          }

          const photoId = sub;
          const photos = getPhotos();

          if (req.method === "PATCH") {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
              const patch = JSON.parse(body);
              const photo = photos.find((p) => p.id === photoId);
              if (!photo) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: "Not found" }));
              }
              if (patch.is_favourite !== undefined) {
                photos.forEach((p) => {
                  p.is_favourite = p.id === photoId ? Boolean(patch.is_favourite) : false;
                });
              }
              if (patch.caption !== undefined) photo.caption = patch.caption;
              if (patch.date !== undefined) photo.date = patch.date;
              fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(photo));
            });
            return;
          }

          if (req.method === "DELETE") {
            const photo = photos.find((p) => p.id === photoId);
            if (photo) {
              const fname = path.basename(photo.url);
              const fpath = path.join(UPLOADS_DIR, fname);
              if (fs.existsSync(fpath)) {
                try { fs.unlinkSync(fpath); } catch {}
              }
            }
            const updated = photos.filter((p) => p.id !== photoId);
            fs.writeFileSync(PHOTOS_FILE, JSON.stringify(updated, null, 2));
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify({ success: true, id: photoId }));
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
