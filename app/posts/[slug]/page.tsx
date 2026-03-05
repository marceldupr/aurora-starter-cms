import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuroraClient } from "@/lib/aurora";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

async function getPostBySlug(slug: string) {
  const client = createAuroraClient();
  const { data } = await client.tables("posts").records.list({
    limit: 100,
    sort: "published_at",
    order: "desc",
  });
  const posts = (data ?? []).filter((p) => String(p.status ?? "") === "published");
  const normalized = slug.toLowerCase().replace(/\s+/g, "-");
  return posts.find(
    (p) =>
      String(p.slug ?? "").toLowerCase().replace(/\s+/g, "-") === normalized ||
      String(p.title ?? "").toLowerCase().replace(/\s+/g, "-") === normalized
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: Record<string, unknown> | undefined;

  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const title = String(post.title ?? "");
  const content = String(post.content ?? "");
  const imageUrl = post.image_url ? String(post.image_url) : null;
  const publishedAt = post.published_at
    ? new Date(String(post.published_at)).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/posts" className="text-aurora-muted hover:text-white text-sm mb-8 inline-block">
        ← Back to blog
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
        {publishedAt && (
          <p className="text-aurora-muted flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {publishedAt}
          </p>
        )}
      </header>

      {imageUrl && (
        <div className="rounded-container overflow-hidden mb-8 aspect-video">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className="prose prose-invert prose-lg max-w-none
          prose-p:text-aurora-muted prose-p:leading-relaxed
          prose-headings:text-white prose-a:text-aurora-accent"
        dangerouslySetInnerHTML={{ __html: content || `<p>${post.excerpt ?? ""}</p>` }}
      />
    </article>
  );
}
