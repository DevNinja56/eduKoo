import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SkewableView } from '../../../../components';

import { ReactionText, styles } from './styles';

interface ReactionLabelProps {
  reaction: string;
  onPress?: (reaction: string) => void;
}

const ReactionLabel: React.FC<ReactionLabelProps> = props => {
  const { reaction, onPress } = props;

  const handlerOnPress = () => {
    if (onPress) {
      onPress(reaction);
    }
  };

  return (
    <TouchableOpacity style={styles.wrapper} onPress={handlerOnPress}>
      <SkewableView colors={['rgb(64,24,137)', 'rgb(79,21,151)']}>
        <ReactionText>{reaction}</ReactionText>
      </SkewableView>
    </TouchableOpacity>
  );
};

export default ReactionLabel;
