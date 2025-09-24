import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import SwipeToOpenDrawer from "@/components/SwipeToOpenDrawer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Search, Save } from "lucide-react-native";

export default function ResultsScreen() {
  const [roll, setRoll] = useState("");
  const [resultData, setResultData] = useState(null);
  const [seasonName, setSeasonName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const viewRef = useRef();

  const checkResult = async () => {
    if (!roll) return;

    setLoading(true);
    setSearched(true);
    setResultData(null);
    setSeasonName(null);

    try {
      const indexRes = await fetch(
        "https://raw.githubusercontent.com/DevMohay/PolyMate-Results/refs/heads/main/student-results/index.json"
      );
      const seasonList = await indexRes.json();

      for (const season of seasonList) {
        const dataRes = await fetch(season.url);
        const data = await dataRes.json();

        const student = data.find((item) => item.roll.toString() === roll);
        if (student) {
          setResultData(student);
          setSeasonName(season.season);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const requestStoragePermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log('Permission status:', status);
      return status === "granted";
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  };

  const takeScreenshot = async () => {
    if (!resultData) {
      Alert.alert("Error", "No result data to save!");
      return;
    }

    try {
      console.log('Taking screenshot...');
      if (!viewRef.current) {
        Alert.alert("Error", "Screenshot view not ready. Please try again.");
        return;
      }

      const uri = await captureRef(viewRef.current, {
        format: "png",
        quality: 0.9,
        result: "tmpfile",
      });
      
      console.log('Screenshot taken:', uri);
      
      // Try to save to gallery first (works in production builds)
      try {
        console.log('Requesting permission...');
        const hasPermission = await requestStoragePermission();
        
        if (hasPermission) {
          console.log('Saving to gallery...');
          const asset = await MediaLibrary.saveToLibraryAsync(uri);
          console.log('Saved asset:', asset);
          
          Alert.alert(
            "Success!", 
            "Result screenshot saved to your gallery! ✅",
            [{ text: "OK", style: "default" }]
          );
          return;
        }
      } catch (permissionError) {
        console.log('Gallery save failed, trying share option:', permissionError.message);
      }
      
      // Fallback to sharing (works in Expo Go)
      const isShareAvailable = await Sharing.isAvailableAsync();
      if (isShareAvailable) {
        console.log('Using share option...');
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Save Result Screenshot',
        });
        
        Alert.alert(
          "Screenshot Ready!", 
          "Screenshot created! Use the share dialog to save or send your result. ✨",
          [{ text: "OK", style: "default" }]
        );
      } else {
        Alert.alert(
          "Error", 
          "Cannot save or share screenshot on this device.",
          [{ text: "OK", style: "default" }]
        );
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      Alert.alert(
        "Error", 
        `Failed to create screenshot: ${error.message || 'Unknown error'}`,
        [{ text: "OK", style: "default" }]
      );
    }
  };

  return (
    <SwipeToOpenDrawer>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.input}
            placeholder="Enter your roll number"
            placeholderTextColor="#fff"
            keyboardType="numeric"
            value={roll}
            onChangeText={setRoll}
          />
          <TouchableOpacity onPress={checkResult} style={styles.button}>
            <Search size={20} color="#fff" />
            <ThemedText style={styles.buttonText}>Check Result</ThemedText>
          </TouchableOpacity>

          {loading && (
            <ThemedText style={styles.noResult}>Loading...</ThemedText>
          )}

          {searched && !resultData && !loading ? (
            <ThemedText style={styles.noResult}>
              No result found for this roll
            </ThemedText>
          ) : (
            resultData && (
              <View style={styles.resultBlock} ref={viewRef}>
              

                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                  const gpaKey = `gpa${num}`;
                  const hasKey = Object.prototype.hasOwnProperty.call(
                    resultData,
                    gpaKey
                  );
                  if (hasKey) {
                    const gpa = resultData[gpaKey];
                    return (
                      <View
                        key={num}
                        style={{
                          flexDirection: "row",
                          marginBottom: 5,
                          backgroundColor: "#222",
                          padding: 10,
                          borderRadius: 5,
                        }}
                      >
                        <Text style={styles.semesterLabel}>
                          Semester {num}:
                        </Text>
                        <Text
                          style={[
                            styles.gpaValue,
                            gpa === null && { color: "red" },
                          ]}
                        >
                          {gpa === null ? "Failed" : gpa}
                        </Text>
                      </View>
                    );
                  }
                  return null;
                })}

                {resultData.fail_sub && resultData.fail_sub.length > 0 ? (
                  <View>
                    <Text style={styles.failedTitle}>Failed Subjects:</Text>
                    {resultData.fail_sub.map((sub, i) => (
                      <Text key={i} style={styles.failedSubject}>
                        {sub}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.passText}>Passed All Subjects ✅</Text>
                )}

                {resultData.cgpa && (
                  <View
                    style={{
                      marginTop: 15,
                      padding: 12,
                      backgroundColor: "#222",
                      borderRadius: 5,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Final Result (CGPA):{" "}
                      <Text style={{ color: "#00e676" }}>
                        {resultData.cgpa}
                      </Text>
                    </Text>
                  </View>
                )}

              </View>
            )
          )}
          
          {resultData && (
            <TouchableOpacity
              onPress={takeScreenshot}
              style={[styles.button, { marginTop: 15 }]}
            >
              <Save size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>
                Save Result Screenshot
              </ThemedText>
            </TouchableOpacity>
          )}
        </ScrollView>
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
  input: {
    borderWidth: 2,
    borderColor: "white",
    padding: 10,
    marginBottom: 10,
    color: "#fff",
    borderRadius: 8,
    backgroundColor: "#111",
    fontSize: 18,
    fontWeight: "bold",
  },
  semesterLabel: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 15,
  },
  gpaValue: {
    fontSize: 20,
    color: "#00e676",
    fontWeight: "bold",
  },
  noResult: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "white",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultBlock: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
  },
  passText: {
    color: "#00e676",
    fontWeight: "bold",
    marginTop: 10,
  },
  failedTitle: {
    fontWeight: "bold",
    color: "red",
    marginTop: 10,
  },
  failedSubject: {
    color: "red",
    marginLeft: 10,
  },
});
