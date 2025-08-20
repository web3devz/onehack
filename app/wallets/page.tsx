'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Wallet, Users, FileJson } from "lucide-react"
import { getStoredWallets } from '@/lib/local-storage'
import { toast } from 'sonner'
import { ConnectWallet } from '@/components/connect-wallet'
import { OneChainFaucet } from '@/components/onechain-faucet'
import { NetworkInfo } from '@/components/network-info'
import { QuickActions } from '@/components/quick-actions'

export default function WalletsPage() {
  const router = useRouter()
  const [localWallets, setLocalWallets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load local wallets only
    const wallets = getStoredWallets()
    setLocalWallets(wallets)
    setIsLoading(false)
  }, [])

  const allWallets = localWallets

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with wallet connection */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">OneChain Multisig Wallets</h1>
            <p className="text-muted-foreground mt-2">
              Manage your OneChain Multisig wallets
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ConnectWallet />
            <Button onClick={() => router.push('/create')} className="apple-button">
              <Plus className="h-4 w-4 mr-2" />
              Create Wallet
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Network Information */}
          <NetworkInfo />
          
          {/* OneChain Faucet (only shown when OneChain is selected) */}
          <OneChainFaucet />
          
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Additional info card */}
          <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                OneChain Network
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                OneChain blockchain network information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Current:</span>
                  <Badge variant="outline">
                    OneChain
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  OneChain blockchain network with Move-based smart contracts
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallets List */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        ) : allWallets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No wallets yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first multisig wallet or import an existing one
              </p>
              <div className="flex gap-4">
                <Button onClick={() => router.push('/create')}>
                  Create New Wallet
                </Button>
                <Button variant="outline" onClick={() => router.push('/create?tab=import')}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Import Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Wallets</h2>
            <div className="grid gap-4">
              {allWallets.map((wallet) => {
                const signers = wallet.signers
                const signersCount = signers?.length || 0
                
                return (
                  <Card 
                    key={wallet.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/wallet/${wallet.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5" />
                            {wallet.name}
                          </CardTitle>
                          <CardDescription className="mt-2 font-mono text-xs">
                            {wallet.address}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Local</Badge>
                          <Badge variant="outline">
                            OneChain
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{signersCount} signers</span>
                          </div>
                          <Badge variant="secondary">
                            Threshold: {wallet.threshold}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Local wallet
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}