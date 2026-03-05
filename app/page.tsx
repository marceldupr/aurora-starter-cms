import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

async function getLatestPosts() {
  const client = createAuroraClient();
  const { data } = await client.tables("posts").records.list({
    limit: 6,
    sort: "published_at",
    order: "desc",
  });
  return (data ?? []).filter((p) => String(p.status ?? "") === "published");
}

export default async function HomePage() {
  let posts: Record<string, unknown>[] = [];
  try {
    posts = await getLatestPosts();
  } catch {
    /* show empty */
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Welcome to the blog
        </h1>
        <p className="text-aurora-muted text-lg max-w-2xl mx-auto">
          Stories, ideas, and updates. Powered by Aurora Studio.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <p className="text-aurora-muted mb-2">No posts yet</p>
          <p className="text-sm text-aurora-muted">
            Add published posts in Aurora Studio or run the seed script.
          </p>
          <Link
            href="/posts"
            className="inline-block mt-4 px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
          >
            View blog
          </Link>
        </div>
      ) : (
        <section className="space-y-12">
          <h2 className="text-xl font-semibold text-aurora-muted">Latest posts</h2>
          <div className="grid gap-8">
            {posts.map((post) => {
              const slug = String(post.slug ?? post.title ?? post.id ?? "")
                .toLowerCase()
                .replace(/\s+/g, "-");
              const imageUrl = post.image_url ? String(post.image_url) : null;
              const excerpt = String(post.excerpt ?? "").slice(0, 160);
              const publishedAt = post.published_at
                ? new Date(String(post.published_at)).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : null;

              return (
                <article
                  key={String(post.id)}
                  className="rounded-container overflow-hidden bg-aurora-surface border border-aurora-border hover:border-aurora-accent/40 transition-colors"
                >
                  <Link href={`/posts/${slug}`} className="block">
                    {imageUrl && (
                      <div className="aspect-video bg-aurora-surface-hover">
                        <img
                          src={imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-aurora-accent">
                        {String(post.title ?? "")}
                      </h3>
                      {publishedAt && (
                        <p className="text-sm text-aurora-muted flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4" />
                          {publishedAt}
                        </p>
                      )}
                      {excerpt ? (
                        <p className="text-aurora-muted leading-relaxed">{excerpt}…</p>
                      ) : null}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
          <div className="flex justify-center pt-4">
            <Link
              href="/posts"
              className="px-6 py-3 rounded-component border border-aurora-border hover:bg-aurora-surface font-semibold"
            >
              View all posts
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
