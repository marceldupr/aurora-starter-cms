import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

async function getPages() {
  const client = createAuroraClient();
  const { data } = await client.tables("pages").records.list({
    limit: 50,
    sort: "title",
  });
  return (data ?? []).filter((p) => String(p.status ?? "") === "published");
}

export default async function PagesIndexPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL &&
    process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/pages`
      : null;

  let pages: Record<string, unknown>[] = [];
  try {
    pages = await getPages();
  } catch {
    /* show empty */
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Pages</h1>

      {pages.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <FileText className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No published pages</p>
          <p className="text-sm text-aurora-muted mb-6">
            Add and publish pages in Aurora Studio.
          </p>
          {studioUrl && (
            <a
              href={studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
            >
              Add in Aurora Studio →
            </a>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {pages.map((p) => {
            const slug = String(p.slug ?? p.title ?? "")
              .toLowerCase()
              .replace(/\s+/g, "-");
            return (
              <li key={String(p.id)}>
                <Link
                  href={`/page/${slug}`}
                  className="flex items-center gap-3 py-3 px-4 rounded-component bg-aurora-surface border border-aurora-border hover:border-aurora-accent/40 transition-colors"
                >
                  <FileText className="w-5 h-5 text-aurora-accent shrink-0" />
                  <span className="font-medium">{String(p.title ?? "")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
