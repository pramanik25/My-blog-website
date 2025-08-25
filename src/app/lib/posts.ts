// src/lib/posts.ts
import { createClient, ContentfulClientApi } from 'contentful';

const client: ContentfulClientApi<undefined> = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

// Define a type for our blog post items
export interface blognext {
  title: string;
  slug: string;
  excerpt: string;
  // You might need to define types for the cover image and content as well
  // For now, we'll keep it simple
}

// This function will fetch a list of blog posts for the homepage
export async function getSortedPostsData() {
  const entries = await client.getEntries({
    content_type: 'blognext', // This is the API identifier of your content model
    order: '-sys.createdAt', // Order by creation date, newest first
  });

  if (entries.items) {
    return entries.items.map((item: any) => ({
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
    const entries = await client.getEntries({
        content_type: 'blognext',
        'fields.slug': slug,
        limit: 1,
    });

    if (entries.items && entries.items.length > 0) {
        const post: any = entries.items[0];
        return {
            id: post.sys.id,
            title: post.fields.title,
            slug: post.fields.slug,
            content: post.fields.content, // This will be the Rich Text object
        };
    }
    return null;
}

export async function getAllPostSlugs() {
  const entries = await client.getEntries({
    content_type: 'Blognext', // Make sure this is your Content Type ID
    select: 'fields.slug',   // We only select the slug field
  });

  if (entries.items) {
    return entries.items.map((item: any) => ({
      slug: item.fields.slug,
    }));
  }
  return [];
}