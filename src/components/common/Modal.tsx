import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PageHeading from './PageHeading';
import CloseIcon from '../../assets/svg/close.svg';
import styled from 'styled-components';
import tw from 'twin.macro';

export type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
  title: string;
};

const SpacingDiv = styled.div`
  p {
    ${tw`py-2`}
  }
`;

export default function Modal(props: ModalProps) {
  const cancelButtonRef = useRef(null);

  return (
    <div>
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog
          as='div'
          className='fixed z-10 inset-0 overflow-y-auto'
          initialFocus={cancelButtonRef}
          onClose={props.setOpen}
        >
          <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
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
              <div className='inline-block bg-grey-50 border-2 border-grey-200 align-bottom rounded-lg text-left overflow-hidden transform transition-all sm:my-4 sm:align-middle sm:max-w-lg sm:w-full'>
                <div className='px-4 pt-2 pb-4'>
                  <div className='w-full p-2 flex flex-row items-center justify-between'>
                    <PageHeading>{props.title}</PageHeading>
                    <button
                      type='button'
                      className='w-fit inline-flex justify-center rounded-full border border-grey-200 shadow-sm p-2 bg-grey-100 text-white hover:bg-grey-300 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                      onClick={() => props.setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      <img src={CloseIcon} alt='close' className='' />
                    </button>
                  </div>
                  <SpacingDiv className='m-2 text-md text-grey-1000 pr-4'>
                    {props.children}
                  </SpacingDiv>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
