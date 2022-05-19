import React from 'react';

import { colors } from '../../styles';
import { styles, Wrapper, TextInput } from './styles';

interface Props {
  style?: any;
  bgColors?: string[];
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onSubmitEditing?: () => void;
}

const Input: React.FC<Props> = props => {
  const {
    style,
    bgColors = [colors.blue2, colors.blue2],
    placeholder,
    value,
    onChangeText,
    onSubmitEditing,
  } = props;

  return (
    <Wrapper
      style={style}
      colors={bgColors}
      containerStyle={styles.skewContainer}
    >
      <TextInput
        placeholderTextColor={colors.pink1}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </Wrapper>
  );
};

export default Input;
