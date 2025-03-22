import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'About Me',
    description: 'Learn more about Padlan Alqinsi, his background, skills, and experience as a software engineer.',
  };

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
