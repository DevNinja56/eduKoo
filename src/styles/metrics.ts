import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  width,
  height,
  spacing: width / 30,
  fontSize: {
    small: width / 38,
    medium: width / 32,
    regular: width / 26,
    large: width / 20,
    xLarge: width / 7,
  },
  fontFamily: {
    ptSans: Platform.OS === 'ios' ? 'PT Sans' : 'pt_sans-web-regular',
    ptSansItalic: 'PTSans-Italic',
    ptSansBold: Platform.OS === 'ios' ? 'PT Sans' : 'pt_sans-web-bold',
    univiaProItalic: 'univiapro-blackitalic',
  },
};
