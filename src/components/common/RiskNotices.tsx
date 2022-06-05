import React, { useState } from 'react';
import WarningIcon from '../../assets/svg/warning.svg';
import { WarningButtonWithIcon } from './Buttons';
import WidgetHeading from './WidgetHeading';
import { CloseableModal } from './Modal';

export default function RiskNotices() {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex flex-row items-center justify-center'>
      <WarningButtonWithIcon
        icon={WarningIcon}
        name='See Risks'
        onClick={() => setOpen(!open)}
      >
        See Risks
      </WarningButtonWithIcon>
      <CloseableModal open={open} setOpen={setOpen} title='Risks'>
        <p>
          NOTE: This is not an exhaustive list! Please do your own research
          before depositing, and never deposit more than you can afford to lose.
        </p>
        <WidgetHeading>Execution Risk</WidgetHeading>
        <p>
          Though Aloe Blend has been{' '}
          <a
            href='https://github.com/aloelabs/aloe-blend/blob/master/audits/aloe_1.1_signed.pdf'
            target='_blank'
            rel='noopener noreferrer'
            className='underline'
          >
            audited
          </a>
          , there’s always a chance that something goes wrong. The contract code
          is immutable, and there is no failsafe by which Aloe Labs or anyone
          else can pause execution.
        </p>
        <WidgetHeading>Base Protocol Risk</WidgetHeading>
        <p>
          The underlying protocols (Uniswap and protocols used in silos) present
          risk from both their code and the potential for deleterious governance
          action.
        </p>
        <WidgetHeading>Impermanent Loss</WidgetHeading>
        <p>
          This vault is subject to similar impermanent loss as a standard
          Uniswap V2 position.
        </p>
      </CloseableModal>
    </div>
  );
}
