// src/app/posts/[slug]/client.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPostBySlug } from '@/lib/api';
import { Post } from '@/types/post';

function LoadingState() {
  return (
    <div className={`
      container mx-auto flex flex-1 items-center justify-center px-4 py-8
    `}
    >
      <div className="text-center">載入中...</div>
    </div>
  );
}

function PostContent({ content, title, date }: {
  content: string;
  title: string;
  date: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <time className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </time>
      </CardHeader>

      <CardContent className={`
        prose prose-lg max-w-none
        dark:prose-invert
      `}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          className="markdown-body"
        >
          {content}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}

export default function PostPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 如果沒有 slug，重定向到首頁
    if (!slug) {
      router.push('/');
      return;
    }

    // 獲取文章數據
    async function fetchPost() {
      try {
        const postData = await getPostBySlug(slug);

        if (!postData) {
          router.push('/');
          return;
        }

        setPost(postData);
      }
      catch (error) {
        console.error('Error fetching post:', error);
        router.push('/');
      }
      finally {
        setLoading(false);
      }
    }

    void fetchPost();
  }, [slug, router]);

  if (!mounted || loading) {
    return <LoadingState />;
  }

  if (!post) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col gap-4">
      <main className="container mx-auto min-h-svh flex-1 px-4 py-8">
        <div className={`
          grid grid-cols-1 gap-4
          lg:grid-cols-4
        `}
        >
          {/* Sidebar */}
          <div className={`
            space-y-4
            lg:col-span-1
          `}
          >
            <Card>
              <CardHeader>
                <CardTitle>文章資訊</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    發布日期：
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <PostContent
              content={post.content || ''}
              title={post.title}
              date={post.date}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
