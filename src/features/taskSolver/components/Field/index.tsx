import React from 'react';
import { TouchableOpacity } from 'react-native';

import deleteIcon from '../../../../assets/images/icons/delete.png';
import { Wrapper, DeleteIcon, FieldText } from './styles';

interface ButtonProps {
  text: string;
  style?: any;
  onDelete: () => void;
}

const Field: React.FC<ButtonProps> = props => {
  const { text, style, onDelete } = props;

  return (
    <Wrapper style={style}>
      <TouchableOpacity onPress={onDelete}>
        <DeleteIcon source={deleteIcon} />
      </TouchableOpacity>
      <FieldText text={text} />
    </Wrapper>
  );
};

export default Field;
