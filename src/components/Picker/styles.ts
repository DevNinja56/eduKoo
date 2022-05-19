import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';

import { metrics } from '../../styles';
import UnstyledSkewableView from '../SkewableView';
import UnstyledText from '../Text';

export const styles = StyleSheet.create({
  skewContainer: {
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: metrics.spacing,
  },
  picker: {
    position: 'absolute',
    zIndex: 99,
    height: 34,
    width: '100%',
    opacity: 0,
  },
  pickerIOSInputContainer: {
    height: 34,
  },
});

export const Wrapper = styled.View`
  position: relative;
`;

export const SkewableView = styled(UnstyledSkewableView)`
  margin-right: ${metrics.spacing * -0.25}px;
`;

export const Text = styled(UnstyledText)`
  line-height: ${metrics.fontSize.medium}px;
  margin-right: ${metrics.spacing * 1.2}px;
`;

export const IconDown = styled(Image)`
  position: absolute;
  right: ${metrics.spacing}px;
  width: 10px;
  height: 10px;
`;
