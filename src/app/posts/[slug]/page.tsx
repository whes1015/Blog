import MarkdownIt from 'markdown-it';
import { notFound } from 'next/navigation';

import { getAllPosts, getPostContent } from '@/lib/api';

import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function isString(value: unknown): value is string {
  return typeof value === 'string';
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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  try {
    const params = await props.params;
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === params.slug);

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
  catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the post.',
    };
  }
}

export default async function PostPage(props: PageProps) {
  try {
    const params = await props.params;
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) {
      notFound();
    }

    const content = await getPostContent(params.slug);

    if (!content) {
      notFound();
    }

    const htmlContent = md.render(content);

    if (!isString(htmlContent)) {
      throw new Error('Markdown rendering failed');
    }

    return (
      <article className="prose prose-lg max-w-none">
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
        <time className="mb-8 block text-gray-600">
          {new Date(post.date).toLocaleDateString()}
        </time>
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    );
  }
  catch (error) {
    console.error('Error rendering post:', error);
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Post</h1>
        <p className="mt-4">Sorry, there was an error loading this post.</p>
      </div>
    );
  }
}
