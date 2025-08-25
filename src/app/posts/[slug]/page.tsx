// src/app/posts/[slug]/page.tsx
import {  getPostData, getAllPostSlugs } from '../../lib/posts';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';

export async function generateStaticParams() {
  const allSlugs = await getAllPostSlugs();
  return allSlugs;
}

// Define the type for the page's props, which includes the slug parameter
type PostPageProps = {
  params: {
    slug: string;
  };
};

// This is an async component that receives params from the URL
export default async function Post({ params }: PostPageProps) {
  const postData = await getPostData(params.slug);

  // If no post is found for the slug, show a 404 page
  if (!postData) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <article className="prose lg:prose-xl max-w-none">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">{postData.title}</h1>
        
        {/* Render the rich text content safely using the library */}
        <div>
          {documentToReactComponents(postData.content as Document)}
        </div>
      </article>
    </main>
  );
}