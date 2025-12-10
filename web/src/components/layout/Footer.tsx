"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary bg-background">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} Stacks Wrapped. All rights reserved.{" "}
          <a
            href="https://x.com/Stacks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-medium hover:text-orange-600/80 transition-colors cursor-pointer"
          >
            Built on Stacks
          </a>{" "}
          <a
            href="https://x.com/iPeter_crx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 font-medium hover:text-primary/100 transition-colors cursor-pointer"
          >
            by iPeter
          </a>
        </p>
      </div>
    </footer>
  );
}
