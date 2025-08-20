"use client";

import "@onelabs/dapp-kit/dist/index.css";

import { SuiClientProvider, WalletProvider } from "@onelabs/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "@/lib/networkConfig";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="onechain-testnet">
          <WalletProvider autoConnect>
            {children}
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}