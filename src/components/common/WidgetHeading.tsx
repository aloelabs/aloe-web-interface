import React from 'react';
import { Text } from './Typography';

export type WidgetHeadingProps = {
  children?: React.ReactNode;
};

export default function WidgetHeading(props: WidgetHeadingProps) {
  return (
    <Text size='L' weight='medium' color='rgba(255, 255, 255, 1)'>
      {props.children}
    </Text>
  );
}
