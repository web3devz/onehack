"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCurrentAccount } from "@onelabs/dapp-kit"
import { Send, Plus, Upload, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();

  if (!currentAccount) {
    return (
      <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Send className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Connect your wallet to access quick actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Please connect your wallet to use quick actions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Send className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          Quick Actions
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          OneChain wallet operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Connected Network
            </span>
            <Badge variant="outline">
              OneChain
            </Badge>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Ready to interact with OneChain network
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={() => router.push('/create')} 
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Create New Wallet
          </Button>
          
          <Button 
            onClick={() => router.push('/create?tab=import')} 
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Upload className="h-4 w-4" />
            Import Wallet
          </Button>
          
          <Button 
            onClick={() => router.push('/settings')} 
            className="w-full justify-start gap-2"
            variant="outline"
            disabled
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>• Create secure multisig wallets</p>
          <p>• Import existing configurations</p>
          <p>• Manage wallet settings</p>
        </div>
      </CardContent>
    </Card>
  );
}
