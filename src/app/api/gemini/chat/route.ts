import { NextRequest, NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
  Part,
} from '@google/generative-ai';

const MODEL_NAME = process.env.GEMINI_MODEL_NAME || 'gemini-2.0-flash';
const API_KEY = process.env.GENAI_API_KEY || '';

const generationConfig = {
  temperature: 0.05,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

async function getGenerativeModel(): Promise<GenerativeModel> {
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({ model: MODEL_NAME });
}

export async function POST(request: NextRequest) {
  try {
    const { history, question, systemInstruction } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const model = await getGenerativeModel();
    const contents = [...(history || []), { role: 'user', parts: [{ text: question }] }];

    const result = await model.generateContent({
      systemInstruction,
      contents,
      generationConfig,
      safetySettings,
    });

    const response = result.response.candidates?.[0].content.parts[0].text || 'I worried I cannot answer that.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}