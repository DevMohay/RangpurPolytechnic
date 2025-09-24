import { ScrollView, StyleSheet } from 'react-native';

import SwipeToOpenDrawer from '@/components/SwipeToOpenDrawer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AboutScreen() {
  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>About Rangpur Polytechnic</ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Our Institution</ThemedText>
          <ThemedText style={styles.description}>
            Rangpur Polytechnic Institute is a prestigious technical education institution located in Rangpur, Bangladesh. 
            We are committed to providing quality technical and vocational education to prepare skilled professionals 
            for the country's industrial development.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Mission</ThemedText>
          <ThemedText style={styles.description}>
            To provide high-quality technical education and training that produces competent, skilled, and ethical 
            technicians and technologists who can contribute effectively to the economic development of Bangladesh.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Vision</ThemedText>
          <ThemedText style={styles.description}>
            To be a leading polytechnic institute in Bangladesh, recognized for excellence in technical education, 
            research, and innovation.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Programs Offered</ThemedText>
          <ThemedText style={styles.info}>
            • Diploma in Civil Engineering
          </ThemedText>
          <ThemedText style={styles.info}>
            • Diploma in Electrical Engineering
          </ThemedText>
          <ThemedText style={styles.info}>
            • Diploma in Mechanical Engineering
          </ThemedText>
          <ThemedText style={styles.info}>
            • Diploma in Computer Science & Technology
          </ThemedText>
          <ThemedText style={styles.info}>
            • Diploma in Electronics Engineering
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Contact Information</ThemedText>
          <ThemedText style={styles.contactInfo}>
            📍 Address: Rangpur, Bangladesh
          </ThemedText>
          <ThemedText style={styles.contactInfo}>
            🌐 Website: https://rangpur.polytech.gov.bd/
          </ThemedText>
          <ThemedText style={styles.contactInfo}>
            📧 For more information, visit our official website
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
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: '#b5ff00',
  },
  description: {
    marginBottom: 15,
    opacity: 0.8,
    lineHeight: 22,
    textAlign: 'justify',
  },
  info: {
    marginBottom: 5,
    opacity: 0.8,
  },
  contactInfo: {
    marginBottom: 8,
    opacity: 0.8,
  },
});
