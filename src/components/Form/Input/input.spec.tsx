import React from 'react';
import { render } from '@testing-library/react-native';

import { ThemeProvider } from 'styled-components/native';
import theme from '../../../global/theme';

import { Input } from '.';

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    { children }
  </ThemeProvider>
);

describe('Input component', () => {
  it('should have specific border color when active', () => {
    const { getByTestId } = render(
      <Input
        testID='input-email'
        placeholder='E-mail'
        keyboardType='email-address'
        autoCorrect={false}
        active={true}
      />,
      {
        wrapper: Providers
      }
    );

    const inputComponent = getByTestId('input-email');

    expect(inputComponent.props.style[0].borderColor)
    .toEqual(theme.colors.attention);

    expect(inputComponent.props.style[0].borderWidth)
    .toEqual(3);
  });

  it('should have no borders when not active', () => {
    const { getByTestId } = render(
      <Input
        testID='input-email'
        placeholder='E-mail'
        keyboardType='email-address'
        autoCorrect={false}
        active={false}
      />,
      {
        wrapper: Providers
      }
    );

    const inputComponent = getByTestId('input-email');

    expect(inputComponent.props.style[0].borderColor)
    .toBeUndefined();

    expect(inputComponent.props.style[0].borderWidth)
    .toBeUndefined();
  });
})
