// src/lib/posts.ts
import { createClient } from 'contentful';
import { Document } from '@contentful/rich-text-types';

export interface BlogPostSkeleton {
  contentTypeId: 'blognext',
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: Document;
  }
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

export async function getSortedPostsData() {
  const entries = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blognext',
    order: ['-sys.createdAt'],
  });

  if (entries.items) {
    return entries.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
    }));
  }
  return [];
}

export async function getPostData(slug: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = await client.getEntries<BlogPostSkeleton>({
        content_type: 'blognext',
        'fields.slug': slug,
        limit: 1,
    } as any); 

    if (entries.items && entries.items.length > 0) {
        const post = entries.items[0];
        return {
            id: post.sys.id,
            title: post.fields.title,
            slug: post.fields.slug,
            content: post.fields.content,
        };
    }
    return null;
}

export async function getAllPostSlugs() {
  const entries = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blognext',
    select: ['fields.slug'],
  });

  if (entries.items) {
    return entries.items.map((item) => ({
      slug: item.fields.slug,
    }));
  }
  return [];
}