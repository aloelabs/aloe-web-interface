import React from 'react';
import { Connector, useAccount } from 'wagmi';

export type AccountData = {
  address: string;
  connector: Connector<any, any> | undefined;
  ens:
    | {
        avatar: string | null | undefined;
        name: string;
      }
    | undefined;
};

export interface IAccountContext {
  accountData: AccountData | undefined;
  disconnect: () => void;
}

const defaultAccount: AccountData = {
  address: '',
  connector: undefined,
  ens: undefined,
};

const defaultState: IAccountContext = {
  accountData: defaultAccount,
  disconnect: () => {},
};

export const AccountContext =
  React.createContext<IAccountContext>(defaultState);

export type AccountProviderProps = {
  children?: React.ReactNode;
};

export function AccountProvider(props: AccountProviderProps) {
  const [{ data: accountData }, disconnect] = useAccount();

  return (
    <AccountContext.Provider value={{ accountData, disconnect }}>
      {props.children}
    </AccountContext.Provider>
  );
}
