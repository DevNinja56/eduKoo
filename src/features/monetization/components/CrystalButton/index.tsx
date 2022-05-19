import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { colors } from '../../../../styles';
import { SkewableView } from '../../../../components';
import crystalIcon from '../../../../assets/images/icons/crystal.png';
import biohazardIcon from '../../../../assets/images/icons/biohazard.png';

import {
  Container,
  CrystalIcon,
  BiohazardIcon,
  SkewableContainer,
  Text,
  styles,
} from './styles';

interface Props extends TouchableOpacityProps {
  isProActive: boolean;
  crystalAmount: number;
}

const CrystalButton: React.FC<Props> = props => {
  const { isProActive, crystalAmount, onPress } = props;

  return isProActive ? (
    <Container onPress={onPress}>
      <BiohazardIcon source={biohazardIcon} />
      <SkewableContainer>
        <SkewableView
          colors={[colors.crystalRed1, colors.crystalRed2]}
          style={styles.skewableOne}
        >
          <Text>PRO</Text>
        </SkewableView>
      </SkewableContainer>
    </Container>
  ) : (
    <Container onPress={onPress}>
      <CrystalIcon source={crystalIcon} />
      <SkewableContainer>
        <SkewableView
          colors={[colors.crystalRed1, colors.crystalRed2]}
          style={styles.skewableFirst}
        >
          <Text>{crystalAmount}</Text>
        </SkewableView>
        <SkewableView
          colors={[colors.crystalRed1, colors.crystalRed3]}
          style={styles.skewableSecond}
        >
          <Text>+</Text>
        </SkewableView>
      </SkewableContainer>
    </Container>
  );
};

export default CrystalButton;
