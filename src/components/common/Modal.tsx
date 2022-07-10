import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CloseIcon from '../../assets/svg/close_modal.svg';
import LoadingIcon from '../../assets/svg/loading.svg';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Display } from './Typography';
import { classNames } from '../../util/ClassNames';

const DEFAULT_BORDER_GRADIENT =
  'linear-gradient(90deg, #9BAAF3 0%, #7BD8C0 100%)';
const LOADING_BORDER_GRADIENT = 'rgba(43, 64, 80, 1)';
export const LABEL_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
export const VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';
export const MESSAGE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';

const StyledDialog = styled.div`
  z-index: 100;
`;

const ModalWrapper = styled.div.attrs(
  (props: { 
    borderGradient: string;
    backgroundColor?: string;
    fullWidth?: boolean;
    fullHeight?: boolean;
  }) => props
)`
  ${tw`inline-block bg-grey-50 align-bottom rounded-lg text-left overflow-hidden transition-all sm:my-4 sm:align-middle`}
  transform: translateY(0);
  min-width: 368px;//TODO: make sure this doesn't break any modals
  max-width: 100%;
  height: ${(props) => props.fullHeight ? '100vh' : 'auto'};
  ${(props) => props.fullHeight ? 'margin: 0 !important;' : ''}
  background-color: rgba(13, 23, 30, 1);
  ${(props) => props.backgroundColor && `background-color: ${props.backgroundColor};`}
  color: rgba(255, 255, 255, 1);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 8px;
    padding: 1.25px;
    background: ${(props) => props.borderGradient};
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    ${props => props.fullWidth || props.fullHeight ? 'display: none;' : ''}
  }
`;

const LoaderWrapper = styled.div`
  ${tw`flex justify-center items-center`}
  width: 24px;
  height: 24px;
`;

const Loader = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(130, 160, 182, 1);
`;

export const Value = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  color: rgba(255, 255, 255, 1);
`;

export const DashedDivider = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  position: relative;
  flex-grow: 1;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed rgba(26, 41, 52, 1);
  }
`;

export const HorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 32px;
  margin-bottom: 32px;
  background-color: rgba(26, 41, 52, 1);
`;

export const Message = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(255, 255, 255, 1);
`;

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
};

type ModalBaseProps = ModalProps & {
  onClose?: () => void;
  initialFocusRef?: React.RefObject<HTMLElement>;
  borderGradient?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  backgroundColor?: string;
  noPadding?: boolean;
};

function ModalBase(props: ModalBaseProps) {
  const borderGradient = props.borderGradient || DEFAULT_BORDER_GRADIENT;
  return (
    <div>
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog
          as={StyledDialog}
          className='fixed inset-0 overflow-y-auto'
          initialFocus={props.initialFocusRef}
          onClose={() => {
            props.onClose && props.onClose();
            props.setOpen(false);
          }}
        >
          <div className={classNames('flex items-end justify-center min-h-screen text-center sm:block sm:p-0', props.fullHeight ? '' : 'pt-4 px-4 pb-20')}>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-[#0A1821] bg-opacity-[88%] transition-opacity' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <ModalWrapper borderGradient={borderGradient} fullWidth={props.fullWidth} fullHeight={props.fullHeight} backgroundColor={props.backgroundColor}>
                <div className={props.noPadding ? '' : 'p-8'}>
                  {props.children}
                </div>
              </ModalWrapper>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export type CloseableModalProps = ModalProps & {
  title: string;
  onClose?: () => void;
  borderGradient?: string;
};

export function CloseableModal(props: CloseableModalProps) {
  const cancelButtonRef = useRef(null);
  return (
    <ModalBase
      open={props.open}
      setOpen={props.setOpen}
      onClose={props.onClose}
      initialFocusRef={cancelButtonRef}
      borderGradient={props.borderGradient}
    >
      <div className='w-full flex flex-row items-center justify-between mb-8'>
        <Display size='M' weight='semibold'>
          {props.title}
        </Display>
        <button
          type='button'
          className='w-fit inline-flex justify-center rounded-full text-white focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
          onClick={() => {
            props.onClose && props.onClose();
            props.setOpen(false);
          }}
          ref={cancelButtonRef}
        >
          <img src={CloseIcon} alt='close' className='' />
        </button>
      </div>
      {props.children}
    </ModalBase>
  );
}

type LoadingModalProps = ModalProps & {
  title: string;
  borderGradient?: string;
};

export function LoadingModal(props: LoadingModalProps) {
  const borderGradient = props.borderGradient || LOADING_BORDER_GRADIENT;
  return (
    <ModalBase
      open={props.open}
      setOpen={(_open: boolean) => {}}
      borderGradient={borderGradient}
    >
      <div className='w-full flex flex-row items-center justify-between mb-8'>
        <Display size='M' weight='semibold'>
          {props.title}
        </Display>
        <LoaderWrapper>
          <Loader src={LoadingIcon} alt='loader' />
        </LoaderWrapper>
      </div>
      {props.children}
    </ModalBase>
  );
}
