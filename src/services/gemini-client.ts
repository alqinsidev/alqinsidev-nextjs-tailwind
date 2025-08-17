interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface Config {
  parts: { input: string; output: string }[];
  system_prompts: {
    faq_section: string;
  };
}

const geminiClient = {
  async askGemini(
    history: ChatHistoryItem[],
    question: string,
    systemInstruction?: string
  ): Promise<string> {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history, question, systemInstruction }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Gemini');
    }

    const data = await response.json();
    return data.response;
  },

  async askGeminiStream(
    history: ChatHistoryItem[],
    question: string,
    systemInstruction?: string
  ): Promise<ReadableStream> {
    const response = await fetch('/api/gemini/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history, question, systemInstruction }),
    });

    if (!response.ok) {
      throw new Error('Failed to get streaming response from Gemini');
    }

    return response.body!;
  },

  async getConfig(): Promise<Config> {
    const response = await fetch('/api/gemini/config');
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    return response.json();
  },
};

export default geminiClient;