import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

async function getPosts(category?: string) {
  const client = createAuroraClient();
  const { data } = await client.tables("posts").records.list({
    limit: 50,
    sort: "published_at",
    order: "desc",
  });
  let posts = (data ?? []).filter((p) => String(p.status ?? "") === "published");

  if (category) {
    const { data: cats } = await client.tables("categories").records.list({ limit: 50 });
    const cat = (cats ?? []).find(
      (c) =>
        String(c.slug ?? "").toLowerCase() === category.toLowerCase() ||
        String(c.name ?? "").toLowerCase() === category.toLowerCase()
    );
    if (cat) {
      posts = posts.filter((p) => String(p.category_id ?? "") === String(cat.id));
    }
  }

  return posts;
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let posts: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    posts = await getPosts(category);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load posts";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">
        {category ? `Posts in ${category}` : "Blog"}
      </h1>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <p className="text-aurora-muted">No posts yet.</p>
          <Link href="/" className="text-aurora-accent hover:underline mt-4 inline-block">
            ← Home
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => {
            const slug = String(post.slug ?? post.title ?? post.id ?? "")
              .toLowerCase()
              .replace(/\s+/g, "-");
            const imageUrl = post.image_url ? String(post.image_url) : null;
            const excerpt = String(post.excerpt ?? "").slice(0, 120);
            const publishedAt = post.published_at
              ? new Date(String(post.published_at)).toLocaleDateString()
              : null;

            return (
              <article
                key={String(post.id)}
                className="rounded-container overflow-hidden bg-aurora-surface border border-aurora-border hover:border-aurora-accent/40 transition-colors"
              >
                <Link href={`/posts/${slug}`} className="flex flex-col sm:flex-row">
                  {imageUrl && (
                    <div className="sm:w-48 shrink-0 aspect-video sm:aspect-square bg-aurora-surface-hover">
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 min-w-0">
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-aurora-accent">
                      {String(post.title ?? "")}
                    </h2>
                    {publishedAt && (
                      <p className="text-sm text-aurora-muted flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        {publishedAt}
                      </p>
                    )}
                    {excerpt ? (
                      <p className="text-aurora-muted text-sm">{excerpt}…</p>
                    ) : null}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
