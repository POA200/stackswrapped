"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { GetAddressesResult } from "@stacks/connect/dist/types/methods";
import { Wallet } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button>;

export function StacksConnectButton({ children, ...props }: ButtonProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletInfo, setWalletInfo] = useState<GetAddressesResult | null>(null);
  const [bns, setBns] = useState<string>("");
  const [connectError, setConnectError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualAddress, setManualAddress] = useState<string>("");
  const router = useRouter();

  const selectStxAddress = (info: GetAddressesResult | null) => {
    if (!info) return undefined;
    return (
      info.addresses.find((addr) => addr.symbol?.toUpperCase() === "STX")
        ?.address || info.addresses[0]?.address
    );
  };

  const getProvider = () => {
    if (typeof window === "undefined") return null;
    const provider =
      (window as any).StacksProvider || (window as any).LeatherProvider;
    if (!provider) return null;
    return provider as {
      request?: (args: { method: string }) => Promise<unknown>;
      getAddresses?: () => Promise<unknown>;
    };
  };

  const getBns = async (stxAddress: string) => {
    try {
      const response = await fetch(
        `https://api.bnsv2.com/mainnet/names/address/${stxAddress}/valid`
      );
      const data = await response.json();
      return data.names?.[0]?.full_name || "";
    } catch (err) {
      console.error("Failed to fetch BNS name:", err);
      return "";
    }
  };

  const handleConnect = async () => {
    try {
      const provider = getProvider();
      if (!provider) throw new Error("Stacks Wallet not found");

      let connectionResponse: GetAddressesResult | null = null;

      // Prefer the explicit getAddresses helper when available (Xverse/Leather)
      if (provider.getAddresses) {
        try {
          console.log("Attempting provider.getAddresses()");
          connectionResponse =
            (await provider.getAddresses()) as GetAddressesResult;
          console.log("getAddresses succeeded:", connectionResponse);
        } catch (err) {
          console.warn("provider.getAddresses failed:", err);
          connectionResponse = null;
        }
      }

      // Fallback to request RPC shape only if provider explicitly supports it
      // (avoid calling request if it will throw "not implemented")
      if (
        !connectionResponse &&
        provider.request &&
        typeof provider.request === "function"
      ) {
        try {
          console.log("Attempting provider.request(getAddresses)");
          connectionResponse = (await Promise.race([
            provider.request({ method: "getAddresses" }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("request timeout")), 2000)
            ),
          ])) as GetAddressesResult;
          console.log("request succeeded:", connectionResponse);
        } catch (err) {
          console.warn(
            "provider.request failed (expected for some wallets):",
            err
          );
          connectionResponse = null;
        }
      }

      if (!connectionResponse) {
        setConnectError(
          "This wallet cannot return addresses. Please use Leather or Xverse, or paste your address manually."
        );
        return;
      }

      const stxAddress = selectStxAddress(connectionResponse);

      if (!stxAddress) {
        throw new Error("No STX address returned from wallet");
      }

      const bnsName = await getBns(stxAddress);

      setIsConnected(true);
      setWalletInfo(connectionResponse);
      setBns(bnsName);
      setConnectError(null);
    } catch (err) {
      console.error("Connect failed:", err);
      setConnectError(
        err instanceof Error ? err.message : "Failed to connect wallet."
      );
    }
  };

  const handleViewWrap = () => {
    if (!isConnected || !walletInfo) return;
    const stxAddress = selectStxAddress(walletInfo);
    if (!stxAddress) return;
    router.push(`/wrap/loading?address=${encodeURIComponent(stxAddress)}`);
  };

  const handleManualAddressSubmit = () => {
    const trimmed = manualAddress.trim();
    if (!trimmed) {
      setConnectError("Please enter a valid Stacks address");
      return;
    }
    // Basic validation: Stacks addresses start with 'S' or 'SP' for mainnet
    if (!trimmed.match(/^(S[A-Z0-9]{33}|SP[A-Z0-9]{32})$/)) {
      setConnectError("Invalid Stacks address format");
      return;
    }
    setIsConnected(true);
    setBns("");
    setManualAddress("");
    setShowManualInput(false);
    setConnectError(null);
    router.push(`/wrap/loading?address=${encodeURIComponent(trimmed)}`);
  };

  const getDisplayName = () => {
    if (!isConnected || !walletInfo) {
      return (
        <>
          <Wallet className="w-5 h-5" />
          Connect Wallet to view your Wrap
        </>
      );
    }
    const address = selectStxAddress(walletInfo);
    if (!address) return "View wrap";
    const displayName = bns || `${address.slice(0, 4)}...${address.slice(-4)}`;
    return `View wrap ${displayName}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {showManualInput ? (
        <div className="flex flex-col gap-2 w-full items-center">
          <input
            type="text"
            placeholder="Enter your Stacks address (SP...)"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleManualAddressSubmit();
            }}
            className="px-4 py-2 rounded border border-primary/30 bg-card text-sm w-80 max-w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleManualAddressSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              Submit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowManualInput(false);
                setManualAddress("");
                setConnectError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button
            variant="default"
            size="lg"
            className="shadow-lg shadow-primary/30 hover:scale-105 transition-transform duration-200 text-lg px-8 py-6 gap-2 cursor-pointer"
            {...(props as ButtonProps)}
            onClick={(e) => {
              // Maintain any provided onClick
              if (props && (props as any).onClick) (props as any).onClick(e);
              if (!isConnected) {
                handleConnect();
              } else {
                handleViewWrap();
              }
            }}
          >
            {getDisplayName()}
          </Button>
          {connectError && (
            <div className="text-xs text-destructive text-center max-w-md flex flex-col gap-2">
              <p>{connectError}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowManualInput(true)}
                className="text-xs"
              >
                Enter Address Manually
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
