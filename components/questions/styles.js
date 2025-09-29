import { StyleSheet } from 'react-native';

export const questionsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  
  header: {
    padding: 15,
    backgroundColor: "#b5ff00",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  
  backButton: {
    padding: 8,
    backgroundColor: "transparent",
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  
  backButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  subjectInfo: {
    alignItems: 'center',
  },
  
  subjectCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  
  subjectName: {
    fontSize: 16,
    color: "#111",
    textAlign: 'center',
    marginTop: 5,
  },
  
  questionsCount: {
    fontSize: 14,
    color: "#111",
    marginTop: 5,
  },
  
  scrollContent: {
    padding: 15,
  },
  
  questionCard: {
    backgroundColor: "#111",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#b5ff00",
    shadowColor: "#b5ff00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  questionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b5ff00",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  questionYear: {
    fontSize: 12,
    color: "#afff81ff",
    backgroundColor: "#111",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: "bold",
  },
  
  questionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
    marginBottom: 15,
  },
  
  imageContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: "#222",
    minHeight: 200,
  },
  
  questionImage: {
    width: '100%',
    minHeight: 200,
    backgroundColor: "#222",
  },
  
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#222",
    zIndex: 1,
  },
  
  imageLoadingText: {
    color: "#afff81ff",
    marginTop: 10,
    fontSize: 14,
  },
  
  imageErrorContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#333",
  },
  
  imageErrorText: {
    color: "#ff6b6b",
    fontSize: 14,
  },
  
  additionalInfo: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
  },
  
  subjectIdText: {
    color: "#afff81ff",
    fontSize: 12,
    fontStyle: 'italic',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    color: '#111',
    marginTop: 10,
    fontSize: 16,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  retryButton: {
    backgroundColor: "#b5ff00",
    padding: 12,
    borderRadius: 8,
  },
  
  retryButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  noQuestionsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});