import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Padlan Alqinsi's portfolio, showcasing a diverse range of software engineering projects and skills.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
