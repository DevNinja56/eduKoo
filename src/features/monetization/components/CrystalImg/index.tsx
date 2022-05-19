import React from 'react';
import { SkewableView } from '../../../../components';
import crystalIcon from '../../../../assets/images/icons/crystal.png';
import crystalWhiteIcon from '../../../../assets/images/icons/crystal_white.png';
import {
  CrystalContainer,
  CrystalIcon,
  CrystalSkewableContainer,
  CrystalText,
  CrystalTextWhite,
  styles,
} from './styles';
import { colors } from '../../../../styles';

interface CrystalImgProps {
  isWhite: boolean;
  title: string;
}

const CrystalImg: React.FC<CrystalImgProps> = props => {
  return props.isWhite ? (
    <CrystalContainer>
      <CrystalIcon source={crystalWhiteIcon} />
      <CrystalSkewableContainer>
        <SkewableView
          colors={[colors.crystalPurple, colors.crystalPurple]}
          style={styles.crystalSkewable}
        >
          <CrystalTextWhite>{props.title}</CrystalTextWhite>
        </SkewableView>
      </CrystalSkewableContainer>
    </CrystalContainer>
  ) : (
    <CrystalContainer>
      <CrystalIcon source={crystalIcon} />
      <CrystalSkewableContainer>
        <SkewableView
          colors={[colors.crystalRed1, colors.crystalRed2]}
          style={styles.crystalSkewable}
        >
          <CrystalText>{props.title}</CrystalText>
        </SkewableView>
      </CrystalSkewableContainer>
    </CrystalContainer>
  );
};

export default CrystalImg;
