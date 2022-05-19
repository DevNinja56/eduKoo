import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { Svg, Polygon } from 'react-native-svg';

const PolygonAnimated = Animated.createAnimatedComponent(Polygon);

interface Props {
  style?: any;
  size?: number;
}

const Preloader: React.FC<Props> = props => {
  const { style, size = 100 } = props;
  const strokeDashoffsetAnim = useRef(new Animated.Value(258)).current;

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(strokeDashoffsetAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
        easing: Easing.linear,
      }),
    ).start();
  };

  useEffect(() => {
    startAnimation();
  });

  return (
    <View style={style}>
      <Svg x="0px" y="0px" width={size} height={size} viewBox="0 0 100 100">
        <PolygonAnimated
          points="92.5,50.083 71.219,86.776 28.803,86.692 7.667,49.917 28.947,13.224 71.364,13.308"
          fill="none"
          stroke="#ff5a91"
          strokeWidth="3px"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="215 50"
          strokeDashoffset={strokeDashoffsetAnim}
        />
      </Svg>
    </View>
  );
};

export default Preloader;
