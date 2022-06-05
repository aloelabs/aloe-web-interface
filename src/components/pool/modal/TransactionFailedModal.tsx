import React from 'react';
import { SecondaryButton } from '../../common/Buttons';
import {
  CloseableModal, Message,
} from '../../common/Modal';

const FAILED_BORDER_GRADIENT = 'rgba(235, 87, 87, 1)';

export type TransactionFailedModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function TransactionFailedModal(props: TransactionFailedModalProps) {
  return (
    <CloseableModal
      open={props.open}
      setOpen={props.setOpen}
      title='Transaction Failed'
      borderGradient={FAILED_BORDER_GRADIENT}
    >
      <Message>
        Oops! Something went wrong with your transaction, please try again later.
      </Message>
      <SecondaryButton className='w-full py-3 mt-8'>Dismiss</SecondaryButton>
    </CloseableModal>
  );
}
