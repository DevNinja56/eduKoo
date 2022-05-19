import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import closeIcon from '../../../../assets/images/icons/close.png';
import { Button } from '../../../../components';
import {
  Wrapper,
  Title,
  Condition,
  ReactionWrapper,
  ReactionText,
  Header,
  Footer,
  Body,
  Example,
  CloseIcon,
} from './styles';

interface ConditionsModalProps {
  title: string;
  examples: {
    condition: string;
    reaction: string;
    label: JSX.Element;
  }[];
  onClose: () => void;
}

const ConditionsModal: React.FC<ConditionsModalProps> = props => {
  const { t } = useTranslation();
  const { title, examples, onClose } = props;

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <Wrapper>
          <Header>
            <Title>{title}</Title>
            <TouchableOpacity onPress={onClose}>
              <CloseIcon source={closeIcon} />
            </TouchableOpacity>
          </Header>

          <Body>
            {examples.map(({ condition, reaction, label }, index) => (
              <Example isLast={index === examples.length - 1}>
                <Condition>{condition}</Condition>
                <ReactionWrapper>
                  <ReactionText>{reaction}</ReactionText>
                  {label}
                </ReactionWrapper>
              </Example>
            ))}
          </Body>

          <Footer>
            <Button
              onPress={onClose}
              bgColors={[
                'rgba(120, 82, 230, 0.48)',
                'rgba(120, 82, 230, 0.48)',
              ]}
            >
              {t('taskSolver.close')}
            </Button>
          </Footer>
        </Wrapper>
      </View>
    </Modal>
  );
};

export default ConditionsModal;
