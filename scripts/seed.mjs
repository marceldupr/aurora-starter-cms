#!/usr/bin/env node
/**
 * Seed script for aurora-starter-cms.
 * Run after schema provisioning. Uses placeholder images for posts.
 *
 * Usage:
 *   AURORA_API_URL=... AURORA_API_KEY=... node scripts/seed.mjs
 */

const apiUrl = process.env.AURORA_API_URL || process.env.NEXT_PUBLIC_AURORA_API_URL;
const apiKey = process.env.AURORA_API_KEY;

if (!apiUrl || !apiKey) {
  console.error("Set AURORA_API_URL and AURORA_API_KEY");
  process.exit(1);
}

const base = apiUrl.replace(/\/$/, "");

function placeholderImage(w, h, text) {
  return `https://placehold.co/${w}x${h}/1e293b/94a3b8?text=${encodeURIComponent(text || "Image")}`;
}

async function createRecord(table, data) {
  const res = await fetch(`${base}/v1/tables/${table}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`${table} create failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function seed() {
  console.log("Seeding aurora-starter-cms...");

  // 1. Categories
  const categories = [
    { name: "Technology", slug: "technology" },
    { name: "Business", slug: "business" },
    { name: "Design", slug: "design" },
  ];
  const createdCats = [];
  for (const c of categories) {
    const rec = await createRecord("categories", c);
    createdCats.push(rec);
    console.log("  Created category:", c.name);
  }

  // 2. Pages
  const pages = [
    { title: "About", slug: "about", content: "<p>We are a content-first platform built with Aurora Studio. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Our mission is to make content management simple and powerful.</p>", status: "published" },
    { title: "Contact", slug: "contact", content: "<p>Get in touch: <a href=\"mailto:hello@example.com\">hello@example.com</a></p>", status: "published" },
  ];
  for (const p of pages) {
    await createRecord("pages", p);
    console.log("  Created page:", p.title);
  }

  // 3. Posts (with placeholder images)
  const techImg = placeholderImage(800, 450, "Technology");
  const businessImg = placeholderImage(800, 450, "Business");
  const designImg = placeholderImage(800, 450, "Design");

  const now = new Date();
  const postSpecs = [
    { title: "Getting Started with Aurora CMS", slug: "getting-started-aurora-cms", excerpt: "Learn how to set up your first content-driven site with Aurora Studio.", content: "<p>Building a blog or content site has never been easier. Aurora Studio gives you the flexibility of a headless CMS with the simplicity of a visual editor.</p><p>In this post we explore the key features and how to get started.</p>", status: "published", published_at: now.toISOString(), category_id: createdCats[0].id, image_url: techImg },
    { title: "10 Tips for Better Content Strategy", slug: "10-tips-content-strategy", excerpt: "Improve your content strategy with these proven tips from industry experts.", content: "<p>Content strategy is essential for any business. Here are ten tips to help you create more effective content.</p>", status: "published", published_at: new Date(now - 86400000).toISOString(), category_id: createdCats[1].id, image_url: businessImg },
    { title: "The Future of Web Design", slug: "future-web-design", excerpt: "Exploring trends and predictions for the next decade of web design.", content: "<p>Web design continues to evolve. From minimalism to bold typography, we explore what's next.</p>", status: "published", published_at: new Date(now - 172800000).toISOString(), category_id: createdCats[2].id, image_url: designImg },
  ];
  for (const p of postSpecs) {
    await createRecord("posts", p);
    console.log("  Created post:", p.title);
  }

  console.log("Seed complete.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
