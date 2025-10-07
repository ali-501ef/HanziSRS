import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'dist')));

// Explicitly serve standalone pages for reviews and lessons.
// We check both dist/ and client/ for the requested file so that navigation
// works regardless of whether the project has been built. Additionally,
// support routes without the .html extension (e.g. '/reviews' or '/lessons')
// by mapping them to the appropriate HTML file.
// Define all standalone pages that should bypass the SPA fallback. Each route
// supports both with and without the .html extension. When a request
// matches one of these routes we serve the corresponding HTML file
// directly from dist/ or client/ if it exists. This list must be kept
// up to date with any new top‑level pages added to the client.
const standaloneRoutes = [
  { path: '/reviews', file: 'reviews.html' },
  { path: '/reviews.html', file: 'reviews.html' },
  { path: '/lessons', file: 'lessons.html' },
  { path: '/lessons.html', file: 'lessons.html' },
  { path: '/login', file: 'login.html' },
  { path: '/login.html', file: 'login.html' },
  { path: '/signup', file: 'signup.html' },
  { path: '/signup.html', file: 'signup.html' },
  { path: '/logout', file: 'logout.html' },
  { path: '/logout.html', file: 'logout.html' },
];

standaloneRoutes.forEach(({ path: routePath, file }) => {
  app.get(routePath, (req, res, next) => {
    try {
      const distPath = path.join(__dirname, 'dist', file);
      if (fs.existsSync(distPath)) {
        return res.sendFile(distPath);
      }
      const clientPath = path.join(__dirname, 'client', file);
      if (fs.existsSync(clientPath)) {
        return res.sendFile(clientPath);
      }
    } catch (err) {
      // ignore errors and fall through to next handler
    }
    // If file isn't found in either location, continue to next handler
    return next();
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log(`Serving static files from dist/`);
});
