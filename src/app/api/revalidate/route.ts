// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next-cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // 1. Check for a secret to ensure this is a legit request
  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  const body = await request.json()
  const contentType = body.sys?.contentType?.sys?.id
  const slug = body.fields?.slug?.['en-US'] // Adjust 'en-US' if you use a different locale

  // 2. Revalidate the specific post and the home page
  try {
    if (contentType === 'Blognext' && slug) {
      revalidatePath('/')
      revalidatePath(`/posts/${slug}`)
      return NextResponse.json({ revalidated: true })
    } else {
       // Also revalidate the homepage for general updates
       revalidatePath('/')
       return NextResponse.json({ revalidated: true, message: "Homepage revalidated" })
    }
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating'}, { status: 500 })
  }
}