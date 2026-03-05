import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuroraClient } from "@/lib/aurora";

export const dynamic = "force-dynamic";

async function getPageBySlug(slug: string) {
  const client = createAuroraClient();
  const { data } = await client.tables("pages").records.list({
    limit: 100,
    sort: "title",
  });
  const pages = (data ?? []).filter((p) => String(p.status ?? "") === "published");
  const normalized = slug.toLowerCase().replace(/\s+/g, "-");
  return pages.find(
    (p) =>
      String(p.slug ?? "").toLowerCase().replace(/\s+/g, "-") === normalized ||
      String(p.title ?? "").toLowerCase().replace(/\s+/g, "-") === normalized
  );
}

export default async function PageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page: Record<string, unknown> | undefined;

  try {
    page = await getPageBySlug(slug);
  } catch {
    notFound();
  }

  if (!page) notFound();

  const title = String(page.title ?? "");
  const content = String(page.content ?? "");

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="text-aurora-muted hover:text-white text-sm mb-8 inline-block">
        ← Home
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
      </header>

      <div
        className="prose prose-invert prose-lg max-w-none
          prose-p:text-aurora-muted prose-p:leading-relaxed
          prose-headings:text-white prose-a:text-aurora-accent"
        dangerouslySetInnerHTML={{ __html: content || "<p>No content.</p>" }}
      />
    </article>
  );
}
