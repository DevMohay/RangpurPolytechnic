import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Dimensions,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const { width, height } = Dimensions.get('window');

const technologyImages = {
  '2016': {
    'Civil Technology': [
      require('../assets/bookList/ct16/ct16-1.jpg'),
      require('../assets/bookList/ct16/ct16-2.jpg'),
      require('../assets/bookList/ct16/ct16-3.jpg'),
    ],
    'Computer Technology': [
      require('../assets/bookList/cse16/cse16-1.jpg'),
      require('../assets/bookList/cse16/cse16-2.jpg'),
      require('../assets/bookList/cse16/cse16-3.jpg'),
      require('../assets/bookList/cse16/cse16-4.jpg'),
    ],
    'Electrical Technology': [
      require('../assets/bookList/et16/et16-1.jpg'),
      require('../assets/bookList/et16/et16-2.jpg'),
      require('../assets/bookList/et16/et16-3.jpg'),
    ],
    'Electronics Technology': [
      require('../assets/bookList/ent16/ent16-1.jpg'),
      require('../assets/bookList/ent16/ent16-2.jpg'),
      require('../assets/bookList/ent16/ent16-3.jpg'),
    ],
    'Mechanical Technology': [
      require('../assets/bookList/mt16/mt16-1.jpg'),
      require('../assets/bookList/mt16/mt16-3.jpg'),
      require('../assets/bookList/mt16/mt16-4.jpg'),
    ],
    'Power Technology': [
      require('../assets/bookList/pt16/pt16-1.jpg'),
    ],
    'Electro Medical Technology': [
      require('../assets/bookList/emt16/emt16-1.jpg'),
      require('../assets/bookList/emt16/emt16-2.jpg'),
      require('../assets/bookList/emt16/emt16-3.jpg'),
    ],
  },
  '2022': {
    'Civil Technology': [
      require('../assets/bookList/ct22/ct22-1.jpg'),
      require('../assets/bookList/ct22/ct22-2.jpg'),
      require('../assets/bookList/ct22/ct22-3.jpg'),
      require('../assets/bookList/ct22/ct22-4.jpg'),
      require('../assets/bookList/ct22/ct22-5.jpg'),
    ],
    'Computer Science and Technology': [
      require('../assets/bookList/cse22/cse22-1.jpg'),
      require('../assets/bookList/cse22/cse22-2.jpg'),
      require('../assets/bookList/cse22/cse22-3.jpg'),
      require('../assets/bookList/cse22/cse22-4.jpg'),
      require('../assets/bookList/cse22/cse22-5.jpg'),
    ],
    'Electrical Technology': [
      require('../assets/bookList/et22/et22-1.jpg'),
      require('../assets/bookList/et22/et22-2.jpg'),
      require('../assets/bookList/et22/et22-3.jpg'),
      require('../assets/bookList/et22/et22-4.jpg'),
      require('../assets/bookList/et22/et22-5.jpg'),
    ],
    'Electronics Technology': [
      require('../assets/bookList/ent22/ent22-1.jpg'),
      require('../assets/bookList/ent22/ent22-2.jpg'),
      require('../assets/bookList/ent22/ent22-3.jpg'),
      require('../assets/bookList/ent22/ent22-4.jpg'),
      require('../assets/bookList/ent22/ent22-5.jpg'),
    ],
    'Mechanical Technology': [
      require('../assets/bookList/mt22/mt22-1.jpg'),
      require('../assets/bookList/mt22/mt22-2.jpg'),
      require('../assets/bookList/mt22/mt22-3.jpg'),
      require('../assets/bookList/mt22/mt22-4.jpg'),
      require('../assets/bookList/mt22/mt22-5.jpg'),
    ],
    'Power Technology': [
      require('../assets/bookList/pt22/pt22-1.jpg'),
      require('../assets/bookList/pt22/pt22-2.jpg'),
      require('../assets/bookList/pt22/pt22-3.jpg'),
      require('../assets/bookList/pt22/pt22-4.jpg'),
      require('../assets/bookList/pt22/pt22-5.jpg'),
    ],
    'Electro Medical Technology': [
      require('../assets/bookList/emt22/emt22-1.jpg'),
      require('../assets/bookList/emt22/emt22-2.jpg'),
      require('../assets/bookList/emt22/emt22-3.jpg'),
      require('../assets/bookList/emt22/emt22-4.jpg'),
      require('../assets/bookList/emt22/emt22-5.jpg'),
    ],
  },
};

const TechnologyComponent = ({ techName, selectedProbidhan, onBack }) => {
  const images = technologyImages[selectedProbidhan]?.[techName] || [];
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Safely convert images to URIs for ImageViewing component
  const imageURIs = images.map(img => {
    try {
      const source = Image.resolveAssetSource(img);
      return { uri: source.uri };
    } catch (error) {
      console.warn('Failed to resolve image:', error);
      return { uri: '' };
    }
  }).filter(img => img.uri !== '');

  useEffect(() => {
    const backAction = () => {
      if (isVisible) {
        setIsVisible(false);
        return true;
      }
      onBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isVisible]);

  return (
    <View style={styles.container}>
      {images.length === 0 ? (
        <View style={styles.noBooksContainer}>
          <Text style={styles.noBooksText}>No books found for this technology.</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          {images.map((img, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => {
                console.log(`Opening image ${index + 1} of ${images.length}`);
                setCurrentImageIndex(index);
                setIsVisible(true);
              }}
              style={styles.imageContainer}
              activeOpacity={0.7}
            >
              <Image 
                source={img} 
                style={styles.fullImage} 
                resizeMode="contain"
                onError={(error) => console.warn('Image load error:', error)}
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageNumber}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ImageViewing
        images={imageURIs}
        imageIndex={currentImageIndex}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        animationType="fade"
        backgroundColor="#b5ff00"
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        presentationStyle="overFullScreen"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#b5ff00' },
  scrollView: { alignItems: 'center', flexGrow: 1, paddingVertical: 10 },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#b5ff00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullImage: { 
    width: width * 0.9, 
    height: 300,
    backgroundColor: '#b5ff00',
  },
  imageOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(181, 255, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageNumber: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noBooksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBooksText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TechnologyComponent;
