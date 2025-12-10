import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";

export function LandingPageLayout() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Footer */}
      <Footer />
    </div>
  );
}
