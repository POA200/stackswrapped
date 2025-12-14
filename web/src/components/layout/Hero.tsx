"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StacksConnectButton } from "@/components/connectors/StacksConnectButton";
import { UserSession, AppConfig } from "@stacks/connect";
// Use the same appConfig as in StacksConnectButton
const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export function Hero() {
  const [walletAddress, setWalletAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const router = useRouter();

  // Simple Stacks address validation (SP or SM, 39-41 chars, base58)
  const isValidStacksAddress = (address: string) => {
    return /^S[PM][A-Za-z0-9]{38,40}$/.test(address.trim());
  };

  const handleViewWrap = () => {
    const address = walletAddress.trim();
    if (!address) {
      setAddressError("Please enter a Stacks address.");
      return;
    }
    if (!isValidStacksAddress(address)) {
      setAddressError("Invalid Stacks address. Please check and try again.");
      return;
    }
    setAddressError("");
    router.push(`/wrap/loading?address=${encodeURIComponent(address)}`);
  };

  const [isWalletConnected, setIsWalletConnected] = useState(
    userSession.isUserSignedIn()
  );

  // Keep wallet connection state in sync (in case of sign in/out elsewhere)
  // This effect will run only on mount
  useState(() => {
    setIsWalletConnected(userSession.isUserSignedIn());
  });

  return (
    <>
      {/* Background Stickers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/HeroSticker1.webp"
          alt=""
          width={84}
          height={84}
          priority={false}
          className="absolute top-[15%] left-[5%] sm:top-40 sm:left-40 w-16 md:w-48 h-auto animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Image
          src="/HeroSticker2.webp"
          alt=""
          width={84}
          height={84}
          priority={false}
          className="absolute bottom-[20%] left-[10%] sm:bottom-60 sm:left-50 w-16 sm:w-20 h-16 sm:h-20 animate-float"
          style={{ animationDelay: "0.3s" }}
        />
        <Image
          src="/HeroSticker3.webp"
          alt=""
          width={64}
          height={64}
          priority={false}
          className="absolute top-[20%] right-[5%] sm:top-40 sm:right-[25%] w-14 sm:w-16 h-14 sm:h-16 animate-float"
          style={{ animationDelay: "0.6s" }}
        />
        <Image
          src="/HeroSticker4.webp"
          alt=""
          width={64}
          height={64}
          priority={false}
          className="absolute top-1/4 right-0 w-28 sm:w-54 h-auto animate-float"
          style={{ animationDelay: "0.9s" }}
        />
        <Image
          src="/HeroSticker5.webp"
          alt=""
          width={84}
          height={84}
          priority={false}
          className="absolute bottom-1/4 right-1/4 w-14 sm:w-38 h-auto animate-float"
          style={{ animationDelay: "1.2s" }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-10 py-10 md:py-20">
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          {/* Hero Visual */}
          <div className="w-auto h-64 flex items-center justify-center pt-8">
            <Image
              src="/HeroImage.webp"
              alt="Stacks Wrapped Hero"
              width={250}
              height={250}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          {/* Headline */}
          <h1 className="text-center text-3xl sm:text-5xl md:text-6xl font-medium leading-tight text-foreground">
            <span className="block">
              Your <span className="text-orange-500">2025</span> on Stacks
            </span>
            <span className="block text-primary">Wrapped</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
            Discover your year on the Bitcoin L2: transactions, NFTs, DeFi, and
            more. Secured by Bitcoin.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xl">
            {/* Wallet preview input group */}
            <Card className="w-full border border-primary/50 p-8">
              <Input
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value);
                  if (!e.target.value.trim()) {
                    setAddressError("");
                  } else if (!isValidStacksAddress(e.target.value)) {
                    setAddressError(
                      "Invalid Stacks address. Please check and try again."
                    );
                  } else {
                    setAddressError("");
                  }
                }}
                placeholder="Enter Stacks address (SP...)"
                className="bg-background/80"
                aria-invalid={!!addressError}
              />
              {addressError && (
                <div className="text-red-500 text-xs mt-1 text-left">
                  {addressError}
                </div>
              )}
              <Button
                variant="default"
                className="w-full cursor-pointer font-semibold mt-2"
                onClick={handleViewWrap}
                disabled={!isValidStacksAddress(walletAddress.trim())}
              >
                View Wrap
              </Button>
            </Card>

            <p className="text-sm text-muted-foreground text-center">— OR —</p>

            {/* CTA Button */}
            <StacksConnectButton />
            {isWalletConnected && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  userSession.signUserOut();
                  setIsWalletConnected(false);
                  window.location.reload();
                }}
              >
                Disconnect Wallet
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
