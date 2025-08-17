import { NextResponse } from 'next/server';

const DB_URL = `${process.env.REALTIME_DB_URL}/gemini.json`;

interface Config {
  parts: { input: string; output: string }[];
  api_key: string;
  system_prompts: {
    faq_section: string;
  };
}

export async function GET() {
  try {
    const res = await fetch(DB_URL);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const config: Config = await res.json();
    
    // Remove sensitive data before sending to client
    const { api_key, ...safeConfig } = config;
    
    return NextResponse.json(safeConfig);
  } catch (error) {
    console.error('Config API error:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}