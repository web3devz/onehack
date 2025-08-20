'use client'

import { useState, useEffect } from 'react'
import { CreateMultisigWallet } from '@/components/create-multisig-wallet'
import { ImportWallet } from '@/components/import-wallet'
import { AddressConverter } from '@/components/address-converter'
import { SidebarProvider } from "@/components/ui/sidebar"
import { VaultSidebar } from "@/components/vault-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { VaultLogo } from "@/components/vault-logo"
import { ConnectWallet } from "@/components/connect-wallet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'
import { OneChainMultisigConfig } from '@/lib/types/sui'
import { toast } from 'sonner'
import { saveWallet } from '@/lib/local-storage'

export default function CreatePage() {
  const router = useRouter()
  const [activeView, setActiveView] = useState("create")
  const [activeTab, setActiveTab] = useState("create")
  
  useEffect(() => {
    // Check if we should open the import tab
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'import') {
      setActiveTab('import')
    }
  }, [])

  const handleComplete = async (config: OneChainMultisigConfig) => {
    try {
      // Save wallet to local storage only
      const savedWallet = saveWallet(config, 'My Multisig Wallet');
      
      toast.success('OneChain multisig wallet created successfully!');
      router.push(`/wallet/${savedWallet.id}`);
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error('Failed to create wallet');
    }
  };

  const handleImport = (config: OneChainMultisigConfig) => {
    // For imported wallets, save to local storage and navigate
    const wallet = saveWallet(config, 'Imported Wallet')
    toast.success('Wallet imported successfully!')
    router.push(`/wallet/${wallet.id}`)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <VaultSidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border mx-2" />
            <VaultLogo size="sm" showText={false} />
            <span className="vault-subheading brand-orchid">OneChainMultisig Console</span>
            <div className="ml-auto">
              <ConnectWallet />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="create">Create New</TabsTrigger>
                      <TabsTrigger value="import">Import Existing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="create" className="mt-6">
                      <CreateMultisigWallet 
                        onComplete={handleComplete}
                        isLoading={false}
                      />
                    </TabsContent>
                    <TabsContent value="import" className="mt-6">
                      <ImportWallet 
                        onImport={handleImport}
                        isLoading={false}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="lg:col-span-1">
                  <AddressConverter />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}