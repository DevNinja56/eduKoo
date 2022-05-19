/* eslint-disable react-native/no-inline-styles */

import React, { useMemo, useRef, useState } from 'react';
import { View, ViewStyle, LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  gradientStyle?: ViewStyle;
  skewAngle?: number;
  width?: number | string;
  height?: number | string;
  colors: string[];
  horizontal?: boolean;
}

const SkewableView: React.FC<Props> = props => {
  const {
    children,
    style,
    containerStyle,
    gradientStyle,
    skewAngle = 6,
    width,
    height,
    colors,
    horizontal = false,
  } = props;
  const ref = useRef(null);
  const [maskWidth, setMaskWidth] = useState(0);
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });
  const skew = useMemo(() => skewAngle / 57, [skewAngle]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout },
    } = event;

    const newWidth = Math.abs(
      Math.cos(skew) * (layout.width - layout.height * Math.tan(skew)),
    );

    setMaskWidth(newWidth);
    setElementSize({ width: layout.width, height: layout.height });
  };

  return (
    <View
      ref={ref}
      onLayout={handleLayout}
      style={[
        {
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          width,
          height,
        },
        style,
      ]}
    >
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          width: maskWidth,
          height: elementSize.width,
          transform: [{ rotateZ: `${skew}rad` }],
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: horizontal ? 1 : 0, y: horizontal ? 0 : 1 }}
          colors={colors}
          style={[
            {
              width: elementSize.width,
              height: elementSize.height,
              transform: [{ rotateZ: `${-skew}rad` }],
            },
            gradientStyle,
          ]}
        />
      </View>
      <View style={[{ width: '100%' }, containerStyle]}>{children}</View>
    </View>
  );
};

export default SkewableView;
