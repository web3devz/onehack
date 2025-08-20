"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, ExternalLink, Info } from "lucide-react"
import { ONECHAIN_NETWORKS } from "@/lib/onechain-config"

export function NetworkInfo() {
  const openExplorer = () => {
    window.open(ONECHAIN_NETWORKS.testnet.explorerUrl, '_blank');
  };

  const openDocs = () => {
    window.open('https://doc-testnet.onelabs.cc/', '_blank');
  };

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Network className="h-5 w-5 text-green-600 dark:text-green-400" />
          Network Information
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          OneChain blockchain network details and resources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Network
              </span>
              <Badge variant="outline" className="mt-1">
                OneChain Testnet
              </Badge>
            </div>
            
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Native Token
              </span>
              <Badge variant="secondary" className="mt-1">
                OCT
              </Badge>
            </div>

            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Decimals
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                9
              </span>
            </div>

            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Environment
              </span>
              <Badge variant="default" className="mt-1">
                Testnet
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/50">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                OneChain Features
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Move-based smart contracts</li>
                <li>• High-performance transaction processing</li>
                <li>• Object-centric programming model</li>
                <li>• Programmable Transaction Blocks (PTBs)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={openExplorer} className="flex-1 gap-2">
            <ExternalLink className="h-4 w-4" />
            Explorer
          </Button>
          
          <Button variant="outline" onClick={openDocs} className="flex-1 gap-2">
            <ExternalLink className="h-4 w-4" />
            Documentation
          </Button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>• OneChain testnet is for development only</p>
          <p>• Test tokens have no real monetary value</p>
          <p>• Use faucet to get free test tokens</p>
        </div>
      </CardContent>
    </Card>
  );
}
