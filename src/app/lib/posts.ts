// src/lib/posts.ts
import { createClient, ContentfulClientApi, Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';

// This is the key change: We define the shape of our content type.
// This provides strong types and autocompletion.
export interface BlogPostSkeleton {
  contentTypeId: 'Blognext',
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: Document; // The type for Rich Text fields
  }
}

const client: ContentfulClientApi = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

// This function will fetch a list of blog posts for the homepage
export async function getSortedPostsData() {
  // We use the skeleton here to tell the client what kind of entries to fetch
  const entries = await client.getEntries<BlogPostSkeleton>({
    content_type: 'Blognext',
    order: '-sys.createdAt',
  });

  if (entries.items) {
    // The 'item' is now strongly typed, no more 'any'!
    return entries.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
    }));
  }
  return [];
}

// This function will fetch a single blog post by its slug
export async function getPostData(slug: string) {
    const entries = await client.getEntries<BlogPostSkeleton>({
        content_type: 'Blognext',
        'fields.slug': slug,
        limit: 1,
    });

    if (entries.items && entries.items.length > 0) {
        // The 'post' variable is now strongly typed
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

// This function fetches only the slugs for all posts
export async function getAllPostSlugs() {
  const entries = await client.getEntries<BlogPostSkeleton>({
    content_type: 'Blognext',
    select: 'fields.slug',
  });

  if (entries.items) {
    // The 'item' is now strongly typed
    return entries.items.map((item) => ({
      slug: item.fields.slug,
    }));
  }
  return [];
}