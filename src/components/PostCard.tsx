import Link from 'next/link';

import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className={`
      rounded-lg border p-6 transition-shadow
      hover:shadow-lg
    `}
    >
      <Link
        href={{
          pathname: '/posts',
          query: { slug: post.slug },
        }}
        className="block space-y-3"
      >
        <h2 className={`
          text-2xl font-semibold
          hover:text-blue-600
        `}
        >
          {post.title}
        </h2>
        <time className="text-gray-600">
          {new Date(post.date).toLocaleDateString()}
        </time>
        <p className="text-gray-700">
          {post.excerpt}
        </p>
      </Link>
    </article>
  );
}
