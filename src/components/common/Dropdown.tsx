import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import DropdownArrowDown from '../../assets/svg/dropdown_arrow_down.svg';
import DropdownArrowUp from '../../assets/svg/dropdown_arrow_up.svg';
import { CheckIcon } from '@heroicons/react/solid';
import useClickOutside from '../../data/hooks/UseClickOutside';
import { Text } from './Typography';

const DROPDOWN_HEADER_BORDER_COLOR = 'rgba(34, 54, 69, 1)';
const DROPDOWN_LIST_BG_COLOR = 'rgba(7, 14, 18, 1)';
const DROPDOWN_LIST_BORDER_COLOR = 'rgba(56, 82, 101, 1)';
const DROPDOWN_LIST_SHADOW_COLOR = 'rgba(0, 0, 0, 0.12)';
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

const DropdownHeader = styled.button.attrs(
  (props: { small?: boolean }) => props
)`
  ${tw`flex flex-row items-center justify-between`}
  background: transparent;
  padding: ${(props) =>
    props.small ? '12px 36px 12px 16px' : '16px 52px 16px 24px'};
  border: 1px solid ${DROPDOWN_HEADER_BORDER_COLOR};
  border-radius: 100px;
  white-space: nowrap;
`;

const DropdownList = styled.div.attrs(
  (props: { small?: boolean; flipDirection?: boolean }) => props
)`
  ${tw`flex flex-col`}
  position: absolute;
  ${(props) => (props.flipDirection ? 'left: 0px;' : 'right: 0px;')};
  z-index: 10;
  min-width: 100%;
  padding: ${(props) => (props.small ? '8px' : '12px')};
  gap: ${(props) => (props.small ? '4px' : '8px')};
  background-color: ${DROPDOWN_LIST_BG_COLOR};
  border-radius: 16px;
  border: 1px solid ${DROPDOWN_LIST_BORDER_COLOR};
  box-shadow: 0px 8px 32px 0px ${DROPDOWN_LIST_SHADOW_COLOR};
  &:not(.inverted) {
    top: calc(100% + 10px);
  }
  &.inverted {
    bottom: calc(100% + 10px);
  }
`;

const MultiDropdownList = styled(DropdownList)`
  box-sizing: content-box;
`;

const DropdownOptionContainer = styled.button`
  ${tw`w-full flex gap-2 items-center`}
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

const MultiDropdownOptionContainer = styled(DropdownOptionContainer)`
  ${tw`w-full flex flex-row items-center justify-start`}
  gap: 8px;
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
  icon?: string;
};

export type DropdownProps = {
  options: DropdownOption[];
  selectedOption: DropdownOption;
  onSelect: (option: DropdownOption) => void;
  placeAbove?: boolean;
  small?: boolean;
};

