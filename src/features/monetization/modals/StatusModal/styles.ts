import styled, { css } from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { metrics } from '../../../../styles';
import { Text, Button as UnstyledButton } from '../../../../components';

const errorStyles = {
  container: css`
    background-color: rgba(101, 24, 67, 0.9);
    border-color: #ff2087;
  `,
  titleWrapper: css`
    border-bottom-color: #bf3470;
  `,
  text: css`
    color: #ea599e;
  `,
};

export const Backdrop = styled(SafeAreaView)`
  height: 100%;
  padding: ${metrics.spacing * 0.5}px;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const Container = styled.View<{ isError: boolean }>`
  background-color: rgba(38, 117, 99, 0.9);
  border-color: rgb(178, 255, 237);
  border-width: 1px;

  ${({ isError }) => (isError ? errorStyles.container : '')};
`;

export const TitleWrapper = styled.View<{ isError: boolean }>`
  padding: ${metrics.spacing}px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: rgb(178, 255, 237);

  ${({ isError }) => (isError ? errorStyles.titleWrapper : '')}
`;

export const Title = styled(Text)<{ isError: boolean }>`
  font-size: ${metrics.fontSize.large}px;
  line-height: ${metrics.fontSize.large}px;
  color: rgb(178, 255, 237);

  ${({ isError }) => (isError ? errorStyles.text : '')}
`;

export const CloseIcon = styled.ImageBackground`
  height: 16px;
  width: 16px;
`;

export const DescriptionWrapper = styled.View`
  padding: ${metrics.spacing}px;
`;

export const Description = styled.Text<{ isError: boolean }>`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular}px;
  margin-bottom: ${metrics.spacing}px;
  color: rgb(178, 255, 237);

  ${({ isError }) => (isError ? errorStyles.text : '')}
`;

export const Button = styled(UnstyledButton)`
  width: 100%;
`;
