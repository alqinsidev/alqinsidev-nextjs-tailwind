import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai'

interface Config {
  parts: {
    input:string,
    output: string
  }[],
  api_key:string
}

const MODEL_NAME = 'gemini-pro'

const geminiService = {
  getConfig: async function (): Promise<Config> {
    const res = await fetch(`https://alqinsidev-project-default-rtdb.asia-southeast1.firebasedatabase.app/gemini.json`)
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  },
  askGemini: async function (question: string, feParts: string[]) {
    const config =  await this.getConfig()
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GENAI_API_KEY || config.api_key)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    const generationConfig = {
      temperature: 0.05,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    }

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ]

    const sourceParts = await config.parts
    const preDefinedParts = sourceParts.flatMap((a:{input:string,output:string})=>{
      return [{text: `input: ${a.input}`}, {text: `output: ${a.output}`}]
    })

    const extractedFeParts = feParts.map((text:string, idx:number)=> {
      if (idx % 2 === 0 || idx == 0){
        return {text:`input: ${text}`}
      }
      return {text: `output: ${text}`}
    })
    
    
    const parts = [
      ...preDefinedParts,
      ...extractedFeParts,
      { text: `input: ${question}` },
      { text: 'output: ' },
    ]

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig,
      safetySettings,
    })

    const response =
      result.response.candidates?.[0].content.parts[0].text ||
      'I worried I cannot answer that.'

    return response
  },
}

export default geminiService
