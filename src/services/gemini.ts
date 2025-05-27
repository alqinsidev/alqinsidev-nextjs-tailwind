import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

interface Config {
  parts: { input: string; output: string }[];
  api_key: string;
}

const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || 'gemini-2.0-flash-exp';
const API_KEY = process.env.NEXT_PUBLIC_GENAI_API_KEY || '';
const DB_URL = `${process.env.NEXT_PUBLIC_REALTIME_DB_URL}/gemini.json`;

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

async function getConfig(): Promise<Config> {
  const res = await fetch(DB_URL);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

function formatParts(sourceParts: { input: string; output: string }[], feParts: string[], question: string) {
  const preDefinedParts = sourceParts.flatMap(({ input, output }) => [
    { text: `input: ${input}` },
    { text: `output: ${output}` },
  ]);

  const extractedFeParts = feParts.map((text, idx) => ({
    text: `${idx % 2 === 0 ? 'input' : 'output'}: ${text}`,
  }));

  return [...preDefinedParts, ...extractedFeParts, { text: `input: ${question}` }, { text: 'output: ' }];
}

async function generateResponse(question: string, feParts: string[]) {
  const config = await getConfig();
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const parts = formatParts(config.parts, feParts, question);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig,
    safetySettings,
  });

  return result.response.candidates?.[0].content.parts[0].text || 'I worried I cannot answer that.';
}

async function generateResponseStream(question: string, feParts: string[]) {
  const config = await getConfig();
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const parts = formatParts(config.parts, feParts, question);

  return model.generateContentStream({
    systemInstruction:"You are padlan personal assistant that can speak english or bahasa indonesia based on user input. Give your answer using markdown format. Answer user question based on the data, Always give a suggestion by giving 1 or 2 follow up question on the end of your answer to living the conversation. Also use emoticon to give a humble persona",
    contents: [{ role: 'user', parts }],
    generationConfig,
    safetySettings,
  });
}

const geminiService = {
  getConfig,
  askGemini: (question: string, feParts: string[]) => generateResponse(question, feParts),
  askGeminiStream: (question: string, feParts: string[]) => generateResponseStream(question, feParts),
};

export default geminiService;
