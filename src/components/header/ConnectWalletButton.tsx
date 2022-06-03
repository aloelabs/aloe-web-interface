import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import Modal from '../common/Modal';

import { useAccount, useConnect } from 'wagmi';
import { FormatAddress } from '../../util/FormatAddress';
import { mapConnectorNameToIcon } from './ConnectorIconMap';

export default function ConnectWalletButton() {
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
      <PrimaryButton
        name={buttonText}
        className='w-full py-2 px-8 whitespace-pre'
        onClick={() => setModalOpen(true)}
      >
        {buttonText}
      </PrimaryButton>
      <Modal open={modalOpen} setOpen={setModalOpen} title={'Connect Wallet'}>
        <div className='w-full'>
          {accountData ? (
            // We have an account connected
            <div className='flex flex-row items-center justify-between p-2 rounded-md border-2 border-grey-200 bg-grey-100'>
              {/*<img src={accountData.ens?.avatar || undefined} alt="ENS Avatar" />*/}
              <div className='flex flex-col items-start justify-start'>
                <div className='text-md'>
                  {accountData.ens?.name
                    ? `${accountData.ens?.name} (${FormatAddress(
                        accountData.address
                      )})`
                    : FormatAddress(accountData.address)}
                </div>
                <div className='text-sm text-grey-800'>
                  Connected to {accountData.connector?.name}
                </div>
              </div>
              <SecondaryButton
                className='px-4 py-1'
                name='Disconnect'
                onClick={disconnect}
              >
                Disconnect
              </SecondaryButton>
            </div>
          ) : (
            // No account connected, display connection options
            <div className='py-2'>
              <div className='text-md'>
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
              </div>
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
                  <SecondaryButton
                    className='px-8 py-2 w-full grow '
                    disabled={!connector.ready}
                    onClick={() => connect(connector)}
                  >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                  </SecondaryButton>
                </div>
              ))}
            </div>
          )}
          {connectError && (
            <div className='text-warning'>
              {connectError?.message ?? 'Failed to connect'}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
