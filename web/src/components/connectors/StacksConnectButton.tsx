"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { connect, disconnect } from "@stacks/connect";
import type { GetAddressesResult } from "@stacks/connect/dist/types/methods";
import { Wallet } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button>;

export function StacksConnectButton({ children, ...props }: ButtonProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletInfo, setWalletInfo] = useState<GetAddressesResult | null>(null);
  const [bns, setBns] = useState<string>("");
  const router = useRouter();

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
      const connectionResponse: GetAddressesResult = await connect();
      const stxAddress = connectionResponse.addresses[2].address;
      const bnsName = await getBns(stxAddress);

      setIsConnected(true);
      setWalletInfo(connectionResponse);
      setBns(bnsName);
    } catch (err) {
      console.error("Connect failed", err);
    }
  };

  const handleViewWrap = () => {
    if (!isConnected || !walletInfo) return;
    const stxAddress = walletInfo.addresses[2].address;
    router.push(`/wrap/loading?address=${encodeURIComponent(stxAddress)}`);
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
    const address = walletInfo.addresses[2].address;
    const displayName = bns || `${address.slice(0, 4)}...${address.slice(-4)}`;
    return `View wrap ${displayName}`;
  };

  return (
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
  );
}
