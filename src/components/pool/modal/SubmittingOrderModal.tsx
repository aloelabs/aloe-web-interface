import React from 'react';
import {
  LoadingModal, Message,
} from '../../common/Modal';

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
      <Message>
        After wallet approval, your transaction will be finished in about 3s.
      </Message>
    </LoadingModal>
  );
}
