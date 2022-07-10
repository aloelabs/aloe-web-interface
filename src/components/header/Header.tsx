import { MenuIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import AloeLogo from '../../assets/svg/aloe_capital_nav_logo.svg';
import { RESPONSIVE_BREAKPOINTS } from '../../data/constants/Breakpoints';
import useMediaQuery from '../../data/hooks/UseMediaQuery';
import { Text } from '../common/Typography';
import ConnectWalletButton from './ConnectWalletButton';
import { IS_DEV } from '../../util/Env';

type MenuItem = {
  title: string;
  name: string;
  url: string;
};

const menuItems: MenuItem[] = [
  {
    title: 'Blend',
    name: 'blend',
    url: '/blend',
  },
];

if (IS_DEV) {
  menuItems.push(
    {
      title: 'Portfolio',
      name: 'portfolio',
      url: '/portfolio',
    },
    {
      title: 'Vote',
      name: 'governance',
      url: '/governance',
    },
  )
}

const StyledNavLink = styled(Text)`
  ${tw`px-8 py-5`}
  cursor: pointer;
  user-select: none;

  &.active {
    color: rgba(255, 255, 255, 1);
  }

  :hover:not(&.active) {
    ${tw`text-grey-900`};
  }

  &.mobile {
    border-bottom: 1px solid rgba(26, 41, 52, 1);
  }
`;

const Nav = styled.nav`
  ${tw`fixed top-0 left-0 right-0 flex items-center justify-between h-16`}
  border-bottom: 1px solid rgba(26, 41, 52, 1);
  background-color: rgba(6, 11, 15, 1);
  z-index: 40;
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 64px;
  background-color: rgba(26, 41, 52, 1);
`;

const NavDropdown = styled.div`
  ${tw`absolute flex flex-col items-center justify-center`}
  width: 100%;
  top: 64px;
  background-color: rgb(7, 14, 18);
`;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleNavDropdown = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isGTSmallScreen = useMediaQuery(RESPONSIVE_BREAKPOINTS.SM);
  return (
    <Nav>
      <div className='flex'>
        <div className='flex flex-row align-middle items-center px-8'>
          <a href='..' className='flex flex-row items-center justify-center'>
            <img src={AloeLogo} alt={"Aloe's Logo"} width={100} height={40} />
            {/* <span className='text-xl font-semibold'>Aloe</span> */}
          </a>
        </div>
        {isGTSmallScreen && (
          <>
            <VerticalDivider />
            <div className='flex flex-row align-middle items-center h-full text-md'>
              {menuItems.map((menuitem, index) => (
                <React.Fragment key={index}>
                  <StyledNavLink
                    size='M'
                    weight='medium'
                    color='rgba(75, 105, 128, 1)'
                    as={NavLink}
                    id={`${menuitem.name}-nav-link`}
                    to={menuitem.url}
                    key={menuitem.name}
                  >
                    {menuitem.title}
                  </StyledNavLink>
                  <VerticalDivider />
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
      {!isGTSmallScreen && (
        <button
          type='button'
          title='navigation'
          onClick={toggleNavDropdown}
          className='flex justify-center items-center w-10 h-10 mr-6'
        >
          <MenuIcon width={24} height={24} />
        </button>
      )}
      {!isGTSmallScreen && isMenuOpen && (
        <NavDropdown>
          {menuItems.map((menuitem, index) => (
            <React.Fragment key={index}>
              <StyledNavLink
                size='M'
                weight='medium'
                color='rgba(75, 105, 128, 1)'
                className='mobile w-full text-center'
                as={NavLink}
                id={`${menuitem.name}-nav-link`}
                to={menuitem.url}
                key={menuitem.name}
                onClick={toggleNavDropdown}
              >
                {menuitem.title}
              </StyledNavLink>
            </React.Fragment>
          ))}
          <div className='w-full'>
            <ConnectWalletButton buttonStyle='tertiary' />
          </div>
        </NavDropdown>
      )}
      {isGTSmallScreen && (
        <div className='mr-8'>
          <ConnectWalletButton />
        </div>
      )}
    </Nav>
  );
}
