import styled from 'styled-components/native';

import { ColorElement, SubText } from '../../../components';
import { colors, metrics } from '../../../styles';

interface CellTextProps {
  isEmpty: boolean;
}

export const ColumnWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ColumnText = styled(SubText)`
  font-family: ${metrics.fontFamily.ptSans};
  color: ${colors.pink1};
  font-size: ${metrics.fontSize.regular * 0.9}px;
`;

export const CellWrapper = styled(ColorElement)`
  align-items: center;
  justify-content: center;
`;

export const CellText = styled.Text<CellTextProps>`
  font-family: ${metrics.fontFamily.univiaProItalic};
  color: ${({ isEmpty }) => (isEmpty ? colors.whiteA : colors.darkBlue)};
`;
