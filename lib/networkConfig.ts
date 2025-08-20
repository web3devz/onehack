import { createNetworkConfig } from "@onelabs/dapp-kit";
import { ONECHAIN_NETWORKS } from "./onechain-config";

// OneChain Network Configuration Only
const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  'onechain-testnet': { 
    url: ONECHAIN_NETWORKS.testnet.url,
    variables: {
      chainType: 'onechain',
      faucetUrl: ONECHAIN_NETWORKS.testnet.faucetUrl,
      explorerUrl: ONECHAIN_NETWORKS.testnet.explorerUrl,
    }
  },
  'onechain-localnet': { 
    url: ONECHAIN_NETWORKS.localnet.url,
    variables: {
      chainType: 'onechain',
      faucetUrl: ONECHAIN_NETWORKS.localnet.faucetUrl,
      explorerUrl: ONECHAIN_NETWORKS.localnet.explorerUrl,
    }
  },
});

export { useNetworkVariable, useNetworkVariables, networkConfig };