import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import AloeLogo from '../../assets/svg/aloe_capital_logo_no_border.svg';
import ConnectWalletButton from './ConnectWalletButton';

type MenuItem = {
  title: string;
  name: string;
  url: string;
};

const MenuItems: MenuItem[] = [
  {
    title: 'Blend',
    name: 'blend',
    url: '/blend',
  },
  {
    title: 'Portfolio',
    name: 'portfolio',
    url: '/portfolio',
  },
  // {
  //   title: 'Vote',
  //   name: 'governance',
  //   url: '/governance',
  // },
];

const StyledNavLink = styled(NavLink)`
  cursor: pointer;
  font-weight: 300;
  user-select: none;
  ${tw`text-grey-800`}
  &.active {
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.16) 0%,
      rgba(89, 214, 124, 0.16) 100%
    );
    font-weight: 500;
    border-bottom: 4px solid #59d67c;
    padding-top: 4px;
    ${tw`text-grey-1000`};
  }

  :hover:not(&.active) {
    ${tw`text-grey-900`};
  }
`;

const Nav = styled.nav`
  box-shadow: 0px 1px 0px #223645;
`;

export default function Header() {
  return (
    <Nav className='fixed top-0 left-0 right-0 z-10 flex items-center justify-between h-16 px-6 lg:px-20 bg-grey-25 border-b-2 border-b-grey-100'>
      <div className='flex flex-row align-middle items-center'>
        <a href='..' className='flex flex-row items-center justify-center'>
          <img src={AloeLogo} className='h-9 w-auto p-2' alt='' />
          {/* <span className='text-xl font-semibold'>Aloe</span> */}
        </a>
      </div>
      <div className='flex flex-row align-middle items-center h-full text-md'>
        {MenuItems.map((menuitem) => (
          <StyledNavLink
            id={`${menuitem.name}-nav-link`}
            to={menuitem.url}
            key={menuitem.name}
            className='w-28 h-full flex flex-row items-center justify-center'
          >
            {menuitem.title}
          </StyledNavLink>
        ))}
      </div>
      <div className='p-2'>
        <ConnectWalletButton />
      </div>
    </Nav>
  );
}
