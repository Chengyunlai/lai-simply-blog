const puppeteer = require('puppeteer-core');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'images');
const BASE_URL = process.env.SCREENSHOT_BASE_URL || 'http://localhost:3001';

const pages = [
  { name: 'home-en', url: `${BASE_URL}/en`, width: 1280, height: 800 },
  { name: 'blog-en', url: `${BASE_URL}/en/blog`, width: 1280, height: 800 },
  { name: 'article-en', url: `${BASE_URL}/en/blog/blog-usage-guide`, width: 1280, height: 900 },
  { name: 'settings-en', url: `${BASE_URL}/en/settings`, width: 1280, height: 900 },
];

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const p of pages) {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: p.width, height: p.height });
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
      const filePath = path.join(SCREENSHOTS_DIR, `${p.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`✓ ${p.name}.png`);
      await page.close();
    } catch (e) {
      console.log(`✗ ${p.name}: ${e.message}`);
    }
  }

  await browser.close();
}

main();
