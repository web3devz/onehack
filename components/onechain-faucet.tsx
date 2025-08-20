"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCurrentAccount } from "@onelabs/dapp-kit"
import { Droplets, Loader2, ExternalLink } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ONECHAIN_NETWORKS } from "@/lib/onechain-config"

export function OneChainFaucet() {
  const currentAccount = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(false);

  const requestTokens = async () => {
    if (!currentAccount?.address) {
      toast.error("Please connect your OneChain wallet first");
      return;
    }

    setIsLoading(true);
    try {
      const faucetUrl = ONECHAIN_NETWORKS.testnet.faucetUrl;
      
      const response = await fetch(faucetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FixedAmountRequest: {
            recipient: currentAccount.address
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Test OCT tokens requested successfully!");
        console.log('Faucet response:', data);
      } else {
        const errorData = await response.text();
        console.error('Faucet error:', errorData);
        toast.error("Failed to request tokens. Please try again.");
      }
    } catch (error) {
      console.error('Faucet request error:', error);
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const openExplorer = () => {
    const explorerUrl = ONECHAIN_NETWORKS.testnet.explorerUrl;
    window.open(explorerUrl, '_blank');
  };

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          OneChain Testnet Faucet
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Request free OCT test tokens for development and testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Network
            </span>
            <Badge variant="outline" className="text-xs">
              OneChain Testnet
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Token
            </span>
            <Badge variant="secondary" className="text-xs">
              OCT
            </Badge>
          </div>

          {currentAccount && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Recipient
              </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </code>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={requestTokens} 
            disabled={!currentAccount || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              <>
                <Droplets className="mr-2 h-4 w-4" />
                Request OCT
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={openExplorer}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Explorer
          </Button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>• Free test tokens for OneChain testnet</p>
          <p>• Rate limited to prevent spam</p>
          <p>• Tokens have no real value</p>
        </div>
      </CardContent>
    </Card>
  );
}
