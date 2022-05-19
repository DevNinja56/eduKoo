import React from 'react';

import { ColorElement } from '../../../../components';
import tableColors from '../../../../json/tableColors.json';
import {
  ElementInfo,
  ElementNumber,
  ElementTitle,
  ElementTouchable,
} from '../../screen/styles';
import { ElementData } from '../../../../entities';
import { useTranslation } from 'react-i18next';

interface Props {
  elementData: ElementData;
  onPress: (elementColors: string[]) => void;
  isHidden?: boolean;
}

const CellElementData: React.FC<Props> = props => {
  const { elementData, onPress, isHidden } = props;
  const { i18n } = useTranslation();
  const {
    class: elementClass,
    subclass,
    element,
    id,
    atomMass,
    name,
  } = elementData;
  const elementFullClass =
    elementClass.ru + (subclass ? `.${subclass.ru}` : '');
  const elementColors = tableColors[elementFullClass];

  const handleElementPress = () => {
    onPress(elementColors);
  };

  return (
    <ColorElement key={id} colors={elementColors}>
      <ElementTouchable onPress={handleElementPress} withBorder={isHidden}>
        <ElementNumber isHidden={isHidden}>{id}</ElementNumber>
        <ElementTitle isHidden={isHidden}>{element}</ElementTitle>
        <ElementInfo isHidden={isHidden}>{name[i18n.language]}</ElementInfo>
        <ElementInfo isHidden={isHidden}>{atomMass}</ElementInfo>
      </ElementTouchable>
    </ColorElement>
  );
};

export default React.memo(CellElementData);
