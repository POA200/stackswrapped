import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/layout/Hero";

export function LandingPageLayout() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <Header />

      {/* Hero */}
      <Hero />

      {/* Footer */}
      <Footer />
    </div>
  );
}
