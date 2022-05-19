import React from 'react';
import { TouchableOpacity, Modal } from 'react-native';

import closeIcon from '../../../../assets/images/icons/close.png';
import {
  Backdrop,
  Container,
  CloseIcon,
  TitleWrapper,
  DescriptionWrapper,
  Description,
  Button,
  Title,
} from './styles';

export type StatusDataType = { title: string; text: string; isError?: boolean };

interface Props {
  onClose: () => void;
  data: StatusDataType;
}

const StatusModal: React.FC<Props> = props => {
  const { onClose, data } = props;
  const { title, text, isError = false } = data;

  return (
    <Modal transparent>
      <Backdrop>
        <Container isError={isError}>
          <TitleWrapper isError={isError}>
            <Title isError={isError}>{title}</Title>
            <TouchableOpacity onPress={onClose}>
              <CloseIcon source={closeIcon} />
            </TouchableOpacity>
          </TitleWrapper>
          <DescriptionWrapper>
            <Description isError={isError}>{text}</Description>
            <Button
              onPress={onClose}
              textStyle={{
                color: isError ? '#ea599e' : 'rgb(178, 255, 237)',
              }}
              bgColors={
                isError
                  ? ['rgba(134, 42, 86, 0.79)', 'rgba(134, 42, 86, 0.79)']
                  : ['rgba(53, 162, 142, 0.79)', 'rgba(53, 162, 142, 0.79)']
              }
            >
              OK
            </Button>
          </DescriptionWrapper>
        </Container>
      </Backdrop>
    </Modal>
  );
};

export default StatusModal;
