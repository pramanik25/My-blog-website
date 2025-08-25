// src/app/page.tsx
import { getSortedPostsData } from '../app/lib/posts';
import Link from 'next/link';

// The Home component is now an async function
export default async function Home() {
  // We await the data from Contentful
  const allPostsData = await getSortedPostsData();

  return (
    <main className="container mx-auto p-4 md:p-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">My Awesome Blog</h1>
        <p className="text-lg text-gray-600 mt-2">Powered by Next.js and Contentful</p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 border-b pb-4">Latest Posts</h2>
        <div className="grid gap-8">
          {allPostsData.map(({ id, title, slug, excerpt }) => (
            <div key={id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">
                {/* The Link now points to the correct slug-based URL */}
                <Link href={`/posts/${slug}`} className="text-blue-700 hover:underline">
                  {title}
                </Link>
              </h3>
              <p className="text-gray-700 mb-4">{excerpt}</p>
              <Link href={`/posts/${slug}`} className="text-blue-600 font-semibold hover:text-blue-800">
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}