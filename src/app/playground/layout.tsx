import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Playground',
    description: 'Engage with Padlan Alqinsi\'s AI-powered chatbot, built using Gemini Models, and explore a dynamic conversational experience.',
  };

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
