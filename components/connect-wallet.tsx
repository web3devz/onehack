"use client"

import { ConnectButton, useCurrentAccount, useSuiClient } from "@onelabs/dapp-kit"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useCallback } from "react"
import { CoinBalance } from "@onelabs/sui/client"
import { Copy, Check, RefreshCw, Wallet, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useWalletPublicKey } from '@/hooks/use-wallet-public-key'
import { useRouter } from 'next/navigation'
import { ONECHAIN_COIN_TYPES } from '@/lib/onechain-config'
import { getStoredWallets } from '@/lib/local-storage'

const OCT_COIN_TYPE = ONECHAIN_COIN_TYPES.OCT;
const MIST_PER_OCT = 1_000_000_000; // OneChain uses 9 decimals

export function ConnectWallet() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { formattedPublicKey } = useWalletPublicKey();
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<CoinBalance | null>(null);
  const [isLoadingWalletBalance, setIsLoadingWalletBalance] = useState<boolean>(false);
  const [multisigWallets, setMultisigWallets] = useState<any[]>([]);
  const [isLoadingMultisigs, setIsLoadingMultisigs] = useState<boolean>(false);
  const router = useRouter();

  const formatBalance = (totalBalance: string) => {
    const balanceInMist = BigInt(totalBalance);
    return (Number(balanceInMist) / MIST_PER_OCT).toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 4 
    });
  };

  const fetchWalletBalance = useCallback(async () => {
    if (!currentAccount?.address) {
      setWalletBalance(null);
      return;
    }
    setIsLoadingWalletBalance(true);
    try {
      const coinBalance = await suiClient.getBalance({
        owner: currentAccount.address,
        coinType: OCT_COIN_TYPE,
      });
      setWalletBalance(coinBalance);
    } catch (error: any) {
      console.error("Error fetching OCT balance:", error);
      setWalletBalance(null);
    } finally {
      setIsLoadingWalletBalance(false);
    }
  }, [suiClient, currentAccount?.address]);

    const loadMultisigWallets = useCallback(async () => {
    if (!currentAccount?.address) {
      setMultisigWallets([]);
      return;
    }

    setIsLoadingMultisigs(true);
    try {
      // Load wallets from local storage only
      const localWallets = getStoredWallets();
      
      // Filter wallets where the current account is a signer
      const userWallets = localWallets.filter(wallet => 
        wallet.signers?.some((signer: any) => signer.address === currentAccount.address)
      );
      
      setMultisigWallets(userWallets);
    } catch (error) {
      console.error('Error loading multisig wallets:', error);
      setMultisigWallets([]);
    } finally {
      setIsLoadingMultisigs(false);
    }
  }, [currentAccount?.address]);

  useEffect(() => {
    if (currentAccount?.address) {
      fetchWalletBalance();
      loadMultisigWallets();
    } else {
      setWalletBalance(null);
      setIsLoadingWalletBalance(false);
      setMultisigWallets([]);
    }
  }, [currentAccount?.address, fetchWalletBalance, loadMultisigWallets]);

  // No realtime updates needed for local storage - 
  // wallets will be refreshed when the user navigates back

  const handleCopyPublicKey = () => {
    if (formattedPublicKey) {
      navigator.clipboard.writeText(formattedPublicKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleCopyAddress = () => {
    if (currentAccount?.address) {
      navigator.clipboard.writeText(currentAccount.address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Override the default ConnectButton with our custom dropdown
  if (currentAccount) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
            </span>
            <span className="sm:hidden">
              {currentAccount.address.slice(0, 4)}...
            </span>
            <Badge variant="secondary" className="text-xs">
              OCT
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>
            OneChain Wallet
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Balance */}
          <DropdownMenuItem className="flex-col items-start gap-1">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">Balance</span>
              <div className="flex items-center gap-2">
                {isLoadingWalletBalance ? (
                  <span className="text-sm text-muted-foreground">Loading...</span>
                ) : walletBalance ? (
                  <span className="text-sm font-mono">
                    {formatBalance(walletBalance.totalBalance)} OCT
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Error</span>
                )}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchWalletBalance();
                  }}
                  disabled={isLoadingWalletBalance}
                >
                  <RefreshCw className={`h-3 w-3 ${isLoadingWalletBalance ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Address */}
          <DropdownMenuItem 
            className="flex-col items-start gap-1 cursor-pointer"
            onClick={handleCopyAddress}
          >
            <span className="text-sm font-medium">Address</span>
            <div className="flex items-center gap-2 w-full">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                {currentAccount.address}
              </code>
              {copySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </div>
          </DropdownMenuItem>

          {/* Public Key */}
          {formattedPublicKey && (
            <DropdownMenuItem 
              className="flex-col items-start gap-1 cursor-pointer"
              onClick={handleCopyPublicKey}
            >
              <span className="text-sm font-medium">Formatted Public Key</span>
              <div className="flex items-center gap-2 w-full">
                <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                  {formattedPublicKey}
                </code>
                {copySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Network Info */}
          <DropdownMenuItem className="flex-col items-start gap-1">
            <span className="text-sm font-medium">Network</span>
            <div className="flex items-center gap-2 w-full">
              <Badge variant="outline" className="text-xs">
                OneChain Testnet
              </Badge>
              <span className="text-xs text-muted-foreground">
                OneChain Ecosystem
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Multisig Wallets */}
          {multisigWallets.length > 0 && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <Users className="h-4 w-4" />
                  <span>Multisig Wallets</span>
                  <Badge variant="secondary" className="ml-auto">
                    {multisigWallets.length}
                  </Badge>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64">
                  {isLoadingMultisigs ? (
                    <DropdownMenuItem disabled>
                      <span className="text-muted-foreground">Loading...</span>
                    </DropdownMenuItem>
                  ) : (
                    multisigWallets.map((wallet) => (
                      <DropdownMenuItem
                        key={wallet.id}
                        onClick={() => router.push(`/wallet/${wallet.id}`)}
                        className="flex-col items-start gap-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{wallet.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {wallet.threshold} sigs
                          </Badge>
                        </div>
                        <code className="text-xs text-muted-foreground">
                          {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                        </code>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
            </>
          )}
          
          {/* Disconnect using ConnectButton */}
          <div className="p-2">
            <ConnectButton 
              connectText="Switch Wallet"
              style={{
                width: '100%',
              }}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <ConnectButton />;
}