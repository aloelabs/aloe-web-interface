import React from 'react';
import { RoundedInput, RoundedInputWithIcon, SquareInput, SquareInputWithIcon, SquareInputWithMax } from '../components/common/Input';
import { ReactComponent as SearchIcon } from '../assets/svg/search.svg';

export default function InputExamplesPage() {
  const [largeRoundedInputValue, setLargeRoundedInputValue] = React.useState('');
  const [mediumRoundedInputValue, setMediumRoundedInputValue] = React.useState('');
  const [smallRoundedInputValue, setSmallRoundedInputValue] = React.useState('');
  const [largeRoundedInputWithIconValue, setLargeRoundedInputWithIconValue] = React.useState('');
  const [mediumRoundedInputWithIconValue, setMediumRoundedInputWithIconValue] = React.useState('');
  const [smallRoundedInputWithIconValue, setSmallRoundedInputWithIconValue] = React.useState('');
  const [largeSquareInputValue, setLargeSquareInputValue] = React.useState('');
  const [mediumSquareInputValue, setMediumSquareInputValue] = React.useState('');
  const [smallSquareInputValue, setSmallSquareInputValue] = React.useState('');
  const [largeSquareInputWithIconValue, setLargeSquareInputWithIconValue] = React.useState('');
  const [mediumSquareInputWithIconValue, setMediumSquareInputWithIconValue] = React.useState('');
  const [smallSquareInputWithIconValue, setSmallSquareInputWithIconValue] = React.useState('');
  const [largeSquareInputWithMaxValue, setLargeSquareInputWithMaxValue] = React.useState('');
  const [mediumSquareInputWithMaxValue, setMediumSquareInputWithMaxValue] = React.useState('');
  const [smallSquareInputWithMaxValue, setSmallSquareInputWithMaxValue] = React.useState('');
  return (
    <div className='flex flex-col gap-y-4 mt-8 mb-8'>
      <div className='flex flex-col gap-y-4 items-center'>
        <RoundedInput value={largeRoundedInputValue} onChange={(e) => setLargeRoundedInputValue(e.target.value)} size='L' placeholder='Label' disabled={true} />
        <RoundedInput value={mediumRoundedInputValue} onChange={(e) => setMediumRoundedInputValue(e.target.value)} size='M' placeholder='Label' />
        <RoundedInput value={smallRoundedInputValue} onChange={(e) => setSmallRoundedInputValue(e.target.value)} size='S' placeholder='Label' />
      </div>
      <div className='flex flex-col gap-y-4 items-center'>
        <RoundedInputWithIcon value={largeRoundedInputWithIconValue} onChange={(e) => setLargeRoundedInputWithIconValue(e.target.value)} size='L' Icon={<SearchIcon />} svgColorType='fill' placeholder='Label' disabled={true} />
        <RoundedInputWithIcon value={mediumRoundedInputWithIconValue} onChange={(e) => setMediumRoundedInputWithIconValue(e.target.value)} size='M' Icon={<SearchIcon />} svgColorType='fill' placeholder='Label' />
        <RoundedInputWithIcon value={smallRoundedInputWithIconValue} onChange={(e) => setSmallRoundedInputWithIconValue(e.target.value)} size='S' Icon={<SearchIcon />} svgColorType='fill' placeholder='Label' />
      </div>
      <div className='flex flex-col gap-y-4 items-center'>
        <SquareInput value={largeSquareInputValue} onChange={(e) => setLargeSquareInputValue(e.target.value)} size='L' placeholder='Label' />
        <SquareInput value={mediumSquareInputValue} onChange={(e) => setMediumSquareInputValue(e.target.value)} size='M' placeholder='Label' />
        <SquareInput value={smallSquareInputValue} onChange={(e) => setSmallSquareInputValue(e.target.value)} size='S' placeholder='Label' />
      </div>
      <div className='flex flex-col gap-y-4 items-center'>
        <SquareInputWithIcon value={largeSquareInputWithIconValue} onChange={(e) => setLargeSquareInputWithIconValue(e.target.value)} size='L' Icon={<SearchIcon />} svgColorType='fill' placeholder='Label' disabled={true} />
        <SquareInputWithIcon value={mediumSquareInputWithIconValue} onChange={(e) => setMediumSquareInputWithIconValue(e.target.value)} size='M' Icon={<SearchIcon />} svgColorType='fill' placeholder='Label' />
        <SquareInputWithIcon value={smallSquareInputWithIconValue} onChange={(e) => setSmallSquareInputWithIconValue(e.target.value)} size='S' Icon={<SearchIcon />} svgColorType='fill' placeholder='Label' />
      </div>
      <div className='flex flex-col gap-y-4 items-center'>
        <SquareInputWithMax value={largeSquareInputWithMaxValue} onChange={(e) => setLargeSquareInputWithMaxValue(e.target.value)} size='L' placeholder='Label' onMaxClick={() => setSmallSquareInputWithMaxValue('MAX')} disabled={true} />
        <SquareInputWithMax value={mediumSquareInputWithMaxValue} onChange={(e) => setMediumSquareInputWithMaxValue(e.target.value)} size='M' placeholder='Label' onMaxClick={() => setSmallSquareInputWithMaxValue('MAX')} />
        <SquareInputWithMax value={smallSquareInputWithMaxValue} onChange={(e) => setSmallSquareInputWithMaxValue(e.target.value)} size='S' placeholder='Label' onMaxClick={() => setSmallSquareInputWithMaxValue('MAX')} />
      </div>
    </div>
  );
}
