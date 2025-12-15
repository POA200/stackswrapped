import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserSession, AppConfig } from "@stacks/connect";

// Custom hook to get wallet state
export function useWallet() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [stxAddress, setStxAddress] = useState<string | null>(null);

  useEffect(() => {
    const appConfig = new AppConfig(["store_write", "publish_data"]);
    const userSession = new UserSession({ appConfig });
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData?.profile?.stxAddress?.mainnet;
      if (address) {
        setIsSignedIn(true);
        setStxAddress(address);
      }
    }
  }, []);

  return { isSignedIn, stxAddress };
}
