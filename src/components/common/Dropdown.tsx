import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import DropdownArrowDown from '../../assets/svg/dropdown_arrow_down.svg';
import DropdownArrowUp from '../../assets/svg/dropdown_arrow_up.svg';
import { CheckIcon } from '@heroicons/react/solid';
import useClickOutside from '../../data/hooks/UseClickOutside';

const DROPDOWN_HEADER_BORDER_COLOR = 'rgba(34, 54, 69, 1)';
const DROPDOWN_LIST_BG_COLOR = 'rgb(17, 34, 46)';
const DROPDOWN_LIST_BORDER_COLOR = 'rgba(56, 82, 101, 1)';
const DROPDOWN_OPTION_BG_COLOR_HOVER = 'rgba(255, 255, 255, 0.04)';
const DROPDOWN_OPTION_BG_COLOR_ACTIVE = 'rgba(255, 255, 255, 0.1)';
const CHECKBOX_BG_COLOR = 'rgba(255, 255, 255, 0.1)';
const CHECKBOX_BG_COLOR_ACTIVE = 'rgba(82, 182, 154, 1)';


const DropdownWrapper = styled.div`
  ${tw`flex flex-col items-start justify-evenly`}
  position: relative;
  width: fit-content;
  overflow: visible;
`;

const DropdownHeader = styled.button`
  ${tw`flex flex-row items-center justify-between`}
  background: transparent;
  padding: 16px 52px 16px 24px;
  border: 1px solid ${DROPDOWN_HEADER_BORDER_COLOR};
  border-radius: 100px;
`;

const DropdownHeaderLabel = styled.div.attrs(
  (props: { numberOfCharacters: number }) => props
)`
  min-width: ${(props) => props.numberOfCharacters}ch;
`;

const DropdownList = styled.div`
  ${tw`flex flex-col`}
  position: absolute;
  right: 0px;
  top: calc(100% + 10px);
  z-index: 10;
  min-width: 100%;
  padding: 12px;
  gap: 8px;
  background-color: ${DROPDOWN_LIST_BG_COLOR};
  border-radius: 8px;
  border: 1px solid ${DROPDOWN_LIST_BORDER_COLOR};
`;

const MultiDropdownList = styled.div`
  ${tw`flex flex-col`}
  position: absolute;
  right: 0px;
  top: calc(100% + 10px);
  z-index: 10;
  box-sizing: content-box;
  min-width: 100%;
  padding: 12px;
  gap: 8px;
  background-color: ${DROPDOWN_LIST_BG_COLOR};
  border-radius: 8px;
  border: 1px solid ${DROPDOWN_LIST_BORDER_COLOR};
`;

const DropdownOptionContainer = styled.button`
  ${tw`w-full`}
  text-align: start;
  padding: 6px 12px;
  white-space: nowrap;
  border-radius: 8px;
  &:hover {
    background-color: ${DROPDOWN_OPTION_BG_COLOR_HOVER};
  }
  &.active {
    background-color: ${DROPDOWN_OPTION_BG_COLOR_ACTIVE};
  }
`;

const MultiDropdownOptionContainer = styled.button`
  ${tw`w-full flex flex-row items-center justify-start`}
  gap: 8px;
  text-align: start;
  padding: 6px 12px;
  white-space: nowrap;
  border-radius: 8px;
  &:hover {
    background-color: ${DROPDOWN_OPTION_BG_COLOR_HOVER};
  }
  &.active {
    background-color: ${DROPDOWN_OPTION_BG_COLOR_ACTIVE};
  }
`;

const CheckContainer = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${CHECKBOX_BG_COLOR};
  border-radius: 4px;

  &.active {
    background-color: ${CHECKBOX_BG_COLOR_ACTIVE};
  }
