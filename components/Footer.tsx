import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Hippo CMS";

async function getPages() {
  try {
    const client = createAuroraClient();
    const { data } = await client.tables("pages").records.list({
      limit: 10,
      sort: "title",
    });
    return (data ?? [])
      .filter((p) => String(p.status ?? "") === "published")
      .map((p) => ({
        title: String(p.title ?? ""),
        slug: String(p.slug ?? p.title ?? "").toLowerCase().replace(/\s+/g, "-"),
      }));
  } catch {
    return [];
  }
}

export async function Footer() {
  const pages = await getPages();
  return (
    <footer className="border-t border-aurora-border mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <p className="text-lg font-semibold mb-3">{siteName}</p>
            <p className="text-aurora-muted text-sm">
              Content management powered by Aurora Studio.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Pages</h3>
            <ul className="space-y-2 text-sm text-aurora-muted">
              {pages.map((p) => (
                <li key={p.slug}>
                  <Link href={`/page/${p.slug}`} className="hover:text-white">
                    {p.title}
                  </Link>
                </li>
              ))}
              {pages.length === 0 ? (
                <li>
                  <Link href="/posts" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
