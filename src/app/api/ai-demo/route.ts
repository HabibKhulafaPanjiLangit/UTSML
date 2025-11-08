import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { capability, prompt, query, size } = await request.json()

    if (!capability) {
      return NextResponse.json(
        { error: 'Capability is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    let result

    switch (capability) {
      case 'text-generation':
        result = await performTextGeneration(prompt, zai)
        break
      case 'image-generation':
        result = await performImageGeneration(prompt, size, zai)
        break
      case 'web-search':
        result = await performWebSearch(query, zai)
        break
      case 'data-analysis':
        result = await performDataAnalysis(prompt, zai)
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

async function performTextGeneration(prompt: string, zai: any) {
  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI assistant. Provide creative and informative responses.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  })

  return {
    content: completion.choices[0]?.message?.content || 'No response generated.'
  }
}

async function performImageGeneration(prompt: string, size: string, zai: any) {
  const response = await zai.images.generations.create({
    prompt: prompt,
    size: size || '1024x1024'
  })

  return {
    image: response.data[0]?.base64 || ''
  }
}

async function performWebSearch(query: string, zai: any) {
  const searchResult = await zai.functions.invoke("web_search", {
    query: query,
    num: 10
  })

  return {
    results: searchResult || []
  }
}

async function performDataAnalysis(prompt: string, zai: any) {
  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a data analysis expert. Provide detailed analysis and insights based on the given request.'
      },
      {
        role: 'user',
        content: `Please provide a comprehensive data analysis for the following request: ${prompt}`
      }
    ],
    temperature: 0.3,
    max_tokens: 800
  })

  return {
    analysis: completion.choices[0]?.message?.content || 'No analysis generated.'
  }
}