import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, BackHandler, FlatList, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

import SwipeToOpenDrawer from "@/components/SwipeToOpenDrawer";
import { ThemedView } from "@/components/themed-view";
import QuestionsListComponent from "../components/QuestionsListComponent";

export default function QuestionsScreen() {
  const [searchText, setSearchText] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://rpiquestions.vercel.app/api/subjects');
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('API response data:', data);
        console.log('Is data an array?', Array.isArray(data));
        
        // Handle different response formats
        let subjectsArray = [];
        if (Array.isArray(data)) {
          subjectsArray = data;
        } else if (data && data.subjects && Array.isArray(data.subjects)) {
          subjectsArray = data.subjects;
        } else if (data && typeof data === 'object') {
          // If data is an object, try to extract array from common property names
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            subjectsArray = possibleArrays[0];
          }
        }
        
        console.log('Final subjects array:', subjectsArray);
        setSubjects(subjectsArray);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Handle Android hardware back press: if a subject is open, go back to list without reloading
  useEffect(() => {
    const onBackPress = () => {
      if (selectedSubject) {
        setSelectedSubject(null);
        return true; // we handled it
      }
      return false; // let default behavior occur
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [selectedSubject]);

  const filteredSubjects = subjects.filter(
    (s) =>
      s && s.code && s.name &&
      (s.code.toLowerCase().includes(searchText.toLowerCase()) ||
      s.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Animation refs per item (keyed by subject code)
  const animMapRef = useRef(new Map());
  const animatedKeysRef = useRef(new Set());

  const getAnimForKey = (key) => {
    if (!animMapRef.current.has(key)) {
      animMapRef.current.set(key, {
        scale: new Animated.Value(0.85),
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(12),
      });
    }
    return animMapRef.current.get(key);
  };

  const animateIn = (key, delayMs = 0) => {
    if (animatedKeysRef.current.has(key)) return;
    const { scale, opacity, translateY } = getAnimForKey(key);
    animatedKeysRef.current.add(key);
    setTimeout(() => {
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scale, {
            toValue: 1.05,
            tension: 140,
            friction: 12,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            tension: 140,
            friction: 10,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 140,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }, delayMs);
  };

  // Reset animations when the search text changes (so new results can animate in)
  useEffect(() => {
    animatedKeysRef.current.clear();
    filteredSubjects.forEach((s) => {
      const a = getAnimForKey(s.code);
      a.scale.setValue(0.85);
      a.opacity.setValue(0);
      a.translateY.setValue(12);
    });
  }, [searchText]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    viewableItems.forEach((vi, idx) => {
      if (vi?.item?.code) animateIn(vi.item.code, idx * 50);
    });
  }).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 30 };

  const handleSubjectPress = (subject) => {
    setSelectedSubject(subject);
  };

  const renderItem = ({ item }) => {
    const anim = getAnimForKey(item.code);
    return (
      <TouchableOpacity onPress={() => handleSubjectPress(item)}>
        <Animated.View
          style={[
            styles.subjectItem,
            {
              transform: [{ scale: anim.scale }, { translateY: anim.translateY }],
              opacity: anim.opacity,
            },
          ]}
        >
          <Text style={styles.subjectCode}>{item.code}</Text>
          <Text style={styles.subjectName}>{item.name}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (selectedSubject) {
    return (
      <SwipeToOpenDrawer>
        <QuestionsListComponent 
          subject={selectedSubject} 
          onBack={() => setSelectedSubject(null)} 
        />
      </SwipeToOpenDrawer>
    );
  }

  if (loading) {
    return (
      <SwipeToOpenDrawer>
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#b5ff00" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Loading subjects...</Text>
        </ThemedView>
      </SwipeToOpenDrawer>
    );
  }

  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Code or Name..."
          placeholderTextColor="#bbbbbbff"
          value={searchText}
          onChangeText={setSearchText}
        />

        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContent}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </SwipeToOpenDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  scrollContent: {
    padding: 20,
  },
  searchInput: {
    position: "relative",
    margin: 15,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#b5ff00",
    fontSize: 16,
    color: "#fff",
  },
  subjectItem: {
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
  subjectCode: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#afff81ff",
  },
  subjectName: {
    fontSize: 14,
    color: "#e0ffa6ff",
    marginTop: 4,
    fontStyle: "bold",
  },
});
