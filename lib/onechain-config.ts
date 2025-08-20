// OneChain network configurations
export const ONECHAIN_NETWORKS = {
  testnet: {
    name: "OneChain Testnet",
    url: "https://rpc-testnet.onelabs.cc",
    faucetUrl: "https://faucet-testnet.onelabs.cc/v1/gas",
    explorerUrl: "https://onescan.cc",
    chainId: "onechain-testnet",
    nativeCurrency: {
      name: "OCT",
      symbol: "OCT",
      decimals: 9,
    },
  },
  localnet: {
    name: "OneChain Localnet", 
    url: "http://localhost:9000",
    faucetUrl: "http://localhost:9123/gas",
    explorerUrl: "http://localhost:3001",
    chainId: "onechain-localnet",
    nativeCurrency: {
      name: "OCT",
      symbol: "OCT",
      decimals: 9,
    },
  },
} as const

export type NetworkType = keyof typeof ONECHAIN_NETWORKS

// OneChain specific wallet configuration
export const ONECHAIN_WALLET_CONFIG = {
  preferredWallets: ["OneChain Wallet", "OneLabs Wallet"],
  supportedFeatures: ["standard:connect", "standard:disconnect", "sui:signTransaction", "sui:signTransactionBlock"],
}

// OneChain coin types
export const ONECHAIN_COIN_TYPES = {
  OCT: '0x2::oct::OCT',
} as const
