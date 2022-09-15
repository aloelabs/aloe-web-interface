import React from 'react';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const infuraId = process.env.REACT_APP_INFURA_ID;
const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet],
  [
    alchemyProvider({apiKey: alchemyApiKey}),
    infuraProvider({ apiKey: infuraId }),
    publicProvider()
  ],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Aloe',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
})

export type WagmiProviderProps = {
  children?: React.ReactNode;
};

export default function WagmiProvider(props: WagmiProviderProps) {
  return (
    <WagmiConfig client={client}>
      {props.children}
    </WagmiConfig>
  );
}
