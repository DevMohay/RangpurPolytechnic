import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  BackHandler,
  Dimensions,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

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
      require('../assets/bookList/et16/et16-1.jpg'),
      require('../assets/bookList/et16/et16-2.jpg'),
      require('../assets/bookList/et16/et16-3.jpg'),
    ],
    'Mechanical Technology': [
      require('../assets/bookList/mt16/mt16-1.jpg'),
      require('../assets/bookList/mt16/mt16-3.jpg'),
      require('../assets/bookList/mt16/mt16-4.jpg'),
    ],
    'Power Technology': [
      require('../assets/bookList/pt16/pt16-1.jpg'),
      require('../assets/bookList/pt16/pt16-2.jpg'),
      require('../assets/bookList/pt16/pt16-3.jpg'),
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
    ],
    'Computer Science and Technology': [
      require('../assets/bookList/cse22/cse22-1.jpg'),
      require('../assets/bookList/cse22/cse22-2.jpg'),
      require('../assets/bookList/cse22/cse22-3.jpg'),
      require('../assets/bookList/cse22/cse22-4.jpg'),
    ],
    'Electrical Technology': [
      require('../assets/bookList/et22/et22-1.jpg'),
      require('../assets/bookList/et22/et22-2.jpg'),
      require('../assets/bookList/et22/et22-3.jpg'),
      require('../assets/bookList/et22/et22-4.jpg'),
      require('../assets/bookList/et22/et22-5.jpg'),
    ],
    'Electronics Technology': [
      require('../assets/bookList/et22/et22-1.jpg'),
      require('../assets/bookList/et22/et22-2.jpg'),
      require('../assets/bookList/et22/et22-3.jpg'),
      require('../assets/bookList/et22/et22-4.jpg'),
      require('../assets/bookList/et22/et22-5.jpg'),
    ],
    'Mechanical Technology': [
      require('../assets/bookList/mt22/mt22-1.jpg'),
      require('../assets/bookList/mt22/mt22-2.jpg'),
      require('../assets/bookList/mt22/mt22-3.jpg'),
    ],
    'Power Technology': [
      require('../assets/bookList/pt22/pt22-1.jpg'),
      require('../assets/bookList/pt22/pt22-2.jpg'),
      require('../assets/bookList/pt22/pt22-3.jpg'),
      require('../assets/bookList/pt22/pt22-4.jpg'),
    ],
    'Electro Medical Technology': [
      require('../assets/bookList/emt22/emt22-1.jpg'),
      require('../assets/bookList/emt22/emt22-2.jpg'),
      require('../assets/bookList/emt22/emt22-3.jpg'),
      require('../assets/bookList/emt22/emt22-4.jpg'),
    ],
  },
};

const TechnologyComponent = ({ techName, selectedProbidhan, onBack }) => {
  const images = technologyImages[selectedProbidhan]?.[techName] || [];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false);
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
  }, [modalVisible]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => { setSelectedImageIndex(index); setModalVisible(true); }}>
            <Image source={img} style={styles.fullImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <ImageViewer
          imageUrls={images.map(img => ({ url: '', props: { source: img } }))}
          index={selectedImageIndex}
          enableSwipeDown={true}
          onSwipeDown={() => setModalVisible(false)}
          backgroundColor="#AB8CFEFE"
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#AB8CFEFE' },
  scrollView: { alignItems: 'center', flexGrow: 1 },
  fullImage: { width: width, height: height * 0.5, margin: 10 },
});

export default TechnologyComponent;
