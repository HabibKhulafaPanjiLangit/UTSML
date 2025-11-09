

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { capability } = await request.json()

    if (!capability) {
      return NextResponse.json(
        { error: 'Capability is required' },
        { status: 400 }
      )
    }

    let result
    switch (capability) {
      case 'text-generation':
        result = { content: 'Fitur text-generation tidak tersedia.' }
        break
      case 'image-generation':
        result = { image: '' }
        break
      case 'web-search':
        result = { results: [] }
        break
      case 'data-analysis':
        result = { content: 'Fitur data-analysis tidak tersedia.' }
        break
      default:
        return NextResponse.json(
          { error: 'Unsupported capability' },
          { status: 400 }
        )
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Demo API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}