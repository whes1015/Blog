import { readFileSync } from 'fs';
import { join } from 'path';

export function getAllPosts() {
  try {
    const postsDirectory = join(process.cwd(), 'public', 'blogs');
    const indexPath = join(postsDirectory, 'index.json');
    const fileContents = readFileSync(indexPath, 'utf8');
    return JSON.parse(fileContents);
  }
  catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}
