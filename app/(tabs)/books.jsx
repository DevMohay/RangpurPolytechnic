import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  BackHandler,
} from "react-native";
import SwipeToOpenDrawer from "@/components/SwipeToOpenDrawer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TechnologyComponent from "@/components/TechnologyComponent.jsx";

export default function BooksScreen() {
  const [selectedProbidhan, setSelectedProbidhan] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);

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

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

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
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>
              <ThemedText type="title" style={styles.headerTitle}>
                {selectedTechnology}
              </ThemedText>
            </View>

            {/* Technology Details */}
            <TechnologyComponent
              techName={selectedTechnology}
              selectedProbidhan={selectedProbidhan}
              onBack={() => setSelectedTechnology(null)}
            />
          </View>
        ) : (
          probidhanOptions.map((probidhan) => (
            <View key={probidhan.id}>
              <TouchableOpacity
                style={styles.probidhanItem}
                onPress={() =>
                  setSelectedProbidhan(
                    selectedProbidhan === probidhan.id ? null : probidhan.id
                  )
                }
              >
                <ThemedText type="title" style={styles.probidhanText}>
                  {probidhan.title}
                </ThemedText>
              </TouchableOpacity>

              {selectedProbidhan === probidhan.id && (
                <FlatList
                  data={probidhan.technologies}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.technologyItem}
                      onPress={() => setSelectedTechnology(item)}
                    >
                      <ThemedText style={styles.technologyText}>
                        {item}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          ))
        )}
      </ThemedView>
    </SwipeToOpenDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#b5ff00",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  probidhanItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#111",
    borderLeftWidth: 4,
    borderLeftColor: "white",
    marginHorizontal: 8,
    marginBottom: 10,
    shadowColor: "#b5ff00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  probidhanText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  technologyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#29490bff",
    borderLeftWidth: 4,
    borderLeftColor: "white",
    marginHorizontal: 8,
    marginVertical: 4,
    shadowColor: "#b5ff00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  technologyText: {
    fontSize: 16,
    color: "white",
  },
});
