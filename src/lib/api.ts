import { Post } from '@/types/post';

const isProduction = process.env.NODE_ENV === 'production';
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/whes1015/whes1015/main/public';

const baseUrl = isProduction
  ? `${GITHUB_RAW_URL}/blogs`
  : `http://localhost:3000/blogs`;

export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${baseUrl}/index.json`);
    const posts = await response.json() as Post[];
    return posts;
  }
  catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return null;
    }

    const contentResponse = await fetch(`${baseUrl}/${slug}.md`);
    const content = await contentResponse.text();

    return {
      ...post,
      content,
    };
  }
  catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}
