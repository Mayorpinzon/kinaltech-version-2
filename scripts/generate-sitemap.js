#!/usr/bin/env node
/**
 * Generate sitemap.xml dynamically from environment variables
 * Usage: DOMAIN=yourdomain.com node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Get domain from environment variable or use placeholder
const DOMAIN = process.env.DOMAIN || process.env.VITE_SITE_URL || 'PLACEHOLDER_DOMAIN.com';
const BASE_URL = `https://${DOMAIN}`;

// Get current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Homepage - English (default) -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/" />
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/?lng=es" />
    <xhtml:link rel="alternate" hreflang="ja" href="${BASE_URL}/?lng=ja" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />
  </url>
  
  <!-- Homepage - Spanish -->
  <url>
    <loc>${BASE_URL}/?lng=es</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/" />
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/?lng=es" />
    <xhtml:link rel="alternate" hreflang="ja" href="${BASE_URL}/?lng=ja" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />
  </url>
  
  <!-- Homepage - Japanese -->
  <url>
    <loc>${BASE_URL}/?lng=ja</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/" />
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/?lng=es" />
    <xhtml:link rel="alternate" hreflang="ja" href="${BASE_URL}/?lng=ja" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />
  </url>
</urlset>
`;

// Write to public directory
const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`Sitemap generated successfully at ${sitemapPath}`);
console.log(`Domain: ${BASE_URL}`);

