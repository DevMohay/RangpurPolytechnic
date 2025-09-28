import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, Pressable, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SwipeToOpenDrawer from '@/components/SwipeToOpenDrawer';
import { ThemedView } from '@/components/themed-view';

const PRIMARY = '#b5ff00';

export default function WebViewScreen({ url, title: initialTitle = 'WebView' }) {
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [cachedContent, setCachedContent] = useState(null);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);
  const webviewRef = useRef(null);
  const { title: routeTitle } = useLocalSearchParams();

  const title = routeTitle || initialTitle;
  const cleanUrl = url.trim();
  
  // Cache keys - using simple hash instead of Buffer
  const generateCacheKey = (url) => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).slice(0, 10);
  };
  
  const CACHE_KEY = `webview_cache_${generateCacheKey(cleanUrl)}`;
  const CACHE_TIMESTAMP_KEY = `${CACHE_KEY}_timestamp`;
  const RESOURCES_CACHE_KEY = `${CACHE_KEY}_resources`;
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  // Network monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      setIsConnected(connected);
      
      if (!connected && !cachedContent) {
        setShowOfflineMessage(true);
      } else if (connected && cachedContent) {
        setShowOfflineMessage(false);
      }
    });

    NetInfo.fetch().then(state => {
      const connected = state.isConnected && state.isInternetReachable;
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, [cachedContent]);

  // Load cached content on component mount
  useEffect(() => {
    loadCachedContent();
  }, [cleanUrl]);

  // Load cached content
  const loadCachedContent = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      const resources = await AsyncStorage.getItem(RESOURCES_CACHE_KEY);
      
      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp);
        if (cacheAge < CACHE_EXPIRY) {
          let finalHtml = cached;
          
          // Inject cached resources if available
          if (resources) {
            const resourcesData = JSON.parse(resources);
            finalHtml = injectCachedResources(cached, resourcesData);
          }
          
          setCachedContent(finalHtml);
          console.log('Cached content with resources loaded for:', cleanUrl);
        } else {
          // Cache expired, remove it
          await clearCache();
          console.log('Cache expired and cleared for:', cleanUrl);
        }
      }
    } catch (error) {
      console.error('Error loading cached content:', error);
    }
  };

  // Inject cached resources into HTML
  const injectCachedResources = (html, resources) => {
    let modifiedHtml = html;
    
    // Replace image sources with base64 data
    Object.keys(resources.images || {}).forEach(url => {
      const base64Data = resources.images[url];
      const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`src=["']${escapedUrl}["']`, 'gi');
      modifiedHtml = modifiedHtml.replace(regex, `src="data:image/jpeg;base64,${base64Data}"`);
    });
    
    // Inject cached CSS
    if (resources.styles && resources.styles.length > 0) {
      const styleTag = `<style>${resources.styles.join('\n')}</style>`;
      modifiedHtml = modifiedHtml.replace('</head>', `${styleTag}</head>`);
    }
    
    return modifiedHtml;
  };

  // Cache content with resources
  const cacheContentWithResources = async (html) => {
    try {
      if (html && html.length > 1000) {
        setCacheProgress(10);
        
        // Cache main HTML
        await AsyncStorage.setItem(CACHE_KEY, html);
        await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        
        setCacheProgress(30);
        
        // Extract and cache resources
        await cachePageResources(html);
        
        setCachedContent(html);
        setCacheProgress(100);
        console.log('Content with resources cached for:', cleanUrl);
        
        setTimeout(() => setCacheProgress(0), 2000);
      }
    } catch (error) {
      console.error('Error caching content with resources:', error);
      setCacheProgress(0);
    }
  };

  // Cache page resources (CSS, Images)
  const cachePageResources = async (html) => {
    try {
      const resources = { images: {}, styles: [] };
      
      // Extract CSS links and images
      const cssRegex = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
      const imgRegex = /<img[^>]*src=["'][^"']*["'][^>]*>/gi;
      
      const cssLinks = html.match(cssRegex) || [];
      const imageLinks = html.match(imgRegex) || [];
      
      setCacheProgress(40);
      
      // Cache CSS files (limit to 5)
      for (let i = 0; i < Math.min(cssLinks.length, 5); i++) {
        const hrefMatch = cssLinks[i].match(/href=["']([^"']+)["']/);
        if (hrefMatch) {
          let cssUrl = hrefMatch[1];
          
          // Handle relative URLs
          if (cssUrl.startsWith('//')) {
            cssUrl = 'https:' + cssUrl;
          } else if (cssUrl.startsWith('/')) {
            try {
              const urlObj = new URL(cleanUrl);
              cssUrl = urlObj.origin + cssUrl;
            } catch (e) {
              continue;
            }
          } else if (!cssUrl.startsWith('http')) {
            continue;
          }
          
          try {
            const response = await fetch(cssUrl);
            const cssText = await response.text();
            resources.styles.push(cssText);
          } catch (error) {
            console.log('Failed to cache CSS:', cssUrl);
          }
        }
      }
      
      setCacheProgress(60);
      
      // Cache images (limit to 10, size limit 500KB)
      const imagePromises = [];
      for (let i = 0; i < Math.min(imageLinks.length, 10); i++) {
        const srcMatch = imageLinks[i].match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          let imgUrl = srcMatch[1];
          
          // Skip data URLs
          if (imgUrl.startsWith('data:')) continue;
          
          // Handle relative URLs
          if (imgUrl.startsWith('//')) {
            imgUrl = 'https:' + imgUrl;
          } else if (imgUrl.startsWith('/')) {
            try {
              const urlObj = new URL(cleanUrl);
              imgUrl = urlObj.origin + imgUrl;
            } catch (e) {
              continue;
            }
          } else if (!imgUrl.startsWith('http')) {
            continue;
          }
          
          // Create promise for each image
          const imagePromise = fetch(imgUrl)
            .then(response => response.blob())
            .then(blob => {
              if (blob.size < 500 * 1024) { // Only cache images < 500KB
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result;
                    if (typeof result === 'string') {
                      const base64 = result.split(',')[1];
                      resources.images[imgUrl] = base64;
                      resolve();
                    } else {
                      reject(new Error('Failed to convert to base64'));
                    }
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
              }
            })
            .catch(error => {
              console.log('Failed to cache image:', imgUrl);
            });
            
          imagePromises.push(imagePromise);
        }
      }
      
      // Wait for all images to be processed
      await Promise.allSettled(imagePromises);
      
      setCacheProgress(80);
      
      // Save resources cache
      await AsyncStorage.setItem(RESOURCES_CACHE_KEY, JSON.stringify(resources));
      
      setCacheProgress(90);
      
    } catch (error) {
      console.error('Error caching page resources:', error);
    }
  };

  // Clear cache
  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY);
      await AsyncStorage.removeItem(RESOURCES_CACHE_KEY);
      setCachedContent(null);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Handle WebView load end
  const handleLoadEnd = () => {
    setLoading(false);
    setShowOfflineMessage(false);
    
    if (isConnected && Platform.OS !== 'web') {
      // Extract and cache HTML content
      const jsCode = `
        (function() {
          try {
            const html = document.documentElement.outerHTML;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'HTML_CONTENT',
              data: html
            }));
          } catch (error) {
            console.log('Error extracting HTML:', error);
          }
        })();
        true;
      `;
      webviewRef.current?.injectJavaScript(jsCode);
    }
  };

  // Handle WebView messages
  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'HTML_CONTENT' && message.data) {
        cacheContentWithResources(message.data);
      }
    } catch (error) {
      // Ignore parsing errors for non-JSON messages
    }
  };

  // Handle WebView errors
  const handleError = () => {
    setLoading(false);
    if (!isConnected && cachedContent) {
      setShowOfflineMessage(true);
    }
  };

  // Fallback timeout
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      if (!isConnected && cachedContent) {
        setShowOfflineMessage(true);
      }
    }, 15000);
    return () => clearTimeout(t);
  }, [cleanUrl, isConnected, cachedContent]);

  // Back button handler
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

  // Refresh function
  const handleRefresh = () => {
    setLoading(true);
    setShowOfflineMessage(false);
    
    if (Platform.OS === 'web') {
      const iframe = document.querySelector('iframe');
      if (iframe) iframe.src = cleanUrl;
    } else {
      if (isConnected) {
        webviewRef.current?.reload();
      } else if (cachedContent) {
        // Show cached content in offline mode
        setShowOfflineMessage(true);
        setLoading(false);
      }
    }
  };

  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        {/* Network status indicator */}
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Text style={styles.offlineText}>
              🔴 Offline Mode {cachedContent ? '- Showing Cached Content' : ''}
            </Text>
          </View>
        )}

        {/* Cache progress indicator */}
        {cacheProgress > 0 && cacheProgress < 100 && (
          <View style={styles.progressIndicator}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${cacheProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>Caching resources... {cacheProgress}%</Text>
          </View>
        )}

        {/* WebView or Cached Content */}
        {Platform.OS === 'web' ? (
          <iframe
            key={cleanUrl}
            title={title}
            src={cleanUrl}
            style={{ border: 'none', width: '100%', height: '100%' }}
            onLoad={() => setLoading(false)}
          />
        ) : (
          <>
            {/* Online WebView */}
            {(isConnected || !cachedContent) && (
              <WebView
                key={cleanUrl}
                ref={webviewRef}
                source={{ uri: cleanUrl }}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
                onMessage={handleMessage}
                onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
                style={[styles.webview, showOfflineMessage ? styles.hiddenWebview : null]}
                startInLoadingState={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsBackForwardNavigationGestures={true}
                pullToRefreshEnabled={Platform.OS === 'android'}
                mixedContentMode="compatibility"
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                cacheEnabled={true}
                incognito={false}
              />
            )}

            {/* Offline Cached Content */}
            {!isConnected && cachedContent && (
              <WebView
                source={{ html: cachedContent }}
                style={[styles.webview, !showOfflineMessage ? styles.hiddenWebview : null]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoadEnd={() => setLoading(false)}
              />
            )}

            {/* No internet, no cache message */}
            {!isConnected && !cachedContent && !loading && (
              <View style={styles.noContentContainer}>
                <Text style={styles.noContentTitle}>📡 No Internet Connection</Text>
                <Text style={styles.noContentText}>
                  No cached content available for this page.{'\n'}
                  Please connect to internet to load the website.
                </Text>
              </View>
            )}
          </>
        )}

        {/* Loading overlay */}
        {loading && (
          <View style={styles.loaderOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
        )}

        {/* Refresh button */}
        <Pressable
          onPress={handleRefresh}
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
  hiddenWebview: {
    position: 'absolute',
    left: -9999,
    opacity: 0,
  },
  loaderOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b5ff00',
  },
  refreshButton: {
    position: 'absolute',
    right: 16,
    top: 20,
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
  offlineIndicator: {
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(181, 255, 0, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#111',
    borderRadius: 2,
  },
  progressText: {
    color: '#111',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  noContentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  noContentText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
});