import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { colors, metrics } from '../../../../styles';

export const ReactionWrapper = styled.TouchableOpacity`
  margin-bottom: ${metrics.spacing * 0.5}px;
`;

export const ReactionText = styled.Text`
  font-size: ${metrics.fontSize.regular};
  font-family: ${metrics.fontFamily.univiaProItalic};
  color: ${colors.white};
  align-self: center;
  flex-shrink: 1;
`;

export const FullReaction = styled.View`
  margin-top: ${metrics.spacing * 1.5}px;
  padding: ${metrics.spacing * 1.2}px;
  background-color: ${colors.purple4A};
`;

export const styles = StyleSheet.create({
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: metrics.spacing,
  },
  reactionButtonText: {
    fontSize: metrics.fontSize.medium,
    fontFamily: metrics.fontFamily.univiaProItalic,
    padding: metrics.spacing * 0.3,
  },
  reactionButtonSkewContainer: {
    height: 'auto',
  },
  fullReactionButton: { width: '100%', marginTop: metrics.spacing * 0.5 },
});
