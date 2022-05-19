import React, { useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Container, Img, ImgLable, styles } from './styles';
import Carousel, { Pagination } from 'react-native-snap-carousel';

interface Item {
  label: string;
  image: any;
}

interface Props {
  data: Item[];
}

const ProModalCarousel: React.FC<Props> = props => {
  const _carousel = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    return (
      <Container>
        <Img source={item.image}>
          <ImgLable>{item.label}</ImgLable>
        </Img>
      </Container>
    );
  };

  const pagination = (data: Item[], activeIndex: number) => {
    return (
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeIndex}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
        }}
        dotColor="#fff"
        inactiveDotColor="#000"
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  return (
    <View>
      <Carousel
        ref={_carousel}
        data={props.data}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width}
        layout="default"
        loop={true}
        onSnapToItem={index => setActiveSlide(index)}
      />
      {pagination(props.data, activeSlide)}
    </View>
  );
};

export default ProModalCarousel;
