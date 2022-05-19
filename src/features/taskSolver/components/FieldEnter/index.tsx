import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import deleteIcon from '../../../../assets/images/icons/delete.png';
import { Picker, Button } from '../../../../components';
import { colors } from '../../../../styles';
import { Substance } from '../../../../entities';
import { BaseText } from '../../screens/styles';
import {
  Wrapper,
  SymbolText,
  DeleteIcon,
  VariableInput,
  styles,
} from './styles';

interface FieldEnterProps {
  currentVariable: any;
  reactionObject: any[];
  type: 'fieldGiven' | 'fieldFind';
  style?: any;
  onSubmit: (params: {
    value: string;
    substance: Substance;
    measure: string;
  }) => void;
  onClose: () => void;
}

const FieldEnter: React.FC<FieldEnterProps> = props => {
  const {
    currentVariable,
    reactionObject,
    type,
    style,
    onSubmit,
    onClose,
  } = props;

  const { i18n, t } = useTranslation();

  const isFieldGiven = useMemo(() => type === 'fieldGiven', [type]);
  const initSubstance = useMemo(
    () => (reactionObject.length ? reactionObject[0] : {}),
    [reactionObject],
  );

  const [substance, setSubstance] = useState<any>(initSubstance);
  const [measure, setMeasure] = useState<string>(
    currentVariable.measures[i18n.language][0],
  );
  const [value, setValue] = useState<string>('');

  const handleSubmit = () => {
    onSubmit({ value, substance, measure });
  };

  const handleSubstanceChange = (itemValue: string, itemIndex: number) => {
    setSubstance(reactionObject[itemIndex]);
  };

  return (
    <Wrapper style={style}>
      <TouchableOpacity onPress={onClose}>
        <DeleteIcon source={deleteIcon} />
      </TouchableOpacity>
      <SymbolText text={currentVariable.symbol[i18n.language]} />
      {!!reactionObject.length && (
        <Picker
          textStyle={styles.pickerText}
          skewContainerStyle={styles.pickerSkewContainer}
          bgColors={[colors.darkBlue, colors.darkBlue]}
          value={substance.subst}
          data={reactionObject.map((it: any) => ({
            label: it.subst,
            value: it.subst,
          }))}
          onValueChange={handleSubstanceChange}
        />
      )}
      <BaseText>{isFieldGiven ? ' =' : '-?'}</BaseText>
      {isFieldGiven && (
        <VariableInput
          placeholder={t('taskSolver.enter')}
          bgColors={[colors.darkBlue, colors.darkBlue]}
          value={value}
          onChangeText={setValue}
        />
      )}
      {currentVariable.measures.multipliers.length > 1 && isFieldGiven && (
        <Picker
          style={styles.picker}
          textStyle={styles.pickerText}
          skewContainerStyle={styles.pickerSkewContainer}
          bgColors={[colors.darkBlue, colors.darkBlue]}
          value={measure}
          data={currentVariable.measures[i18n.language].map((it: string) => ({
            label: it,
            value: it,
          }))}
          onValueChange={setMeasure}
        />
      )}
      <Button onPress={handleSubmit}>OK</Button>
    </Wrapper>
  );
};

export default FieldEnter;
