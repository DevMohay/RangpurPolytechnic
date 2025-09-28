import { Book, GraduationCap, Home, FileText, GraduationCap as Admission } from 'lucide-react-native';
import { Pressable, Text, View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';

const PRIMARY = '#b5ff00';

export default function RoundedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  // Get only visible routes (those without href: null)
  const visibleRoutes = state.routes.filter(route => {
    const descriptor = descriptors[route.key];
    return descriptor?.options?.href !== null;
  });

  // Animation refs for visible tabs only
  const translateYRefs = useRef(
    visibleRoutes.map(() => new Animated.Value(0))
  );

  const scaleRefs = useRef(
    visibleRoutes.map((_, index) => new Animated.Value(index === 0 ? 1 : 0.8))
  );

  const circularRefs = useRef(
    visibleRoutes.map((_, index) => new Animated.Value(index === 0 ? 1 : 0))
  );

  const shadowRefs = useRef(
    visibleRoutes.map((_, index) => new Animated.Value(index === 0 ? 8 : 2))
  );

  const previousIndex = useRef(0);

  const items = [
    { name: 'index', label: 'Home', Icon: Home },
    { name: 'cgpa', label: 'CGPA', Icon: GraduationCap },
    { name: 'books', label: 'Books', Icon: Book },
  ];

  // Find current visible tab index
  // If current route is hidden (bteb/admission), keep Home (index 0) as active
  const currentRouteName = state.routes[state.index]?.name;
  const isHiddenRoute = ['bteb', 'admission'].includes(currentRouteName);
  
  const currentVisibleIndex = isHiddenRoute 
    ? 0 // Keep Home active when on hidden routes
    : visibleRoutes.findIndex(route => route.name === currentRouteName);

  // Animate when focused tab changes
  useEffect(() => {
    if (currentVisibleIndex === -1) return; // Current tab is not visible in tab bar

    const prevIndex = previousIndex.current;
    
    if (currentVisibleIndex !== prevIndex && 
        prevIndex < translateYRefs.current.length && 
        currentVisibleIndex < translateYRefs.current.length) {
      
      // Animate out the previous tab (drop down effect)
      Animated.parallel([
        Animated.spring(translateYRefs.current[prevIndex], {
          toValue: 0,
          tension: 300,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(scaleRefs.current[prevIndex], {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(circularRefs.current[prevIndex], {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(shadowRefs.current[prevIndex], {
          toValue: 2,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();

      // Animate in the new tab (water drop effect)
      Animated.sequence([
        // First, scale up and move up
        Animated.parallel([
          Animated.spring(translateYRefs.current[currentVisibleIndex], {
            toValue: -20,
            tension: 200,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(scaleRefs.current[currentVisibleIndex], {
            toValue: 1.2,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(circularRefs.current[currentVisibleIndex], {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(shadowRefs.current[currentVisibleIndex], {
            toValue: 12,
            duration: 250,
            useNativeDriver: false,
          }),
        ]),
        // Then bounce back down like a water drop
        Animated.parallel([
          Animated.spring(translateYRefs.current[currentVisibleIndex], {
            toValue: -8,
            tension: 400,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.spring(scaleRefs.current[currentVisibleIndex], {
            toValue: 1,
            tension: 300,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      previousIndex.current = currentVisibleIndex;
    }
  }, [currentVisibleIndex]);

  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 12 + insets.bottom,
        backgroundColor: '#111',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
        height: 70,
      }}
    >
      {items.map((item, idx) => {
        const route = visibleRoutes.find(r => r.name === item.name);
        if (!route) return null;

        // Keep Home active when on hidden routes (bteb/admission)
        const isFocused = isHiddenRoute 
          ? item.name === 'index' // Home stays active
          : state.routes[state.index]?.name === item.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(item.name);
          }
        };

        const animatedBorderRadius = circularRefs.current[idx]?.interpolate({
          inputRange: [0, 1],
          outputRange: [15, 30],
        });

        const animatedShadowRadius = shadowRefs.current[idx];

        return (
          <Pressable
            key={item.name}
            onPress={onPress}
            style={{ 
              flex: 1, 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              height: '100%',
            }}
            android_ripple={{ color: '#00000011', borderless: true }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                bottom: 8,
                transform: [
                  { translateY: translateYRefs.current[idx] || new Animated.Value(0) },
                  { scale: scaleRefs.current[idx] || new Animated.Value(0.8) }
                ],
              }}
            >
              <Animated.View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: isFocused ? PRIMARY : '#f0f0f0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: animatedBorderRadius || 15,
                  shadowColor: isFocused ? PRIMARY : '#91ff00ff',
                  shadowOpacity: isFocused ? 0.6 : 0.1,
                  shadowRadius: animatedShadowRadius || 2,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: animatedShadowRadius || 2,
                }}
              >
                <item.Icon 
                  color={isFocused ? '#111' : '#111'} 
                  size={isFocused ? 28 : 24} 
                />
              </Animated.View>
            </Animated.View>
            
            {/* Label - only show for non-focused items */}
            {!isFocused && (
              <Text style={{ 
                fontSize: 11, 
                color: '#888', 
                fontWeight: '500',
                marginTop: 4,
              }}>
                {item.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}