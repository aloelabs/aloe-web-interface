import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import DiscordFooterIcon from '../../assets/svg/discord_footer.svg';
import TwitterFooterIcon from '../../assets/svg/twitter_footer.svg';
import MediumFooterIcon from '../../assets/svg/medium_footer.svg';
import { Text } from './Typography';
import { RESPONSIVE_BREAKPOINT_SM } from '../../data/constants/Breakpoints';

const FOOTER_LINK_TEXT_COLOR = 'rgba(75, 105, 128, 1)';

const StyledFooter = styled.footer`
  ${tw`fixed bottom-0 left-0 right-0 flex flex-row items-center justify-between`}
  min-height: 60px;
  background-color: rgba(6, 11, 15, 1);
  border-top: 1px solid rgba(18, 29, 37, 1);
  padding-left: 188px;
  padding-right: 180px;
  z-index: 40;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const FooterLink = styled(Text)`
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 12px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: rgba(34, 54, 69, 1);
`;

export default function Footer() {
  return (
    <StyledFooter>
      <div className='flex flex-row items-center'>
        <FooterLink
          as='a'
          size='S'
          weight='medium'
          color={FOOTER_LINK_TEXT_COLOR}
          href={'https://aloe.capital/'}
          target='_blank'
          rel='noopener noreferrer'
        >
          Main site
        </FooterLink>
        <VerticalDivider />
        <FooterLink
          as='a'
          size='S'
          weight='medium'
          color={FOOTER_LINK_TEXT_COLOR}
          href={'https://docs.aloe.capital/'}
          target='_blank'
          rel='noopener noreferrer'
        >
          Docs
        </FooterLink>
        <VerticalDivider />
        <FooterLink
          as='a'
          size='S'
          weight='medium'
          color={FOOTER_LINK_TEXT_COLOR}
          href={'/terms.pdf'}
          target='_blank'
          rel='noopener noreferrer'
        >
          Terms
        </FooterLink>
      </div>
      <div className='flex flex-row items-center gap-x-6'>
        <a
          href={'https://discord.com/invite/gpt4sUv6sw'}
          target='_blank'
          rel='noopener noreferrer'
          title='Join our Discord'
        >
          <img src={DiscordFooterIcon} alt='Discord Icon' width={14} height={11} />
        </a>
        <a
          href={'https://discord.com/invite/gpt4sUv6sw'}
          target='_blank'
          rel='noopener noreferrer'
          title='Follow us on Twitter'
        >
          <img src={TwitterFooterIcon} alt='Twitter Icon' width={15} height={11} />
        </a>
        <a
          href={'https://discord.com/invite/gpt4sUv6sw'}
          target='_blank'
          rel='noopener noreferrer'
          title='Connect with us on Medium'
        >
          <img src={MediumFooterIcon} alt='Medium Icon' width={21} height={11} />
        </a>
      </div>
    </StyledFooter>
  );
}
