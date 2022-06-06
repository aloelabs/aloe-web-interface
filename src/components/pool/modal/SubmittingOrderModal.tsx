import React from 'react';
import {
  LoadingModal, MESSAGE_TEXT_COLOR,
} from '../../common/Modal';
import { Text } from '../../common/Typography';

export type SubmittingOrderModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function SubmittingOrderModal(props: SubmittingOrderModalProps) {
  return (
    <LoadingModal
      open={props.open}
      setOpen={props.setOpen}
      title='Submitting Order'
    >
      <Text size='M' weight='medium' color={MESSAGE_TEXT_COLOR}>
        After wallet approval, your transaction will be finished in about 3s.
      </Text>
    </LoadingModal>
  );
}
