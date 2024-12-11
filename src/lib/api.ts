import { Post } from '@/types/post';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://raw.githubusercontent.com/whes1015/whes1015/main/public'
  : 'http://localhost:3000';

export async function getAllPosts(): Promise<Post[]> {
  try {
    const url = new URL('/blogs/index.json', BASE_URL);
    const response = await fetch(url, {
      ...(process.env.NODE_ENV === 'production'
        ? { next: { revalidate: 3600 } }
        : {}),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts index: ${response.statusText}`);
    }

    const posts = await response.json() as Post[];
    return posts.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }
  catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostContent(slug: string): Promise<string | null> {
  try {
    const url = new URL(`/blogs/${slug}.md`, BASE_URL);
    const response = await fetch(url, {
      ...(process.env.NODE_ENV === 'production'
        ? { next: { revalidate: 3600 } }
        : {}),
    });

    if (!response.ok) {
      console.error(`Failed to fetch post content: ${response.statusText}`);
      return null;
    }

    return await response.text();
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching post content:', error.message);
    }
    return null;
  }
}
