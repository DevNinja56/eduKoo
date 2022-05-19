import React from 'react';
import { Modal } from 'react-native';

import Preloader from '../Preloader';
import { ContentWrapper } from './styles';

interface Props {
  style?: any;
  visible: boolean;
}

const PreloaderModal: React.FC<Props> = props => {
  const { style, visible } = props;

  return (
    <Modal visible={visible} transparent>
      <ContentWrapper style={style}>
        <Preloader />
      </ContentWrapper>
    </Modal>
  );
};

export default PreloaderModal;
