import React from 'react';
import { FilledGradientButton, FilledGreyButton, OutlinedGradientButton, OutlinedWhiteButton, FilledStylizedButton, OutlinedGradientRoundedButton, FilledGradientButtonWithIcon, FilledGreyButtonWithIcon, OutlinedGradientButtonWithIcon, OutlinedWhiteButtonWithIcon, FilledStylizedButtonWithIcon, OutlinedGradientRoundedButtonWithIcon } from '../components/common/Buttons';
import { ReactComponent as MigrateIcon } from '../assets/svg/migrate.svg';

export default function ButtonExamplesPage() {
  return (
    <div className='p-8'>
      <div className='grid grid-cols-6 gap-8 items-end'>
        <FilledGradientButton size='L'>Label</FilledGradientButton>
        <FilledGradientButton size='M'>Label</FilledGradientButton>
        <FilledGradientButton size='S'>Label</FilledGradientButton>
        <FilledGreyButton size='L'>Label</FilledGreyButton>
        <FilledGreyButton size='M'>Label</FilledGreyButton>
        <FilledGreyButton size='S'>Label</FilledGreyButton>
        <OutlinedGradientButton size='L'>Label</OutlinedGradientButton>
        <OutlinedGradientButton size='M'>Label</OutlinedGradientButton>
        <OutlinedGradientButton size='S'>Label</OutlinedGradientButton>
        <OutlinedWhiteButton size='L'>Label</OutlinedWhiteButton>
        <OutlinedWhiteButton size='M'>Label</OutlinedWhiteButton>
        <OutlinedWhiteButton size='S'>Label</OutlinedWhiteButton>
        <FilledStylizedButton size='L'>Label</FilledStylizedButton>
        <FilledStylizedButton size='M'>Label</FilledStylizedButton>
        <FilledStylizedButton size='S'>Label</FilledStylizedButton>
        <OutlinedGradientRoundedButton size='L'>Label</OutlinedGradientRoundedButton>
        <OutlinedGradientRoundedButton size='M'>Label</OutlinedGradientRoundedButton>
        <OutlinedGradientRoundedButton size='S'>Label</OutlinedGradientRoundedButton>
        <FilledGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledGradientButtonWithIcon>
        <FilledGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledGradientButtonWithIcon>
        <FilledGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledGradientButtonWithIcon>
        <FilledGreyButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledGreyButtonWithIcon>
        <FilledGreyButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledGreyButtonWithIcon>
        <FilledGreyButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledGreyButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</OutlinedWhiteButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</OutlinedWhiteButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</OutlinedWhiteButtonWithIcon>
        <FilledStylizedButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledStylizedButtonWithIcon>
        <FilledStylizedButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledStylizedButtonWithIcon>
        <FilledStylizedButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill'>Label</FilledStylizedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientRoundedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientRoundedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientRoundedButtonWithIcon>
        <FilledGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledGradientButtonWithIcon>
        <FilledGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledGradientButtonWithIcon>
        <FilledGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledGradientButtonWithIcon>
        <FilledGreyButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledGreyButtonWithIcon>
        <FilledGreyButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledGreyButtonWithIcon>
        <FilledGreyButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledGreyButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</OutlinedWhiteButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</OutlinedWhiteButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</OutlinedWhiteButtonWithIcon>
        <FilledStylizedButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledStylizedButtonWithIcon>
        <FilledStylizedButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledStylizedButtonWithIcon>
        <FilledStylizedButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill'>Label</FilledStylizedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientRoundedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientRoundedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient'>Label</OutlinedGradientRoundedButtonWithIcon>
        <FilledGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <FilledGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <FilledGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <FilledGreyButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <FilledGreyButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <FilledGreyButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <OutlinedGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' />
        <OutlinedGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' />
        <OutlinedGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' />
        <OutlinedWhiteButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <OutlinedWhiteButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <OutlinedWhiteButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <FilledStylizedButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <FilledStylizedButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <FilledStylizedButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' />
        <OutlinedGradientRoundedButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' />
        <OutlinedGradientRoundedButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' />
        <OutlinedGradientRoundedButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' />
      </div>
      <div className='grid grid-cols-6 gap-8 items-end mt-16'>
        <FilledGradientButton size='L' disabled>Label</FilledGradientButton>
        <FilledGradientButton size='M' disabled>Label</FilledGradientButton>
        <FilledGradientButton size='S' disabled>Label</FilledGradientButton>
        <FilledGreyButton size='L' disabled>Label</FilledGreyButton>
        <FilledGreyButton size='M' disabled>Label</FilledGreyButton>
        <FilledGreyButton size='S' disabled>Label</FilledGreyButton>
        <OutlinedGradientButton size='L' disabled>Label</OutlinedGradientButton>
        <OutlinedGradientButton size='M' disabled>Label</OutlinedGradientButton>
        <OutlinedGradientButton size='S' disabled>Label</OutlinedGradientButton>
        <OutlinedWhiteButton size='L' disabled>Label</OutlinedWhiteButton>
        <OutlinedWhiteButton size='M' disabled>Label</OutlinedWhiteButton>
        <OutlinedWhiteButton size='S' disabled>Label</OutlinedWhiteButton>
        <FilledStylizedButton size='L' disabled>Label</FilledStylizedButton>
        <FilledStylizedButton size='M' disabled>Label</FilledStylizedButton>
        <FilledStylizedButton size='S' disabled>Label</FilledStylizedButton>
        <OutlinedGradientRoundedButton size='L' disabled>Label</OutlinedGradientRoundedButton>
        <OutlinedGradientRoundedButton size='M' disabled>Label</OutlinedGradientRoundedButton>
        <OutlinedGradientRoundedButton size='S' disabled>Label</OutlinedGradientRoundedButton>
        <FilledGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledGradientButtonWithIcon>
        <FilledGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledGradientButtonWithIcon>
        <FilledGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledGradientButtonWithIcon>
        <FilledGreyButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledGreyButtonWithIcon>
        <FilledGreyButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledGreyButtonWithIcon>
        <FilledGreyButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledGreyButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</OutlinedWhiteButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</OutlinedWhiteButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</OutlinedWhiteButtonWithIcon>
        <FilledStylizedButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledStylizedButtonWithIcon>
        <FilledStylizedButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledStylizedButtonWithIcon>
        <FilledStylizedButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill' disabled>Label</FilledStylizedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='L' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientRoundedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='M' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientRoundedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='S' Icon={<MigrateIcon />} position='leading' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientRoundedButtonWithIcon>
        <FilledGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledGradientButtonWithIcon>
        <FilledGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledGradientButtonWithIcon>
        <FilledGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledGradientButtonWithIcon>
        <FilledGreyButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledGreyButtonWithIcon>
        <FilledGreyButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledGreyButtonWithIcon>
        <FilledGreyButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledGreyButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientButtonWithIcon>
        <OutlinedGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</OutlinedWhiteButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</OutlinedWhiteButtonWithIcon>
        <OutlinedWhiteButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</OutlinedWhiteButtonWithIcon>
        <FilledStylizedButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledStylizedButtonWithIcon>
        <FilledStylizedButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledStylizedButtonWithIcon>
        <FilledStylizedButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' disabled>Label</FilledStylizedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='L' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientRoundedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='M' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientRoundedButtonWithIcon>
        <OutlinedGradientRoundedButtonWithIcon size='S' Icon={<MigrateIcon />} position='trailing' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled>Label</OutlinedGradientRoundedButtonWithIcon>
        <FilledGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <FilledGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <FilledGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <FilledGreyButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <FilledGreyButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <FilledGreyButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <OutlinedGradientButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled />
        <OutlinedGradientButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled />
        <OutlinedGradientButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled />
        <OutlinedWhiteButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <OutlinedWhiteButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <OutlinedWhiteButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <FilledStylizedButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <FilledStylizedButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <FilledStylizedButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' disabled />
        <OutlinedGradientRoundedButtonWithIcon size='L' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled />
        <OutlinedGradientRoundedButtonWithIcon size='M' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled />
        <OutlinedGradientRoundedButtonWithIcon size='S' Icon={<MigrateIcon />} position='center' svgColorType='fill' activeGradientId='#migrate-icon-gradient' disabled />
      </div>
    </div>
  );
}
