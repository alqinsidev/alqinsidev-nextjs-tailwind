'use client';

import React, { useEffect, useState } from 'react';
import PersonalBotSection from './components/personalBotSection';
import CustomFaqSection from './components/customFaqSection';
import geminiService from '@/services/gemini';

interface GeminiConfig {
  parts: { input: string; output: string }[];
  api_key: string;
  system_prompts: {
    faq_section: string;
  };
}

const PlaygroundPage = () => {
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await geminiService.getConfig();
        setGeminiConfig(config);
      } catch (err) {
        setError('Failed to load Gemini configuration.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center bg-sky-50'>
        <div className="animate-spin delay-1000 rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className='flex min-h-screen w-full items-center justify-center bg-sky-50 text-red-500'>{error}</div>;
  }

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-sky-50 pt-20 lg:pt-10'>
      <PersonalBotSection geminiConfig={geminiConfig} />
      <CustomFaqSection geminiConfig={geminiConfig} />
    </div>
  );
};

export default PlaygroundPage
