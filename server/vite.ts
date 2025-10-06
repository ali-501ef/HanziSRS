import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  // ---------------------------------------------------------------------------
  // In development, Vite's middleware will transform index.html and handle
  // module requests. However, our application also includes standalone HTML
  // pages (e.g. reviews.html and lessons.html) that should be served as-is
  // rather than transformed by Vite. When running in Replit or development
  // mode, Express would otherwise fall through to the catch-all route below
  // and always serve index.html. To mirror the behaviour we implemented in
  // serveStatic() for production, intercept these routes here and send the
  // corresponding file directly from the client folder. This ensures that
  // navigation links to reviews.html and lessons.html actually load the
  // expected content instead of the dashboard.
  const standalonePages = ["/reviews.html", "/lessons.html"];
  standalonePages.forEach((page) => {
    app.get(page, async (req, res, next) => {
      try {
        const clientDir = path.resolve(import.meta.dirname, "..", "client");
        const filePath = path.join(clientDir, req.path.replace(/^\//, ""));
        if (fs.existsSync(filePath)) {
          // Read the HTML file from disk and return it without Vite transforming
          const file = await fs.promises.readFile(filePath, "utf-8");
          // Set proper content type
          res.status(200).set({ "Content-Type": "text/html" }).end(file);
          return;
        }
      } catch (err) {
        // fall through to catch-all if the file is missing or read fails
      }
      next();
    });
  });

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static assets from the built public directory
  app.use(express.static(distPath));

  // Explicitly serve standalone HTML pages if they exist in the client folder.
  // This ensures routes like /reviews.html and /lessons.html return the correct
  // file instead of always falling back to index.html. Without this, clicking
  // navigation links simply changes the URL but renders the dashboard because
  // index.html is served for every route. See issue reported by users.
  app.get(["/reviews.html", "/lessons.html"], (req, res, next) => {
    const requested = req.path.replace(/^\//, "");
    // Look for the file inside the built public dir first
    const distFile = path.join(distPath, requested);
    if (fs.existsSync(distFile)) {
      return res.sendFile(distFile);
    }
    // Fallback: serve from the client source directory (during development or if not copied)
    const clientFile = path.resolve(import.meta.dirname, "..", "client", requested);
    if (fs.existsSync(clientFile)) {
      return res.sendFile(clientFile);
    }
    // Otherwise, continue to next handler (will fall back to index)
    return next();
  });

  // Generic fallback: serve index.html for all other unmatched routes
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
