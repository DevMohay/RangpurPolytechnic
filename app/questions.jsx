import { ScrollView, StyleSheet } from 'react-native';

import SwipeToOpenDrawer from '@/components/SwipeToOpenDrawer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function QuestionsScreen() {
  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>Questions</ThemedText>
          <ThemedText style={styles.description}>
            Here you can find frequently asked questions about Rangpur Polytechnic Institute.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Admission</ThemedText>
          <ThemedText style={styles.question}>Q: How do I apply for admission?</ThemedText>
          <ThemedText style={styles.answer}>
            A: You can apply for admission through the BTEB admission portal. Check the Admission section for more details.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Academic</ThemedText>
          <ThemedText style={styles.question}>Q: What programs does Rangpur Polytechnic offer?</ThemedText>
          <ThemedText style={styles.answer}>
            A: Rangpur Polytechnic offers various diploma programs in engineering and technology fields.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Contact</ThemedText>
          <ThemedText style={styles.question}>Q: How can I contact the institute?</ThemedText>
          <ThemedText style={styles.answer}>
            A: You can visit our main website for contact information and reach out through official channels.
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </SwipeToOpenDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.7,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 15,
    color: '#b5ff00',
  },
  question: {
    marginBottom: 8,
    fontWeight: '600',
  },
  answer: {
    marginBottom: 20,
    opacity: 0.8,
    lineHeight: 22,
  },
});
