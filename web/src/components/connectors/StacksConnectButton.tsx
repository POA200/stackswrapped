"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";

type ButtonProps = React.ComponentProps<typeof Button>;

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export function StacksConnectButton({ children, ...props }: ButtonProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [bns, setBns] = useState<string>("");
  const [connectError, setConnectError] = useState<string | null>(null);
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
      showConnect({
        appDetails: {
          name: "Stacks Wrapped",
          icon:
            typeof window !== "undefined"
              ? window.location.origin + "/Logo.webp"
              : "",
        },
        redirectTo: "/",
        onFinish: async () => {
          const userData = userSession.loadUserData();
          const stxAddress = userData.profile.stxAddress.mainnet;

          const bnsName = await getBns(stxAddress);

          setIsConnected(true);
          setAddress(stxAddress);
          setBns(bnsName);
          setConnectError(null);
        },
        onCancel: () => {
          setConnectError("Connection cancelled");
        },
        userSession,
      });
    } catch (err) {
      console.error("Connect failed:", err);
      setConnectError(
        err instanceof Error ? err.message : "Failed to connect wallet."
      );
    }
  };

  const handleViewWrap = () => {
    if (!isConnected || !address) return;
    router.push(`/wrap/loading?address=${encodeURIComponent(address)}`);
  };

  const getDisplayName = () => {
    if (!isConnected || !address) {
      return (
        <>
          <Wallet className="w-5 h-5" />
          Connect Wallet to view your Wrap
        </>
      );
    }
    const displayName = bns || `${address.slice(0, 4)}...${address.slice(-4)}`;
    return `View wrap ${displayName}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
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
        <p className="text-xs text-destructive text-center max-w-md">
          {connectError}
        </p>
      )}
    </div>
  );
}
