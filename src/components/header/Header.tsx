import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import AloeLogo from '../../assets/svg/aloe_capital_nav_logo.svg';
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
  ${tw`px-8 py-5`}
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(75, 105, 128, 1);
  cursor: pointer;
  user-select: none;

  &.active {
    color: rgba(255, 255, 255, 1);
  }
  /* &.active {
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.16) 0%,
      rgba(89, 214, 124, 0.16) 100%
    );
    font-weight: 500;
    border-bottom: 4px solid #59d67c;
    padding-top: 4px;
    ${tw`text-grey-1000`};
  } */

  :hover:not(&.active) {
    ${tw`text-grey-900`};
  }
`;

const Nav = styled.nav`
  ${tw`fixed top-0 left-0 right-0 z-10 flex items-center justify-between h-16`}
  border-bottom: 1px solid rgba(26, 41, 52, 1);
  background-color: rgba(6, 11, 15, 1);
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 64px;
  background-color: rgba(26, 41, 52, 1);
`;

export default function Header() {
  return (
    <Nav>
      <div className='flex'>
        <div className='flex flex-row align-middle items-center px-8'>
          <a href='..' className='flex flex-row items-center justify-center'>
            <img src={AloeLogo} alt={'Aloe\'s Logo'} width={100} height={40} />
            {/* <span className='text-xl font-semibold'>Aloe</span> */}
          </a>
        </div>
        <VerticalDivider />
        <div className='flex flex-row align-middle items-center h-full text-md'>
          {MenuItems.map((menuitem) => (
            <>
              <StyledNavLink
                id={`${menuitem.name}-nav-link`}
                to={menuitem.url}
                key={menuitem.name}
              >
                {menuitem.title}
              </StyledNavLink>
              <VerticalDivider />
            </>
          ))}
        </div>
      </div>
      <div className='mr-8'>
        <ConnectWalletButton />
      </div>
    </Nav>
  );
}
