import React from 'react';

export default function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 right-0 z-40 flex flex-row items-center justify-between h-12 min-h-12 px-6 lg:px-20 bg-grey-25 border-t-2 border-t-grey-100 text-xs'>
      <div className='flex flex-row space-x-8 text-grey-700'>
        <a
          href={'https://docs.aloe.capital'}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-grey-1000'
        >
          Docs
        </a>
        <a
          href={'/terms.pdf'}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-grey-1000'
        >
          Terms
        </a>
        <a
          href={'/privacy.pdf'}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-grey-1000'
        >
          Privacy
        </a>
        <a
          href='https://github.com/aloelabs/aloe-blend/blob/master/audits/aloe_1.1_signed.pdf'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-grey-1000'
        >
          Audit
        </a>
      </div>
      <div className='flex flex-row text-grey-900 items-center justify-between divide-x divide-x-2 divide-grey-600'>
        <a
          className='text-center px-2'
          href={'https://aloelabs.medium.com/'}
          target='_blank'
          rel='noopener noreferrer'
        >
          blog
        </a>
        <a
          className='text-center px-2 hover:text-grey-1000'
          href={'https://twitter.com/AloeCapital'}
          target='_blank'
          rel='noopener noreferrer'
        >
          twitter
        </a>
        <a
          className='text-center px-2 hover:text-grey-1000'
          href={'https://discord.com/invite/gpt4sUv6sw'}
          target='_blank'
          rel='noopener noreferrer'
        >
          discord
        </a>
      </div>
    </footer>
  );
}
