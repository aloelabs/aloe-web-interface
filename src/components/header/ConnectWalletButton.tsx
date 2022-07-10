import React, { useState } from 'react';
import { CloseableModal } from '../common/Modal';

import { useAccount, useConnect } from 'wagmi';
import { FormatAddress } from '../../util/FormatAddress';
import {
  FilledStylizedButton,
  OutlinedGradientRoundedButton,
} from '../common/Buttons';
import { mapConnectorNameToIcon } from './ConnectorIconMap';
import { Text } from '../common/Typography';

export type ConnectWalletButtonProps = {
  buttonStyle?: 'secondary' | 'tertiary';
};

export default function ConnectWalletButton(props: ConnectWalletButtonProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  const ensName: string | undefined = accountData?.ens?.name;
  const formattedAddr = accountData ? FormatAddress(accountData.address) : '';
  const buttonText = accountData
    ? ensName
      ? ensName
      : formattedAddr
    : 'Connect Wallet';

  return (
    <div>
      {!props.buttonStyle && (
        <OutlinedGradientRoundedButton
          name={buttonText}
          size='S'
          onClick={() => setModalOpen(true)}
        >
          {buttonText}
        </OutlinedGradientRoundedButton>
      )}
      {props.buttonStyle === 'secondary' && (
        <FilledStylizedButton
          name={buttonText}
          size='M'
          onClick={() => setModalOpen(true)}
          backgroundColor='rgba(26, 41, 52, 1)'
          color='rgba(255, 255, 255, 1)'
          fillWidth={true}
        >
          {buttonText}
        </FilledStylizedButton>
      )}
      {props.buttonStyle === 'tertiary' && (
        <FilledStylizedButton
          name={buttonText}
          size='M'
          onClick={() => setModalOpen(true)}
          fillWidth={true}
          className='!rounded-none !pt-5 !pb-5'
        >
          {buttonText}
        </FilledStylizedButton>
      )}
      <CloseableModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={'Connect Wallet'}
      >
        <div className='w-full'>
          {accountData ? (
            // We have an account connected
            <div className='flex flex-col gap-y-2 items-center justify-between p-2 rounded-md border-2 border-grey-200 bg-grey-100'>
              {/*<img src={accountData.ens?.avatar || undefined} alt="ENS Avatar" />*/}
              <div className='flex flex-col items-start justify-start w-full oveflow-hidden'>
                <Text
                  size='M'
                  className='w-full overflow-hidden text-ellipsis'
                  title={accountData.address}
                >
                  {accountData.ens?.name
                    ? `${accountData.ens?.name} (${FormatAddress(
                        accountData.address
                      )})`
                    : accountData.address}
                </Text>
                <Text
                  size='S'
                  color='rgb(194, 209, 221)'
                  className='w-full overflow-hidden text-ellipsis'
                >
                  Connected to {accountData.connector?.name}
                </Text>
              </div>
              <FilledStylizedButton
                name='Disconnect'
                size='M'
                backgroundColor='rgba(26, 41, 52, 1)'
                color={'rgba(255, 255, 255, 1)'}
                fillWidth={true}
                onClick={disconnect}
              >
                Disconnect
              </FilledStylizedButton>
            </div>
          ) : (
            // No account connected, display connection options
            <div className='py-2'>
              <Text size='M' weight='medium'>
                By connecting a wallet, I agree to Aloe Labs, Inc's{' '}
                <a
                  href={'/terms.pdf'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-green-600 hover:text-green-700'
                >
                  Terms of Use
                </a>{' '}
                and{' '}
                <a
                  href={'/privacy.pdf'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-green-600 hover:text-green-700'
                >
                  Privacy Policy
                </a>
                .
              </Text>
              {connectData.connectors.map((connector) => (
                <div
                  key={connector.id}
                  className=' py-2 w-full flex flex-row items-center justify-between'
                >
                  <img
                    src={mapConnectorNameToIcon(connector.name)}
                    alt=''
                    className='w-10 h-10 mr-4'
                  />
                  <FilledStylizedButton
                    name='Disconnect'
                    size='M'
                    backgroundColor='rgba(26, 41, 52, 1)'
                    color={'rgba(255, 255, 255, 1)'}
                    fillWidth={true}
                    disabled={!connector.ready}
                    onClick={() => connect(connector)}
                  >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                  </FilledStylizedButton>
                </div>
              ))}
            </div>
          )}
          {connectError && (
            <Text size='S' color='rgb(236, 45, 91)'>
              {connectError?.message ?? 'Failed to connect'}
            </Text>
          )}
        </div>
      </CloseableModal>
    </div>
  );
}
