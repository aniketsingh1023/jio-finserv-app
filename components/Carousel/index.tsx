import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ViewToken,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  buttonText: string;
}

interface CarouselProps {
  data: CarouselItem[];
  onApplyPress?: (item: CarouselItem) => void;
  onCalculatePress?: (item: CarouselItem) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const carouselItemWidth = screenWidth - 32;

export const Carousel: React.FC<CarouselProps> = ({
  data,
  onApplyPress,
  onCalculatePress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const handleApplyPress = (item: CarouselItem) => {
    if (item.buttonText === 'Apply Now') {
      onApplyPress?.(item);
    }
  };

  const handleCalculatePress = () => {
    if (data[currentIndex]) {
      onCalculatePress?.(data[currentIndex]);
    }
  };

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <View
      style={[
        styles.carouselItem,
        { backgroundColor: item.backgroundColor },
      ]}
    >
      <View style={styles.overlay} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleApplyPress(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={carouselItemWidth + 16}
        decelerationRate={0.8}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        contentContainerStyle={styles.listContent}
      />

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Quick Action Button */}
      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={handleCalculatePress}
        activeOpacity={0.7}
      >
        <Text style={styles.quickActionText}>Calculate EMI</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  carouselItem: {
    width: carouselItemWidth,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentContainer: {
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 12,
    opacity: 0.9,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightGray,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  quickActionButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionText: {
    color: Colors.darkCharcoal,
    fontWeight: '600',
    fontSize: 14,
  },
});
