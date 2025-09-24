import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import SwipeToOpenDrawer from '@/components/SwipeToOpenDrawer';
import { ThemedView } from '@/components/themed-view';

const PRIMARY = '#b5ff00';

export default function WebViewScreen({ url, title: initialTitle = 'WebView' }) {
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webviewRef = useRef(null);
  const { title: routeTitle } = useLocalSearchParams();

  const title = routeTitle || initialTitle;

  // Ensure URL is properly formatted
  const cleanUrl = url.trim();
  console.log(`Loading: ${title} - ${cleanUrl}`);

  // Fallback timeout: if site is slow, hide loader after a while to avoid indefinite spinner
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 15000);
    return () => clearTimeout(t);
  }, [cleanUrl]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        {Platform.OS === 'web' ? (
          <iframe
            key={cleanUrl}
            title={title}
            src={cleanUrl}
            style={{ border: 'none', width: '100%', height: '100%' }}
            onLoad={() => setLoading(false)}
          />
        ) : (
          <WebView
            key={cleanUrl}
            ref={webviewRef}
            source={{ uri: cleanUrl }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            style={styles.webview}
            startInLoadingState={false}
            javaScriptEnabled
            domStorageEnabled
            allowsBackForwardNavigationGestures
            pullToRefreshEnabled={Platform.OS === 'android'}
            mixedContentMode="compatibility"
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        )}
        {loading && (
          <View style={styles.loaderOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
        )}
        <Pressable
          onPress={() => {
            setLoading(true);
            if (Platform.OS === 'web') {
              const iframe = document.querySelector('iframe');
              if (iframe) iframe.src = cleanUrl;
            } else {
              webviewRef.current?.reload();
            }
          }}
          style={styles.refreshButton}
          android_ripple={{ color: '#00000022', borderless: true }}>
          <View style={styles.refreshInner} />
        </Pressable>
      </ThemedView>
    </SwipeToOpenDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loaderOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  refreshButton: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 52,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111',
  },
  refreshInner: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#111',
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
});
