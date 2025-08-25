// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  const body = await request.json()
  const contentType = body.sys?.contentType?.sys?.id
  const slug = body.fields?.slug?.['en-US']

  try {
    if (contentType === 'Blognext' && slug) {
      revalidatePath('/')
      revalidatePath(`/posts/${slug}`)
      return NextResponse.json({ revalidated: true })
    } else {
       revalidatePath('/')
       return NextResponse.json({ revalidated: true, message: "Homepage revalidated" })
    }
  } catch (err) {
    // The fix is here: We now log the error to the console.
    console.error('Error revalidating:', err)
    return NextResponse.json({ message: 'Error revalidating'}, { status: 500 })
  }
}