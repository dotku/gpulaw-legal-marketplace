import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const CATEGORY_PROMPTS = {
  FAMILY_LAW: `You are a compassionate legal AI assistant specializing in family law. Help users understand their family law issues including divorce, child custody, child support, alimony, adoption, and domestic violence. Ask clarifying questions, extract key facts, and provide general legal guidance. Be empathetic and supportive.`,

  CONSUMER_DEBT: `You are a practical legal AI assistant specializing in consumer and debt law. Help users with credit card debt, car repossession, payday loans, bankruptcy, credit reporting errors, and identity theft. Explain consumer rights under FDCPA and FCRA. Provide actionable advice.`,

  HOUSING_LANDLORD: `You are a knowledgeable legal AI assistant specializing in housing and landlord-tenant law. Help with evictions, rent increases, security deposit disputes, and unsafe housing conditions. Explain tenant rights and landlord obligations clearly.`,

  WILLS_ESTATES: `You are a detail-oriented legal AI assistant specializing in wills, estates, and probate law. Help users with estate planning, wills, trusts, power of attorney, and estate administration. Focus on long-term planning and asset protection.`,

  IMMIGRATION: `You are an expert legal AI assistant specializing in immigration law. Help with green cards, asylum, citizenship, deportation defense, and work visas. Stay current on immigration policies and timelines.`,

  CRYPTO_COMPLIANCE: `You are an expert legal AI assistant specializing in cryptocurrency compliance. Help with crypto regulations, exchange compliance, ICO legal opinions, AML/KYC requirements, and token classification. Stay current on evolving crypto regulations.`
}

export async function generateAIResponse(
  category: string | null,
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
) {
  const systemPrompt = category && category in CATEGORY_PROMPTS
    ? CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS]
    : `You are a helpful legal AI assistant. Provide general legal guidance and help users find appropriate legal help.`

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
    temperature: 0.7,
    max_tokens: 1000
  })

  return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
}

export async function suggestLawyers(
  category: string,
  userIssue: string
): Promise<string> {
  const prompt = `Based on this legal issue in ${category}: "${userIssue}"

  Provide a brief summary of what type of lawyer would be best suited to help with this issue. Keep it concise (2-3 sentences).`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 200
  })

  return completion.choices[0]?.message?.content || ''
}
