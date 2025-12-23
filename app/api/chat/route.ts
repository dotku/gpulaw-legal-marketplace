import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse, suggestLawyers } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { message, category, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const aiResponse = await generateAIResponse(
      category,
      message,
      conversationHistory || []
    )

    // Optionally suggest lawyers if the conversation seems ready
    let lawyerSuggestion = null
    if (category && conversationHistory && conversationHistory.length >= 4) {
      lawyerSuggestion = await suggestLawyers(category, message)
    }

    return NextResponse.json({
      response: aiResponse,
      lawyerSuggestion,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
