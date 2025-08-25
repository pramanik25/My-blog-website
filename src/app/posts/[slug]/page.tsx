// src/app/posts/[slug]/page.tsx
import { getPostData, getAllPostSlugs } from '../../../lib/posts';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import Image from 'next/image'; // Import the Image component

export async function generateStaticParams() {
  const allSlugs = await getAllPostSlugs();
  return allSlugs;
}

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default async function Post({ params }: PostPageProps) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <article className="prose lg:prose-xl max-w-none">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">{postData.title}</h1>
        
        {postData.coverImage && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
             <Image
                src={postData.coverImage.url}
                alt={postData.coverImage.alt}
                fill
                style={{ objectFit: 'cover' }}
                priority // Tells Next.js to load this image first
              />
          </div>
        )}
        
        <div>
          {documentToReactComponents(postData.content as Document)}
        </div>
      </article>
    </main>
  );
}