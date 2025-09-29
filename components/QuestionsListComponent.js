import { ThemedView } from '@/components/themed-view';
import { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, FlatList, Text, TouchableOpacity, View } from 'react-native';
import QuestionCard from '../components/questions/QuestionCard';
import { questionsStyles } from '../components/questions/styles';

const QuestionsListComponent = ({ subject, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching questions for subject:', subject);

        const subjectId = subject?.id || subject?._id || subject?.subjectId;
        if (!subjectId) {
          throw new Error('Subject ID not found');
        }

        const response = await fetch(`https://rpiquestions.vercel.app/api/questions?subjectId=${encodeURIComponent(subjectId)}`);
        console.log('Questions response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Questions API response:', data);
        
        // Handle different response formats
        let questionsArray = [];
        if (Array.isArray(data)) {
          questionsArray = data;
        } else if (data && data.questions && Array.isArray(data.questions)) {
          questionsArray = data.questions;
        } else if (data && typeof data === 'object') {
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            questionsArray = possibleArrays[0];
          }
        }
        
        console.log('Final questions array:', questionsArray);
        setQuestions(questionsArray);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(`Failed to load questions: ${error.message}`);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    if (subject && (subject.id || subject._id || subject.subjectId)) {
      fetchQuestions();
    }
  }, [subject]);

  // Intercept Android hardware back to navigate back without reloading subjects
  useEffect(() => {
    const onBackPress = () => {
      if (subject) {
        onBack?.();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [subject, onBack]);

  const renderQuestion = ({ item, index }) => (
    <QuestionCard question={item} index={index} />
  );

  if (loading) {
    return (
      <ThemedView style={questionsStyles.container}>
        <TouchableOpacity onPress={onBack} style={questionsStyles.backButton}>
          <Text style={questionsStyles.backButtonText}>← Back to Subjects</Text>
        </TouchableOpacity>
        
        <View style={questionsStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#b5ff00" />
          <Text style={questionsStyles.loadingText}>Loading questions...</Text>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={questionsStyles.container}>
        <TouchableOpacity onPress={onBack} style={questionsStyles.backButton}>
          <Text style={questionsStyles.backButtonText}>← Back to Subjects</Text>
        </TouchableOpacity>
        
        <View style={questionsStyles.errorContainer}>
          <Text style={questionsStyles.errorText}>{error}</Text>
          <TouchableOpacity 
            onPress={() => {
              setError(null);
              setLoading(true);
              // Re-trigger the useEffect
              const fetchQuestions = async () => {
                try {
                  const subjectId = subject?.id || subject?._id || subject?.subjectId;
                  if (!subjectId) {
                    throw new Error('Subject ID not found');
                  }
                  const response = await fetch(`https://rpiquestions.vercel.app/api/questions?subjectId=${encodeURIComponent(subjectId)}`);
                  const data = await response.json();
                  let questionsArray = [];
                  if (Array.isArray(data)) {
                    questionsArray = data;
                  } else if (data && data.questions && Array.isArray(data.questions)) {
                    questionsArray = data.questions;
                  } else if (data && typeof data === 'object') {
                    const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
                    if (possibleArrays.length > 0) {
                      questionsArray = possibleArrays[0];
                    }
                  }
                  setQuestions(questionsArray);
                } catch (err) {
                  setError(`Failed to load questions: ${err.message}`);
                } finally {
                  setLoading(false);
                }
              };
              fetchQuestions();
            }}
            style={questionsStyles.retryButton}
          >
            <Text style={questionsStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={questionsStyles.container}>
      {/* Header with subject info and back button */}
      <View style={questionsStyles.header}>
        <TouchableOpacity onPress={onBack} style={questionsStyles.backButton}>
          <Text style={questionsStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={questionsStyles.subjectInfo}>
          <Text style={questionsStyles.subjectCode}>{subject.code} - {subject.name}</Text>
          <Text style={questionsStyles.subjectName}></Text>
          <Text style={questionsStyles.questionsCount}>
            {questions.length} Question{questions.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {questions.length > 0 ? (
        <FlatList
          data={questions}
          keyExtractor={(item) => item._id || `question-${Math.random()}`}
          renderItem={renderQuestion}
          contentContainerStyle={questionsStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={questionsStyles.noQuestionsContainer}>
          <Text style={questionsStyles.noQuestionsText}>
            No questions found for this subject
          </Text>
        </View>
      )}
    </ThemedView>
  );
};

export default QuestionsListComponent;