import React from 'react';
import { Provider, chain, defaultChains } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletLinkConnector } from 'wagmi/connectors/walletLink';
import { providers } from 'ethers';

export type WagmiProviderProps = {
  children?: React.ReactNode;
};

const infuraId = process.env.REACT_APP_INFURA_ID;

const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;

const chains = defaultChains;

const connectors = ({ chainId }: { chainId?: number | undefined }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: 'Aloe',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ];
};

const provider = ({ chainId }: { chainId?: number | undefined }) =>
  new providers.AlchemyProvider(chainId, alchemyApiKey);

const webSocketProvider = ({ chainId }: { chainId?: number | undefined }) => {
  return new providers.AlchemyWebSocketProvider(chainId, alchemyApiKey);
};

export default function WagmiProvider(props: WagmiProviderProps) {
  return (
    <Provider
      autoConnect
      connectors={connectors}
      provider={provider}
      webSocketProvider={webSocketProvider}
    >
      {props.children}
    </Provider>
  );
}
