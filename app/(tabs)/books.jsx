import { StyleSheet } from 'react-native';

import SwipeToOpenDrawer from '@/components/SwipeToOpenDrawer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BooksScreen() {
  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Books</ThemedText>
      </ThemedView>
    </SwipeToOpenDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


