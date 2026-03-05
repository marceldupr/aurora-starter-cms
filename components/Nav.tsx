import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Hippo CMS";
const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL ?? "https://vnawbscpsiwkqniibyya.supabase.co/storage/v1/object/public/placeholders/hippo-cms.png";

async function getCategories() {
  try {
    const client = createAuroraClient();
    const { data } = await client.tables("categories").records.list({ limit: 10 });
    return (data ?? []).map((c) => ({
      name: String(c.name ?? ""),
      slug: String(c.slug ?? c.name ?? "").toLowerCase().replace(/\s+/g, "-"),
    }));
  } catch {
    return [];
  }
}

export async function Nav() {
  const categories = await getCategories();
  return (
    <nav className="sticky top-0 z-50 border-b border-aurora-border bg-aurora-bg/95 backdrop-blur supports-[backdrop-filter]:bg-aurora-bg/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-component p-1 -m-1 ring-2 ring-transparent hover:ring-aurora-accent/30 focus:ring-aurora-accent/50 focus:outline-none transition-all"
            aria-label={`${siteName} home`}
          >
            <img src={logoUrl} alt="" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold hidden sm:inline">{siteName}</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/posts" className="text-sm text-aurora-muted hover:text-white transition-colors">
              Blog
            </Link>
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.slug}
                href={`/posts?category=${c.slug}`}
                className="text-sm text-aurora-muted hover:text-white transition-colors hidden sm:block"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
