import styled from 'styled-components/native';

import { colors, metrics } from '../../../../styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  articleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 'auto',
    paddingVertical: metrics.spacing,
  },
  articleButtonText: {
    fontFamily: metrics.fontFamily.ptSansItalic,
    fontSize: metrics.fontSize.regular,
    color: colors.pink1,
    maxWidth: '85%',
    lineHeight: metrics.fontSize.regular * 1.25,
  },
  articleNumber: {
    color: colors.black,
    fontFamily: metrics.fontFamily.univiaProItalic,
  },
});

export const SearchWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${metrics.spacing}px;
  background-color: ${colors.blue2A};
`;

export const SearchButton = styled.TouchableOpacity`
  position: absolute;
  right: ${metrics.spacing}px;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
`;

export const SearchIcon = styled.Image`
  width: 20px;
  height: 20px;
  opacity: 0.6;
`;
