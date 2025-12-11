#!/usr/bin/env node
/**
 * Generate robots.txt dynamically from environment variables
 * Usage: DOMAIN=yourdomain.com node scripts/generate-robots.js
 */

const fs = require('fs');
const path = require('path');

// Get domain from environment variable or use placeholder
const DOMAIN = process.env.DOMAIN || process.env.VITE_SITE_URL || 'PLACEHOLDER_DOMAIN.com';
const BASE_URL = `https://${DOMAIN}`;

const robots = `# robots.txt for KinalTech Landing Page
# Generated automatically - Update DOMAIN environment variable to regenerate

User-agent: *
Allow: /

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin/internal paths if any
# Disallow: /admin/
# Disallow: /api/

# Crawl-delay (optional, adjust if needed)
# Crawl-delay: 1
`;

// Write to public directory
const publicDir = path.join(__dirname, '..', 'public');
const robotsPath = path.join(publicDir, 'robots.txt');

fs.writeFileSync(robotsPath, robots, 'utf8');
console.log(`robots.txt generated successfully at ${robotsPath}`);
console.log(`Domain: ${BASE_URL}`);

