import styled from 'styled-components/native';
import { PixelRatio } from 'react-native';

import { Text } from '../../../../components';
import { metrics } from '../../../../styles';

const size = PixelRatio.getPixelSizeForLayoutSize(20);

export const Wrapper = styled.TouchableOpacity`
  position: relative;
  height: ${metrics.height * 0.21}px;
  max-height: 165px;
  width: 50%;
  margin-bottom: ${metrics.spacing}px;
  align-items: center;
  justify-content: flex-end;
`;

export const Background = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  resize-mode: stretch;
`;

export const Icon = styled.Image`
  height: ${size}px;
  max-width: 100%;
  resize-mode: contain;
`;

export const Title = styled(Text)`
  width: 100%;
  align-self: flex-start;
  font-size: ${metrics.fontSize.small}px;
  line-height: ${metrics.fontSize.small * 1.4}px;
  margin-left: ${metrics.spacing * 2}px;
  margin-bottom: ${metrics.spacing * 1.5}px;
  margin-top: ${metrics.spacing * 0.9}px;
`;
