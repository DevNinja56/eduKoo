import React from 'react';

import { ColorElement } from '../../../../components';
import { HIDDEN_ELEMENTS, TABLE } from '../../constants';
import tableColors from '../../../../json/tableColors.json';
import { ElementHiddenTitle, ElementTouchable } from '../../screen/styles';
import CellElementData from '../CellElementData';
import { ElementData } from '../../../../entities';

interface Props {
  group: string;
  period: string;
  openLanthan: () => void;
  openActin: () => void;
  onPress: (data: { elementData: ElementData; colors: string[] }) => void;
}

const TableElement: React.FC<Props> = props => {
  const { group, period, openActin, openLanthan, onPress } = props;
  const groupMain = group.slice(0, 3);
  const groupInfo = groupMain === '8 B' ? `.${group.slice(-2, -1)}` : '';
  const elementData = TABLE[`${period}.${groupMain}${groupInfo}`];

  if (!elementData) {
    return null;
  }

  const handlePress = (elementColors: string[]) => {
    onPress({ elementData, colors: elementColors });
  };

  return (
    (elementData.subclass?.ru === HIDDEN_ELEMENTS.LANTHAN && (
      <ColorElement colors={tableColors['Металлы.Лантаноиды']}>
        <ElementTouchable withBorder onPress={openLanthan}>
          <ElementHiddenTitle>57-71</ElementHiddenTitle>
        </ElementTouchable>
      </ColorElement>
    )) ||
    (elementData.subclass?.ru === HIDDEN_ELEMENTS.ACTIN && (
      <ColorElement colors={tableColors['Металлы.Актиноиды']}>
        <ElementTouchable withBorder onPress={openActin}>
          <ElementHiddenTitle>89-103</ElementHiddenTitle>
        </ElementTouchable>
      </ColorElement>
    )) || <CellElementData elementData={elementData} onPress={handlePress} />
  );
};

export default React.memo(TableElement);
