# Aurora Starter — CMS

A WordPress-style content management demo: blog, pages and categories. Powered by [Aurora Studio](https://github.com/marceldupr/aurora-studio).

## Features

- **Home** — Latest posts with featured images
- **Blog** — Post listing with category filter
- **Post detail** — Full article with excerpt, image, content
- **Pages** — Static pages (About, Contact)
- **Categories** — In nav and post filtering
- **Holmes** — AI-ready (script included when configured)

## Setup

1. Clone and install: `pnpm install`
2. Copy `.env.example` to `.env.local`
3. Set `AURORA_API_URL`, `AURORA_API_KEY`, `NEXT_PUBLIC_TENANT_SLUG`
4. Provision schema: `pnpm schema:provision`
5. (Optional) Seed: `pnpm seed`
6. Run: `pnpm dev`

## Tables

- **categories** — name, slug
- **pages** — title, slug, content, status (draft/published)
- **posts** — title, slug, excerpt, image_url, content, status, published_at, category
- **media** — name, url, type, size

## Workflows

- `post.published` → notify owners
