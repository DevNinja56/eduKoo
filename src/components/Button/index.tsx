import React from 'react';
import {
  Image,
  ImageSourcePropType,
  TouchableOpacityProps,
} from 'react-native';

import { colors } from '../../styles';
import SkewableView from '../SkewableView';
import { styles, Touchable, Text } from './styles';

interface Props extends TouchableOpacityProps {
  style?: any;
  textStyle?: any;
  skewContainerStyle?: any;
  bgColors?: string[];
  icon?: ImageSourcePropType;
  iconStyle?: any;
  additionalText?: string;
  additionalTextStyle?: any;
}

const Button: React.FC<Props> = props => {
  const {
    children,
    style,
    textStyle,
    skewContainerStyle,
    bgColors = [colors.peach, colors.peach1, colors.peach2],
    icon,
    iconStyle,
    additionalText,
    additionalTextStyle,
    ...buttonProps
  } = props;

  return (
    <Touchable style={style} active={!buttonProps.disabled} {...buttonProps}>
      <SkewableView
        containerStyle={{ ...styles.skewContainer, ...skewContainerStyle }}
        colors={bgColors}
        horizontal
      >
        <Text style={textStyle}>{children}</Text>
        {additionalText ? (
          <Text style={additionalTextStyle}>{additionalText}</Text>
        ) : null}
        {icon ? <Image source={icon} style={iconStyle} /> : null}
      </SkewableView>
    </Touchable>
  );
};

export default Button;
