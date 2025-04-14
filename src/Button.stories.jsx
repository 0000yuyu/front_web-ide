import React from 'react';
import {Button} from '@/Button'


export default {
  title: 'Components/Button',
  component: Button,
};

// Story 예시
export const Default = () => <Button label="Click me">클릭해주세요!</Button>;

export const WithAction = () => (
  <Button label="Click here" onClick={() => alert('Button clicked!')} />
);
