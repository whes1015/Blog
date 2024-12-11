import { getAllPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">My Blog</h1>

      <div className={`
        grid gap-6
        md:grid-cols-2
      `}
      >
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
