import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory ${src} does not exist, skipping.`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function renderTemplate(template, data) {
  return template.replace(/\{\{\{?(\w+)\}?\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

function build() {
  console.log('Starting build...');
  
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  
  console.log('Copying static/ to dist/...');
  const staticDir = path.join(__dirname, 'static');
  if (fs.existsSync(staticDir)) {
    copyDirSync(staticDir, distDir);
  }
  
  console.log('Copying index.html to dist/...');
  const indexPath = path.join(__dirname, 'client/index.html');
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, path.join(distDir, 'index.html'));
  }

  // Copy additional standalone pages from client/ into dist/ so they can be served directly
  // This allows anchors in the dashboard to navigate to reviews.html and lessons.html when
  // deployed on a static host (e.g. Replit). Without this step, those pages would be
  // missing from dist/ and the server would return index.html instead. See issue reported by users.
  const extraPages = ['reviews.html', 'lessons.html'];
  extraPages.forEach(page => {
    const srcPath = path.join(__dirname, 'client', page);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(distDir, page));
    }
  });
  
  const listTemplate = fs.readFileSync(path.join(__dirname, 'templates/list.html'), 'utf-8');
  const itemTemplate = fs.readFileSync(path.join(__dirname, 'templates/item.html'), 'utf-8');
  
  const dataDir = path.join(__dirname, 'data');
  const dataFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('hanzi-') && f.endsWith('.json')).sort();
  
  const allUrls = ['https://hanzi-srs.repl.co/'];
  const ranges = [];
  
  dataFiles.forEach(filename => {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));
    ranges.push(data.range);
  });
  
  dataFiles.forEach((filename, index) => {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));
    const range = data.range;
    
    console.log(`Processing ${filename}...`);
    
    data.items.forEach(item => {
      const itemDir = path.join(distDir, 'hanzi/items', item.slug);
      fs.mkdirSync(itemDir, { recursive: true });
      
      const itemHtml = renderTemplate(itemTemplate, {
        title: item.title,
        slug: item.character,
        description: item.description,
        content_html: item.content
      });
      
      fs.writeFileSync(path.join(itemDir, 'index.html'), itemHtml);
      allUrls.push(`https://hanzi-srs.repl.co/hanzi/items/${item.slug}/`);
    });
    
    const itemsHtml = data.items.map(item => `
      <a href="/hanzi/items/${item.slug}/" class="tile">
        <span class="glyph">${item.character}</span>
        <span class="tile-label">${item.pinyin} - ${item.meaning}</span>
      </a>
    `).join('\n');
    
    const contentHtml = `<div class="grid">\n${itemsHtml}\n</div>`;
    
    const prevLink = index > 0 
      ? `<a href="/hanzi/${ranges[index - 1]}/" class="btn nav-link">← Previous (${ranges[index - 1]})</a>`
      : '';
    
    const nextLink = index < dataFiles.length - 1
      ? `<a href="/hanzi/${ranges[index + 1]}/" class="btn nav-link">Next (${ranges[index + 1]}) →</a>`
      : '';
    
    const listHtml = renderTemplate(listTemplate, {
      title: data.title,
      description: data.description,
      content_html: contentHtml,
      prev_link: prevLink,
      next_link: nextLink
    });
    
    const rangeDir = path.join(distDir, 'hanzi', range);
    fs.mkdirSync(rangeDir, { recursive: true });
    fs.writeFileSync(path.join(rangeDir, 'index.html'), listHtml);
    allUrls.push(`https://hanzi-srs.repl.co/hanzi/${range}/`);
  });
  
  console.log('Generating sitemap.xml...');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  
  console.log(`Build complete! Generated ${allUrls.length} pages.`);
  console.log(`- Listing pages: ${dataFiles.length}`);
  console.log(`- Item pages: ${allUrls.length - dataFiles.length - 1}`);
  console.log(`- Sitemap: sitemap.xml`);
}

build();
