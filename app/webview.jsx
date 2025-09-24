
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function WebViewer() {
  const { url } = useLocalSearchParams();
  return <WebView source={{ uri: url }} />;
}
