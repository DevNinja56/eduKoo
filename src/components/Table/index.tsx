import React, { ReactElement, memo, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import {
  ColumnLineWrapper,
  ColumnLineTextWrapper,
  Container,
  ContentCell,
  ContentRow,
  ContentWrapper,
  LineText,
  RowLineWrapper,
  RowLineText,
} from './styles';

interface Props {
  columnData: string[];
  rowData: string[];
  renderCellContent: (
    column: string,
    row: string,
    cIndex?: number,
    rIndex?: number,
  ) => ReactElement | null;
  columnWidth?: number;
  renderRowContent?: (column: string) => ReactElement | string;
  renderColumnContent?: (column: string) => ReactElement;
}

const Table: React.FC<Props> = props => {
  const {
    children,
    columnData,
    rowData,
    renderCellContent,
    columnWidth,
    renderRowContent,
    renderColumnContent,
  } = props;

  const ColumnLine = useMemo(() => {
    return (
      <ColumnLineWrapper columnWidth={columnWidth}>
        {columnData.map((it: string, index: number) => {
          if (renderColumnContent) {
            return renderColumnContent(it);
          }

          return (
            <ColumnLineTextWrapper key={index}>
              <LineText>{it}</LineText>
            </ColumnLineTextWrapper>
          );
        })}
      </ColumnLineWrapper>
    );
  }, []);

  const RowLine = useMemo(() => {
    return (
      <RowLineWrapper columnWidth={columnWidth}>
        {rowData.map((it: string, index: number) => {
          const rowContent = renderRowContent ? renderRowContent(it) : it;
          if (typeof rowContent !== 'string') {
            return rowContent;
          }
          return <RowLineText key={index}>{rowContent}</RowLineText>;
        })}
      </RowLineWrapper>
    );
  }, []);

  const Content = useMemo(() => {
    return (
      <ContentWrapper columnWidth={columnWidth}>
        {columnData.map((column: string, vIndex: number) => (
          <ContentRow key={vIndex}>
            {rowData.map((row: string, hIndex: number) => {
              return (
                <ContentCell key={hIndex}>
                  {renderCellContent(column, row, vIndex, hIndex)}
                </ContentCell>
              );
            })}
          </ContentRow>
        ))}
      </ContentWrapper>
    );
  }, []);

  return (
    <Container>
      {ColumnLine}
      <ScrollView
        bounces={false}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View>
          {RowLine}
          {Content}
          {children}
        </View>
      </ScrollView>
    </Container>
  );
};

export default memo(Table) as React.FC<Props>;
