import { ArrowLeft, Scroll } from "lucide-react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  BackHandler,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import SwipeToOpenDrawer from "@/components/SwipeToOpenDrawer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TechnologyComponent from "@/components/TechnologyComponent.jsx";

export default function BooksScreen() {
  const [selectedProbidhan, setSelectedProbidhan] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [animatingItems, setAnimatingItems] = useState({});
  const animationRefs = useRef({});
  const probidhanScaleRefs = useRef({});

  // Initialize animation values for items
  const initializeAnimation = (probidhanId, technologies) => {
    if (!animationRefs.current[probidhanId]) {
      animationRefs.current[probidhanId] = technologies.map(() => ({
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(30),
      }));
    }
  };

  // Animate items in one by one with zoom bounce effect
  const animateItemsIn = (probidhanId, technologies) => {
    const animations = animationRefs.current[probidhanId];
    if (!animations) return;

    setAnimatingItems((prev) => ({ ...prev, [probidhanId]: true }));

    // Reset all values
    animations.forEach((anim) => {
      anim.scale.setValue(0);
      anim.opacity.setValue(0);
      anim.translateY.setValue(30);
    });

    // Animate each item with staggered delay
    const animationPromises = animations.map((anim, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          Animated.parallel([
            Animated.spring(anim.scale, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 300,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.spring(anim.translateY, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start(() => resolve());
        }, index * 100); // 100ms delay between each item
      });
    });

    Promise.all(animationPromises).then(() => {
      setAnimatingItems((prev) => ({ ...prev, [probidhanId]: false }));
    });
  };

  // Animate items out with reverse effect
  const animateItemsOut = (probidhanId) => {
    const animations = animationRefs.current[probidhanId];
    if (!animations) return Promise.resolve();

    return new Promise((resolve) => {
      setAnimatingItems((prev) => ({ ...prev, [probidhanId]: true }));

      const animationPromises = animations.reverse().map((anim, index) => {
        return new Promise((itemResolve) => {
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(anim.scale, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateY, {
                toValue: -20,
                duration: 200,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start(() => itemResolve());
          }, index * 50); // 50ms delay between each item (faster for closing)
        });
      });

      Promise.all(animationPromises).then(() => {
        setAnimatingItems((prev) => ({ ...prev, [probidhanId]: false }));
        animations.reverse(); // Restore original order
        resolve();
      });
    });
  };

  // Initialize probidhan scale animation
  const initializeProbidhanScale = (probidhanId) => {
    if (!probidhanScaleRefs.current[probidhanId]) {
      probidhanScaleRefs.current[probidhanId] = new Animated.Value(1);
    }
  };

  // Probidhan bounce animation
  const animateProbidhanBounce = (probidhanId) => {
    const scaleRef = probidhanScaleRefs.current[probidhanId];
    if (!scaleRef) return;

    Animated.sequence([
      Animated.spring(scaleRef, {
        toValue: 0.95,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleRef, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animated Technology Item Component
  const AnimatedTechnologyItem = ({ item, index, probidhanId }) => {
    const animations = animationRefs.current[probidhanId]?.[index] || {
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    };

    return (
      <Animated.View
        style={[
          styles.technologyItem,
          {
            transform: [
              { scale: animations.scale },
              { translateY: animations.translateY },
            ],
            opacity: animations.opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.technologyTouchable}
          onPress={() => setSelectedTechnology(item)}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.technologyText}>{item}</ThemedText>
          {/* Add a cool icon */}
          <View style={styles.technologyIcon}>
            <ThemedText style={styles.iconText}>📚</ThemedText>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const probidhanOptions = [
    {
      id: "2016",
      title: "Probidhan 2016",
      technologies: [
        "Civil Technology",
        "Computer Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Mechanical Technology",
        "Power Technology",
        "Electro Medical Technology",
      ],
    },
    {
      id: "2022",
      title: "Probidhan 2022",
      technologies: [
        "Civil Technology",
        "Computer Science and Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Mechanical Technology",
        "Power Technology",
        "Electro Medical Technology",
      ],
    },
  ];

  useEffect(() => {
    const handleBackPress = () => {
      if (selectedTechnology) {
        setSelectedTechnology(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, [selectedTechnology]);

  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        {selectedTechnology ? (
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setSelectedTechnology(null)}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color="#111" />
                <ThemedText
                  type="title"
                  style={{ color: "#111", fontSize: 18 }}
                >
                  {selectedTechnology}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Technology Details */}
            <TechnologyComponent
              techName={selectedTechnology}
              selectedProbidhan={selectedProbidhan}
              onBack={() => setSelectedTechnology(null)}
            />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {probidhanOptions.map((probidhan) => {
              // Initialize scale animation for this probidhan
              initializeProbidhanScale(probidhan.id);
              const scaleRef = probidhanScaleRefs.current[probidhan.id];

              return (
                <View key={probidhan.id}>
                  <Animated.View
                    style={[
                      {
                        transform: [{ scale: scaleRef || 1 }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.probidhanItem}
                      onPress={async () => {
                        // Add bounce animation
                        animateProbidhanBounce(probidhan.id);

                        if (selectedProbidhan === probidhan.id) {
                          // Closing - animate out then clear selection
                          await animateItemsOut(probidhan.id);
                          setSelectedProbidhan(null);
                        } else {
                          // Opening - set selection first, then animate in
                          if (selectedProbidhan) {
                            await animateItemsOut(selectedProbidhan);
                          }
                          setSelectedProbidhan(probidhan.id);
                          initializeAnimation(
                            probidhan.id,
                            probidhan.technologies
                          );
                          setTimeout(() => {
                            animateItemsIn(
                              probidhan.id,
                              probidhan.technologies
                            );
                          }, 50);
                        }
                      }}
                    >
                      <ThemedText type="title" style={styles.probidhanText}>
                        {probidhan.title}
                      </ThemedText>
                      {/* Add expand/collapse indicator */}
                      <ThemedText style={styles.expandIcon}>
                        {selectedProbidhan === probidhan.id ? "▲" : "▼"}
                      </ThemedText>
                    </TouchableOpacity>
                  </Animated.View>

                  {selectedProbidhan === probidhan.id && (
                    <View style={styles.technologiesContainer}>
                      {probidhan.technologies.map((item, index) => (
                        <AnimatedTechnologyItem
                          key={`${probidhan.id}-${index}`}
                          item={item}
                          index={index}
                          probidhanId={probidhan.id}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}
      </ThemedView>
    </SwipeToOpenDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#b5ff00",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#b5ff00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    
  },

  probidhanItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 15,
    gap: 12,
    backgroundColor: "rgba(181, 255, 0, 0.05)",
    borderLeftWidth: 4,
    borderLeftColor: "#b5ff00",
    marginHorizontal: 6,
    marginVertical: 4,
    shadowColor: "#b5ff00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  probidhanText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  expandIcon: {
    fontSize: 16,
    color: "#b5ff00",
    fontWeight: "bold",
    marginLeft: 10,
  },
  technologiesContainer: {
    paddingVertical: 8,
  },
  technologyItem: {
    height: 55,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 15,
    backgroundColor: "#111",
    borderLeftWidth: 4,
    borderLeftColor: "#b5ff00",
    shadowColor: "#b5ff00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  technologyTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  technologyText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    flex: 1,
  },
  technologyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(181, 255, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 16,
  },
});
