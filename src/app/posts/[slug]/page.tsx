import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAllPosts, getPostContent } from '@/lib/api';

import { PostContent } from './client';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  }
  catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata(
  props: PostPageProps,
): Promise<Metadata> {
  const { params } = props;
  const { slug } = await params;

  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage(props: PostPageProps) {
  try {
    const { params } = props;
    const { slug } = await params;

    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      notFound();
    }

    const content = await getPostContent(slug);

    if (!content) {
      notFound();
    }

    return (
      <PostContent
        content={content}
        title={post.title}
        date={post.date}
      />
    );
  }
  catch (error) {
    console.log(error);
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Post</h1>
        <p className="mt-4">Sorry, there was an error loading this post.</p>
      </div>
    );
  }
}
