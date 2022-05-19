import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { MainContainer, Table } from '../../../components';
import tableOfSolubility from '../../../json/tableOfSolubility.json';
import { getAnions, getCations } from '../../../helpers/ions.service';
import { solubilityItemsOption } from '../constants';
import { CellText, CellWrapper, ColumnText, ColumnWrapper } from './styles';

const SolubilityTable: React.FC = () => {
  const { i18n } = useTranslation();

  const columnData = useMemo(
    () =>
      getAnions().map(
        ({ name, charge }) =>
          name.replace(/([0-9]+)/, '<sub>$1</sub>') +
          `<sup>${-1 * charge}-</sup>`,
      ),
    [],
  );

  const rowData = useMemo(
    () =>
      getCations().map(
        ({ name, charge }) =>
          name.replace(/([0-9]+)/, '<sub>$1</sub>') + `<sup>${charge}+</sup>`,
      ),
    [],
  );

  const renderColumnAndRowContent = (column: string) => {
    return (
      <ColumnWrapper key={column}>
        <ColumnText text={column} />
      </ColumnWrapper>
    );
  };

  const renderCellContent = (
    column: string,
    row: string,
    cIndex?: number,
    rIndex?: number,
  ) => {
    const val = tableOfSolubility[cIndex ?? 0][rIndex ?? 0];
    const options = solubilityItemsOption[val];
    const optionsColors = options
      ? options.colors
      : ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'];

    return (
      <CellWrapper key={column + row} colors={optionsColors}>
        <CellText isEmpty={!options}>
          {options ? options.name[i18n.language] : '-'}
        </CellText>
      </CellWrapper>
    );
  };

  return (
    <MainContainer showPreloader>
      <Table
        columnData={columnData}
        rowData={rowData}
        renderCellContent={renderCellContent}
        renderColumnContent={renderColumnAndRowContent}
        renderRowContent={renderColumnAndRowContent}
        columnWidth={75}
      />
    </MainContainer>
  );
};

export default SolubilityTable;
