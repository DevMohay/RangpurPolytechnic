import React from 'react';
import { Gesture, GestureDetector, Directions } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

export default function SwipeToOpenDrawer({ children }) {
  const navigation = useNavigation();

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      if (navigation.openDrawer) {
        navigation.openDrawer();
      }
    });

  return (
    <GestureDetector gesture={flingRight}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </GestureDetector>
  );
}
