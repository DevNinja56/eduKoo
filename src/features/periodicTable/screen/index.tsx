import React, { useCallback, useMemo, useState } from 'react';

import closeIcon from '../../../assets/images/icons/close.png';
import table from '../../../json/table.json';
import { periods, groups } from '../../../json/groupsPeriods.json';
import { ElementData } from '../../../entities';
import { MainContainer, Table } from '../../../components';
import ElementModal from '../components/ElementModal';
import { HIDDEN_ELEMENTS } from '../constants';
import {
  HiddenElementsWrapper,
  CloseHidden,
  CloseHiddenTouchable,
} from './styles';
import TableElement from '../components/TableElement';
import CellElementData from '../components/CellElementData';

const PeriodicTable = () => {
  const [lanthanOpened, setLanthanOpened] = useState(false);
  const [actinOpened, setActinOpened] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{
    elementData: ElementData | null;
    colors: string[];
  }>({
    elementData: null,
    colors: [],
  });

  const handleRenderRowContent = useCallback((period: string) => {
    return period.slice(0, 3);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedElement({ elementData: null, colors: [] });
  }, []);

  const renderHiddenElements = (subclass: string) => {
    const elements = table.filter(
      (it: ElementData) => it.subclass?.ru === subclass,
    ) as ElementData[];
    const isLanthan = subclass === HIDDEN_ELEMENTS.LANTHAN;

    return (
      <HiddenElementsWrapper isLanthan={isLanthan}>
        <CloseHiddenTouchable
          onPress={() =>
            isLanthan ? setLanthanOpened(false) : setActinOpened(false)
          }
        >
          <CloseHidden source={closeIcon} />
        </CloseHiddenTouchable>
        {elements.map(it => (
          <CellElementData
            key={it.id}
            isHidden
            elementData={it}
            onPress={colors => setSelectedElement({ elementData: it, colors })}
          />
        ))}
      </HiddenElementsWrapper>
    );
  };

  const renderTableElement = useCallback((period: string, group: string) => {
    return (
      <TableElement
        group={group}
        period={period}
        openLanthan={() => setLanthanOpened(true)}
        openActin={() => setActinOpened(true)}
        onPress={setSelectedElement}
      />
    );
  }, []);

  const hiddenElements = useMemo(() => {
    return [
      lanthanOpened ? renderHiddenElements(HIDDEN_ELEMENTS.LANTHAN) : null,
      actinOpened ? renderHiddenElements(HIDDEN_ELEMENTS.ACTIN) : null,
    ];
  }, [lanthanOpened, actinOpened]);

  return (
    <MainContainer showPreloader>
      <Table
        columnData={periods}
        rowData={groups}
        renderCellContent={renderTableElement}
        renderRowContent={handleRenderRowContent}
        columnWidth={25}
      >
        {hiddenElements}
      </Table>
      {selectedElement.elementData && (
        <ElementModal
          onClosePress={handleCloseModal}
          elementData={selectedElement.elementData}
          colors={selectedElement.colors}
        />
      )}
    </MainContainer>
  );
};

export default PeriodicTable;
