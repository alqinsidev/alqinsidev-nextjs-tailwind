import { NextRequest } from 'next/server';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
  Part,
} from '@google/generative-ai';

const MODEL_NAME = process.env.GEMINI_MODEL_NAME || 'gemini-2.0-flash';
const API_KEY = process.env.GENAI_API_KEY || '';

interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: Part[];
}

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
      return new Response('Question is required', { status: 400 });
    }

    const model = await getGenerativeModel();
    const contents = [...(history || []), { role: 'user', parts: [{ text: question }] }];

    const result = await model.generateContentStream({
      systemInstruction,
      contents,
      generationConfig,
      safetySettings,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Gemini streaming API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}