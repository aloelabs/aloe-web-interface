import React from 'react';
import { SecondaryButton } from '../../common/Buttons';
import {
  CloseableModal, MESSAGE_TEXT_COLOR,
} from '../../common/Modal';
import { Text } from '../../common/Typography';

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
      <Text size='M' weight='medium' color={MESSAGE_TEXT_COLOR}>
        Oops! Something went wrong with your transaction, please try again later.
      </Text>
      <SecondaryButton className='w-full py-3 mt-8'>Dismiss</SecondaryButton>
    </CloseableModal>
  );
}
