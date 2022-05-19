import React, { useMemo } from 'react';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import find from 'lodash/find';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Image } from 'react-native';
import { Invert } from 'react-native-color-matrix-image-filters';

import { metrics } from '../../../../styles';
import inorganic from '../../../../json/cribs/inorganic.json';
import organic from '../../../../json/cribs/organic.json';
import { StackParamList } from '../../../../navigation/entities';
import { SCREENS } from '../../../../navigation/constants';
import { CribsContent, IMAGES } from '../../constants';
import { Wrapper, Header, styles } from './styles';

const CheatsArticle = () => {
  const { params } = useRoute<
    RouteProp<StackParamList, SCREENS.CHEATS_ARTICLE>
  >();
  const { section, title } = useMemo(() => params, [params]);
  const content = useMemo<string>(() => {
    let result: CribsContent | undefined;

    if (section === 'ORGANIC') {
      result = find<CribsContent>(organic, it => it.title === title);
    } else {
      result = find<CribsContent>(inorganic, it => it.title === title);
    }

    return result?.content || '';
  }, [section, title]);

  return (
    <Wrapper>
      <Header>{title}</Header>
      <RenderHtml
        contentWidth={metrics.width}
        baseStyle={styles.base}
        tagsStyles={{ p: styles.p, b: styles.b }}
        source={{ html: content }}
        systemFonts={[...defaultSystemFonts, metrics.fontFamily.ptSans]}
        renderers={{
          img: (attrs: any) => {
            const imagePath: string = attrs.tnode.attributes.src;
            const results = imagePath.match(/\d*-\d*/);
            if (results) {
              const fileName = results[0];

              return (
                <Invert>
                  <Image
                    style={styles.img}
                    source={IMAGES[section][fileName]}
                  />
                </Invert>
              );
            }
            return null;
          },
        }}
      />
    </Wrapper>
  );
};

export default CheatsArticle;