export function Dropdown(props: DropdownProps) {
  const { options, selectedOption, onSelect, placeAbove, small } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownHeader onClick={toggleList} small={small}>
        <div className='flex items-center gap-3'>
          {selectedOption.icon && (
            <div className='w-4 h-4 bg-white rounded-full'>
              <img className='w-4 h-4' src={selectedOption.icon} alt='' />
            </div>
          )}
          <Text size={small ? 'XS' : 'M'}>{selectedOption.label}</Text>
        </div>
        <img
          className={small ? 'w-4 absolute right-3' : 'w-5 absolute right-6'}
          src={isOpen ? DropdownArrowUp : DropdownArrowDown}
          alt=''
        />
      </DropdownHeader>
      {isOpen && (
        <DropdownList className={placeAbove ? 'inverted' : ''} small={small}>
          {options.map((option) => (
            <DropdownOptionContainer
              className={option.value === selectedOption.value ? 'active' : ''}
              key={option.value}
              onClick={() => selectItem(option)}
            >
              <div className='flex items-center gap-3'>
                {option.icon && (
                  <div className='w-4 h-4 bg-white rounded-full'>
                    <img className='w-4 h-4' src={option.icon} alt='' />
                  </div>
                )}
                <Text size={small ? 'XS' : 'M'}>{option.label}</Text>
              </div>
            </DropdownOptionContainer>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
}

export type DropdownWithPlaceholderProps = {
  options: DropdownOption[];
  selectedOption?: DropdownOption;
  onSelect: (option: DropdownOption) => void;
  placeholder: string;
  placeAbove?: boolean;
  small?: boolean;
}

export function DropdownWithPlaceholder(props: DropdownWithPlaceholderProps) {
  const { options, selectedOption, onSelect, placeholder, placeAbove, small } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownHeader onClick={toggleList}>
        <div className='flex items-center gap-3'>
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <div className='w-4 h-4 bg-white rounded-full'>
                  <img className='w-4 h-4' src={selectedOption.icon} alt='' />
                </div>
              )}
              <Text size={small ? 'XS' : 'M'}>{selectedOption.label}</Text>
            </>
          ) : (
            <Text size='M'>{placeholder}</Text>
          )}          
        </div>
        <img
          className={small ? 'w-4 absolute right-3' : 'w-5 absolute right-6'}
          src={isOpen ? DropdownArrowUp : DropdownArrowDown}
          alt=''
        />
      </DropdownHeader>
      {isOpen && (
        <DropdownList className={placeAbove ? 'inverted' : ''} small={small}>
          {options.map((option) => (
            <DropdownOptionContainer
              className={selectedOption && option.value === selectedOption.value ? 'active' : ''}
              key={option.value}
              onClick={() => selectItem(option)}
            >
              <div className='flex items-center gap-3'>
                {option.icon && (
                  <div className='w-4 h-4 bg-white rounded-full'>
                    <img className='w-4 h-4' src={option.icon} alt='' />
                  </div>
                )}
                <Text size={small ? 'XS' : 'M'}>{option.label}</Text>
              </div>
            </DropdownOptionContainer>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
}

export type DropdownWithPlaceholderValueOption = DropdownOption & {
  isDefault: boolean;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export type DropdownWithPlaceholderValueProps = {
  options: DropdownWithPlaceholderValueOption[];
  selectedOption: DropdownWithPlaceholderValueOption;
  onSelect: (option: DropdownWithPlaceholderValueOption) => void;
  placeholder: string;
};

export function DropdownWithPlaceholderValue(props: DropdownWithPlaceholderValueProps) {
  const { options, selectedOption, onSelect, placeholder } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (option: DropdownWithPlaceholderValueOption, index: number) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownHeader onClick={toggleList}>
        {selectedOption.Icon && <selectedOption.Icon width={24} height={24} className='mr-1' />}
        <Text size='M'>
          {selectedOption.isDefault ? placeholder : selectedOption.label}
        </Text>
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
              {option.Icon && <option.Icon width={24} height={24} />}
              <Text size='M'>{option.label}</Text>
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

type MultiDropdownBaseProps = {
  options: MultiDropdownOption[];
  activeOptions: MultiDropdownOption[];
  handleChange: (options: MultiDropdownOption[]) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  /*Use this to flip the side the dropdown list expand towards*/
  flipDirection?: boolean;
  DropdownButton: React.FC;
  SearchInput?: React.FC<{
    searchTerm: string;
    onSearch: (searchTerm: string) => void;
  }>;
};

function MultiDropdownBase(props: MultiDropdownBaseProps) {
  const {
    options,
    activeOptions,
    handleChange,
    isOpen,
    setIsOpen,
    flipDirection,
    DropdownButton,
    SearchInput,
  } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(
    dropdownRef,
    () => {
      setIsOpen(false);
    },
    isOpen
  );

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
    } else {
      updatedOptions = [...activeOptions, option];
    }
    handleChange(updatedOptions);
  };

  const handleSearch = (updatedSearchTerm: string) => {
    setSearchTerm(updatedSearchTerm);
  }

  const filteredOptions = options.filter(
    (option) => option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownWrapper ref={dropdownRef}>
      <DropdownButton />
      {isOpen && (
        <MultiDropdownList ref={dropdownRef} flipDirection={flipDirection}>
          {SearchInput && (
            <SearchInput searchTerm={searchTerm} onSearch={handleSearch} />
          )}
          {filteredOptions.map((option, index) => {
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
                <div className='flex-grow h-6'>
                  <Text size='M'>{label}</Text>
                </div>
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

export type MultiDropdownWithPlaceholderProps = {
  options: MultiDropdownOption[];
  activeOptions: MultiDropdownOption[];
  handleChange: (options: MultiDropdownOption[]) => void;
  placeholder: string;
  selectedText: string;
  flipDirection?: boolean;
  SearchInput?: React.FC<{
    searchTerm: string;
    onSearch: (searchTerm: string) => void;
  }>;
};

export function MultiDropdownWithPlaceholder(props: MultiDropdownWithPlaceholderProps) {
  const { options, activeOptions, handleChange, placeholder, selectedText, flipDirection, SearchInput } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  let dropdownLabel =
    activeOptions.length === options.length
      ? placeholder
      : `${selectedText} (${activeOptions.length})`;
  return MultiDropdownBase({
    options,
    activeOptions,
    handleChange,
    isOpen,
    setIsOpen,
    flipDirection,
    DropdownButton: () => (
      <DropdownHeader onClick={() => setIsOpen(!isOpen)}>
        <Text size='M'>{dropdownLabel}</Text>
        <img
          className='absolute right-6'
          src={isOpen ? DropdownArrowUp : DropdownArrowDown}
          alt=''
        />
      </DropdownHeader>
    ),
    SearchInput,
  });
}

export type MultiDropdownButtonProps = {
  options: MultiDropdownOption[];
  activeOptions: MultiDropdownOption[];
  handleChange: (options: MultiDropdownOption[]) => void;
  flipDirection?: boolean;
  DropdownButton: React.FC<{
    onClick: () => void;
  }>;
  SearchInput?: React.FC<{
    searchTerm: string;
    onSearch: (searchTerm: string) => void;
  }>;
}

export function MultiDropdownButton(props: MultiDropdownButtonProps) {
  const { options, activeOptions, handleChange, flipDirection, DropdownButton, SearchInput } = props;
  const [isOpen, setIsOpen] = useState(false);
  return MultiDropdownBase({
    options,
    activeOptions,
    handleChange,
    isOpen,
    setIsOpen,
    flipDirection,
    DropdownButton: () => (
      <DropdownButton onClick={() => setIsOpen(!isOpen)} />
    ),
    SearchInput,
  });
}