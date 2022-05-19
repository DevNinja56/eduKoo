import React, { useEffect, useMemo, useState } from 'react';
import { Text, TextProps, TextStyle, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { metrics } from '../../styles';
import { SUB_SUP_EXP } from './constants';

interface Props extends TextProps {
  text: string;
  style?: TextStyle;
  subSize?: number;
}

const SubText: React.FC<Props> = props => {
  const { style, text, subSize } = props;
  const { t, i18n } = useTranslation();
  const fontSize = useMemo(() => style?.fontSize || metrics.fontSize.regular, [
    style,
  ]);
  const subOffset = useMemo(() => fontSize * 0.75, [fontSize]);
  const subSubOffset = useMemo(() => subOffset * 0.75, [subOffset]);

  // Need custom re-render to display sup, sub correctly, after update text
  // Need to think about how to solve this
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (hidden) {
      setTimeout(() => {
        setHidden(false);
      }, 0);
    }
  }, [hidden]);

  useEffect(() => {
    setHidden(true);
  }, [text]);

  const renderText = () => {
    return text.split(SUB_SUP_EXP).map((it, index) => {
      const isSup = text.includes(`<sup>${it}</sup>`);

      if (text.includes(`<sub>${it}</sub>`) && index % 2 === 0) {
        return (
          <View
            key={index}
            style={{
              height: subSubOffset * 0.3,
            }}
          >
            <Text
              style={[
                style,
                {
                  fontSize: subSubOffset,
                  lineHeight: subSubOffset,
                  height: fontSize,
                },
              ]}
            >
              {i18n.exists(`${it}`) ? t(`${it}`) : it}
            </Text>
          </View>
        );
      }

      if (index % 2 === 0) {
        return it;
      } else {
        return (
          <View
            key={index}
            style={{
              // fontSize + 2: fixed display sup text on low resolution
              height: isSup ? fontSize + 2 : fontSize * 0.4,
            }}
          >
            <Text
              style={[
                style,
                {
                  fontSize: subSize || subOffset,
                  lineHeight: subSize || subOffset,
                  height: fontSize,
                },
              ]}
            >
              {i18n.exists(`${it}`) ? t(`${it}`) : it}
            </Text>
          </View>
        );
      }
    });
  };
  // custom re-render
  return <Text style={style}>{!hidden && renderText()}</Text>;
};

export default SubText;
