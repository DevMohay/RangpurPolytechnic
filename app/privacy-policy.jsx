import { ScrollView, StyleSheet } from 'react-native';

import SwipeToOpenDrawer from '@/components/SwipeToOpenDrawer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PrivacyPolicyScreen() {
  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>Privacy Policy</ThemedText>
          
          <ThemedText style={styles.lastUpdated}>
            Last Updated: December 2024
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Introduction</ThemedText>
          <ThemedText style={styles.description}>
            This Privacy Policy describes how Rangpur Polytechnic Institute collects, uses, and protects 
            your personal information when you use our mobile application and services.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Information We Collect</ThemedText>
          <ThemedText style={styles.description}>
            We may collect the following types of information:
          </ThemedText>
          <ThemedText style={styles.info}>
            • Personal identification information (name, email, phone number)
          </ThemedText>
          <ThemedText style={styles.info}>
            • Academic information (student ID, program details)
          </ThemedText>
          <ThemedText style={styles.info}>
            • Device information (device type, operating system)
          </ThemedText>
          <ThemedText style={styles.info}>
            • Usage data (app interactions, preferences)
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>How We Use Your Information</ThemedText>
          <ThemedText style={styles.description}>
            We use your information to:
          </ThemedText>
          <ThemedText style={styles.info}>
            • Provide and maintain our services
          </ThemedText>
          <ThemedText style={styles.info}>
            • Send important notifications and updates
          </ThemedText>
          <ThemedText style={styles.info}>
            • Improve our application and services
          </ThemedText>
          <ThemedText style={styles.info}>
            • Provide customer support
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Data Security</ThemedText>
          <ThemedText style={styles.description}>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Third-Party Services</ThemedText>
          <ThemedText style={styles.description}>
            Our app may contain links to external websites (BTEB, Admission portals). We are not 
            responsible for the privacy practices of these third-party sites.
          </ThemedText>
          
          <ThemedText type="subtitle" style={styles.sectionTitle}>Contact Us</ThemedText>
          <ThemedText style={styles.description}>
            If you have any questions about this Privacy Policy, please contact us through our 
            official website or visit our campus.
          </ThemedText>
          
          <ThemedText style={styles.contactInfo}>
            🌐 Website: https://rangpur.polytech.gov.bd/
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
  lastUpdated: {
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
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
    marginBottom: 8,
    opacity: 0.8,
    paddingLeft: 10,
  },
  contactInfo: {
    marginTop: 10,
    opacity: 0.8,
  },
});
