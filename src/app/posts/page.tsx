'use client';

import { Suspense } from 'react';

import PostPageClient from './client';

export default function PostPage() {
  return (
    <Suspense fallback={(
      <div className="flex min-h-screen flex-col">
        <div className={`
          container mx-auto flex flex-1 items-center justify-center px-4 py-8
        `}
        >
          <div className="text-center">載入中...</div>
        </div>
      </div>
    )}
    >
      <PostPageClient />
    </Suspense>
  );
}