`;

export type DropdownOption = {
  label: string;
  value: string;
  isDefault: boolean;
};

export type DropdownProps = {
  options: DropdownOption[];
  selectedOption: DropdownOption;
  onSelect: (option: DropdownOption) => void;
  placeholder: string;
};

export function DropdownWithPlaceholder(props: DropdownProps) {
  const { options, selectedOption, onSelect, placeholder } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (option: DropdownOption, index: number) => {
    onSelect(option);
    setIsOpen(false);
  };

  // const numberOfPossibleCharacters = options.reduce(
  //   (acc, curr) => Math.max(acc, curr.length),
  //   placeholder.length
  // );

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownHeader onClick={toggleList}>
        {selectedOption.isDefault ? placeholder : selectedOption.label}
        <img
          className='absolute right-6'
          src={isOpen ? DropdownArrowUp : DropdownArrowDown}
          alt=''
        />
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          {options.map((option, index) => (
            <DropdownOptionContainer
              className={option.value === selectedOption.value ? 'active' : ''}
              key={index}
              onClick={() => selectItem(option, index)}
            >
              {option.label}
            </DropdownOptionContainer>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
}

export type MultiDropdownOption = {
  label: string;
  value: string;
  icon?: string;
};

export type MultiDropdownProps = {
  options: MultiDropdownOption[];
  activeOptions: MultiDropdownOption[];
  handleChange: (options: MultiDropdownOption[]) => void;
  placeholder: string;
  selectedText: string;
};

export function MultiDropdown(props: MultiDropdownProps) {
  const { options, activeOptions, handleChange, placeholder, selectedText } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  // const [selectedOptions, setSelectedOptions] = useState(
  //   [] as MultiDropdownOption[]
  // );

  // useEffect(() => {
  //   setSelectedOptions(activeOptions);
  // }, [activeOptions]);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(
    dropdownRef,
    () => {
      setIsOpen(false);
      // setSelectedOptions(activeOptions);
    },
    isOpen
  );

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (option: MultiDropdownOption, index: number) => {
    let updatedOptions;
    if (
      activeOptions.some(
        (currentOption) => currentOption.value === option.value
      )
    ) {
      updatedOptions = activeOptions.filter(
        (currentOption) => currentOption.value !== option.value
      );
      // setSelectedOptions([
      //   ...selectedOptions.filter(
      //     (currentOption) => currentOption.value !== option.value
      //   ),
      // ]);
    } else {
      updatedOptions = [...activeOptions, option];
      //setSelectedOptions([...selectedOptions, option]);
    }
    handleChange(updatedOptions);
  };

  const numberOfPossibleDigits = Math.floor((activeOptions.length - 1) / 10);
  const numberOfPossibleCharacters = Math.max(
    placeholder.length,
    selectedText.length + numberOfPossibleDigits + 3
  );

  let dropdownLabel =
    activeOptions.length === options.length
      ? placeholder
      : `${selectedText} (${activeOptions.length})`;

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownHeader onClick={toggleList}>
        <DropdownHeaderLabel numberOfCharacters={numberOfPossibleCharacters}>
          {dropdownLabel}
        </DropdownHeaderLabel>
        <img
          className='absolute right-6'
          src={isOpen ? DropdownArrowUp : DropdownArrowDown}
          alt=''
        />
      </DropdownHeader>
      {isOpen && (
        <MultiDropdownList ref={dropdownRef}>
          {options.map((option, index) => {
            const { label, icon } = option;
            const isActive = activeOptions.some(
              (currentOption) => currentOption.value === option.value
            );
            return (
              <MultiDropdownOptionContainer
                className={
                  activeOptions.some(
                    (currentOption) => currentOption.value === option.value
                  )
                    ? 'active'
                    : ''
                }
                key={index}
                onClick={() => selectItem(option, index)}
              >
                {icon && (
                  <img
                    className='bg-white w-5 h-5 rounded-full'
                    src={icon}
                    width={20}
                    height={20}
                    alt=''
                  />
                )}
                <div className='flex-grow h-6'>{label}</div>
                <CheckContainer className={isActive ? 'active' : ''}>
                  {isActive && (
                    <CheckIcon
                      color='black'
                      className='w-5 h-5'
                      width={20}
                      height={20}
                    />
                  )}
                </CheckContainer>
              </MultiDropdownOptionContainer>
            );
          })}
        </MultiDropdownList>
      )}
    </DropdownWrapper>
  );
}
