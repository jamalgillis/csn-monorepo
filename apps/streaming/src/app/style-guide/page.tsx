import { Navigation } from "@/components/Navigation";
import { StyleGuideContent } from "@/components/StyleGuideContent";

export const metadata = {
  title: "Style Guide - CSN Design System",
  description: "Comprehensive design system and component patterns for the CSN streaming platform",
};

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="pt-20">
        <StyleGuideContent />
      </main>
    </div>
  );
}