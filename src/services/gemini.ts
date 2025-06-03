import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
  GenerateContentStreamResult,
  Part,
} from '@google/generative-ai';

const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || 'gemini-2.0-flash-exp';
const API_KEY = process.env.NEXT_PUBLIC_GENAI_API_KEY || '';
const DB_URL = `${process.env.NEXT_PUBLIC_REALTIME_DB_URL}/gemini.json`; // Re-add DB_URL

interface Config {
  parts: { input: string; output: string }[];
  api_key: string;
}

interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: Part[];
}

async function getConfig(): Promise<Config> { // Re-add getConfig
  const res = await fetch(DB_URL);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
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

async function generateResponse(
  history: ChatHistoryItem[],
  question: string,
  systemInstruction?: string
): Promise<string> {
  const model = await getGenerativeModel();
  const contents = [...history, { role: 'user', parts: [{ text: question }] }];

  const result = await model.generateContent({
    systemInstruction,
    contents,
    generationConfig,
    safetySettings,
  });

  return result.response.candidates?.[0].content.parts[0].text || 'I worried I cannot answer that.';
}

async function generateResponseStream(
  history: ChatHistoryItem[],
  question: string,
  systemInstruction?: string
): Promise<GenerateContentStreamResult> {
  const model = await getGenerativeModel();
  const contents = [...history, { role: 'user', parts: [{ text: question }] }];

  return model.generateContentStream({
    systemInstruction,
    contents,
    generationConfig,
    safetySettings,
  });
}

const geminiService = {
  getConfig, // Export getConfig
  askGemini: (history: ChatHistoryItem[], question: string, systemInstruction?: string) =>
    generateResponse(history, question, systemInstruction),
  askGeminiStream: (history: ChatHistoryItem[], question: string, systemInstruction?: string) =>
    generateResponseStream(history, question, systemInstruction),
};

export default geminiService;
