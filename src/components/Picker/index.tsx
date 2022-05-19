import React, { useMemo } from 'react';
import RNPickerSelect from 'react-native-picker-select';

import { colors } from '../../styles';
import downIcon from '../../assets/images/icons/down.png';
import { styles, Wrapper, SkewableView, Text, IconDown } from './styles';

interface Props {
  style?: any;
  textStyle?: any;
  skewContainerStyle?: any;
  bgColors?: string[];
  value: string;
  data: { label: string; value: string }[];
  onValueChange: (itemValue: string, itemIndex: number) => void;
  onDonePress?: () => void;
  onClose?: () => void;
}

const Picker: React.FC<Props> = props => {
  const {
    style,
    textStyle,
    skewContainerStyle,
    bgColors = [colors.blue1, colors.blue1],
    value,
    data,
    onValueChange,
    onDonePress,
    onClose,
  } = props;
  const selectedLabel = useMemo(
    () => data.find(it => it.value === value)!.label,
    [data, value],
  );

  return (
    <Wrapper style={style}>
      <RNPickerSelect
        style={{
          viewContainer: styles.picker,
          inputIOSContainer: styles.pickerIOSInputContainer,
        }}
        placeholder={{}}
        items={data}
        value={value}
        onValueChange={onValueChange}
        onDonePress={onDonePress}
        onClose={onClose}
      />
      <SkewableView
        colors={bgColors}
        containerStyle={{ ...styles.skewContainer, ...skewContainerStyle }}
      >
        <Text style={textStyle}>{selectedLabel}</Text>
        <IconDown source={downIcon} />
      </SkewableView>
    </Wrapper>
  );
};

export default Picker;
