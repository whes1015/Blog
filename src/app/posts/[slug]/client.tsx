'use client';

import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

interface PostContentProps {
  content: string;
  title: string;
  date: string;
}

export function PostContent({ content, title, date }: PostContentProps) {
  const htmlContent = md.render(content);

  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      <time className="mb-8 block text-gray-600">
        {new Date(date).toLocaleDateString()}
      </time>
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
