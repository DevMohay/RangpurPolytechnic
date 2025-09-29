import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { questionsStyles } from './styles';

const QuestionCard = ({ question, index }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);

  const fullDate = useMemo(() => {
    if (question?.year === undefined || question?.year === null) return null;
    try {
      const raw = question.year;
      if (typeof raw === 'number' || (typeof raw === 'string' && /^\d{4}$/.test(raw))) {
        return String(raw);
      }
      const parsed = new Date(raw);
      if (isNaN(parsed.getTime())) return String(raw);
      return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return String(question.year);
    }
  }, [question?.year]);

  const imageUri = useMemo(() => {
    if (!question?.fileUrl) return null;
    try {
      return encodeURI(String(question.fileUrl).trim());
    } catch (e) {
      return String(question.fileUrl);
    }
  }, [question?.fileUrl]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <View style={questionsStyles.questionCard}>
      {/* Question Header */}
      <View style={questionsStyles.questionHeader}>
        <Text style={questionsStyles.questionNumber}>Q{index + 1}</Text>

      </View>

      {/* Question Title */}
      {question.title && (
        <Text style={questionsStyles.questionTitle}>
          {question.title}
        </Text>
      )}

      {/* Question Image */}
      {imageUri && (
        <TouchableOpacity style={questionsStyles.imageContainer} activeOpacity={0.9} onPress={() => setViewerVisible(true)}>
          {imageLoading && (
            <View style={questionsStyles.imageLoadingContainer}>
              <ActivityIndicator size="small" color="#b5ff00" />
              <Text style={questionsStyles.imageLoadingText}>Loading image...</Text>
            </View>
          )}

          {!imageError && (
            <Image
              source={{ uri: imageUri }}
              style={questionsStyles.questionImage}
              onLoad={handleImageLoad}
              onError={handleImageError}
              resizeMode="contain"
            />
          )}

          {imageError && (
            <View style={questionsStyles.imageErrorContainer}>
              <Text style={questionsStyles.imageErrorText}>
                Failed to load Question Paper
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Additional Info */}
      <View >
        {question.year ? (
          <Text style={questionsStyles.questionYear}> {fullDate || String(question.year)}</Text>
        ) : null}
      </View>

      {/* Full-screen viewer */}
      {imageUri ? (
        <ImageViewing
          images={[{ uri: imageUri }]}
          imageIndex={0}
          visible={viewerVisible}
          onRequestClose={() => setViewerVisible(false)}
          swipeToCloseEnabled
          doubleTapToZoomEnabled
          presentationStyle="fullScreen"
          backgroundColor="#000"
        />
      ) : null}
    </View>
  );
};

export default QuestionCard;
