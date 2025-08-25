// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
// CORRECT IMPORT: revalidatePath comes from 'next/cache'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  // 1. Get the secret from the query parameters
  const secret = request.nextUrl.searchParams.get('secret')

  // 2. Check if the secret matches the one in your environment variables
  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    // If it doesn't match, return an unauthorized error
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  // 3. Parse the request body sent by Contentful's webhook
  const body = await request.json()
  const contentType = body.sys?.contentType?.sys?.id
  
  // Note: Adjust 'en-US' if you use a different default locale in Contentful
  const slug = body.fields?.slug?.['en-US'] 

  // 4. Use a try/catch block to handle potential errors
  try {
    // Check if the webhook was for a 'Blognext' entry and has a slug
    if (contentType === 'Blognext' && slug) {
      // Revalidate the home page to show the new post in the list
      revalidatePath('/')
      // Revalidate the specific post page itself
      revalidatePath(`/posts/${slug}`)
      
      console.log(`Revalidated: / and /posts/${slug}`)
      return NextResponse.json({ revalidated: true })
    } else {
       // If it's another content type or action, just revalidate the homepage
       revalidatePath('/')
       console.log(`Revalidated: /`)
       return NextResponse.json({ revalidated: true, message: "Homepage revalidated" })
    }
  } catch (err) {
    // If there's an error during revalidation, return a server error
    return NextResponse.json({ message: 'Error revalidating'}, { status: 500 })
  }
}