"use client";

import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary bg-primary/2 backdrop-blur-lg p-2 sm:p-3 md:p-4">
      <div className="container mx-auto flex h-16 items-center justify-center">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center">
            <Image
              src="/Logo.webp"
              alt="Stacks Wrapped Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <h1 className="text-lg md:text-2xl font-regular text-primary">
            Stacks <span className="text-primary/30">Wrapped</span>
          </h1>
        </div>
      </div>
    </header>
  );
}
