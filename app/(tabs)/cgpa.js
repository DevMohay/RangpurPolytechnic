import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Equal, RefreshCw, GraduationCap } from "lucide-react-native";

const { width } = Dimensions.get("window");
const normalizeFontSize = (size) => {
  if (width < 360) return size * 0.85;
  if (width < 400) return size * 0.9;
  return size;
};

const getSemesterLabel = (index) => {
  const ordinals = ["1st", "2nd", "3rd"];
  const number = index + 1;
  const suffix = number <= 3 ? ordinals[number - 1] : `${number}th`;
  return `${suffix} Semester`;
};

const formula2016 = [5, 5, 5, 10, 15, 20, 25, 15];
const formula2022 = [5, 5, 10, 10, 20, 20, 20, 10];

const validGpa = (CGPA) => {
  const regex = /^[01234]{1}\.[\d]{2}$/;
  if (regex.test(CGPA) && CGPA <= 4) {
    return gradeCalculation(CGPA);
  } else {
    return false;
  }
};

const gradeCalculation = (CGPA) => {
  CGPA = parseFloat(CGPA);
  if (CGPA === 4.0) return "A+";
  if (CGPA >= 3.75) return "A";
  if (CGPA >= 3.5) return "A-";
  if (CGPA >= 3.25) return "B+";
  if (CGPA >= 3.0) return "B";
  if (CGPA >= 2.75) return "B-";
  if (CGPA >= 2.5) return "C+";
  if (CGPA >= 2.25) return "C";
  if (CGPA >= 2.0) return "D";
  if (CGPA === 0.0) return "F";
  return "?";
};

const calculateCGPA = (cgpaArray, formula) => {
  if (cgpaArray.includes(0.0)) return "0.00";
  let total = 0;
  for (let i = 0; i < cgpaArray.length; i++) {
    total += (cgpaArray[i] * formula[i]) / 100;
  }
  return total.toFixed(2);
};

export default function CgpaScreen() {
  const navigation = useNavigation();
  const [probidhan, setProbidhan] = useState(2016);
  const [cgpas, setCgpas] = useState(Array(8).fill(""));
  const [grades, setGrades] = useState(Array(8).fill("--"));
  const [finalCgpa, setFinalCgpa] = useState("0.00");
  const [finalGrade, setFinalGrade] = useState("--");

  const handleGesture = (event) => {
    const { translationX } = event.nativeEvent;
    if (translationX > 50) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const handleInputChange = (index, value) => {
    const newCgpas = [...cgpas];
    const newGrades = [...grades];
    newCgpas[index] = value;

    const grade = validGpa(value);
    newGrades[index] = grade ? grade : "?";

    setCgpas(newCgpas);
    setGrades(newGrades);
  };

  const handleCalculate = () => {
    const hasEmpty = cgpas.some((gpa) => gpa.trim() === "");
    if (hasEmpty) {
      Alert.alert("Incomplete Input", "সবগুলো সেমিস্টারের GPA পূরণ করুন");
      return;
    }

    const cgpaNumbers = cgpas.map((gpa) => parseFloat(gpa));
    const formula = probidhan === 2022 ? formula2022 : formula2016;
    const result = calculateCGPA(cgpaNumbers, formula);
    setFinalCgpa(result);
    setFinalGrade(gradeCalculation(result));
  };

  useEffect(() => {
    const cgpaNumbers = cgpas.map((gpa) => parseFloat(gpa) || 0);
    const formula = probidhan === 2022 ? formula2022 : formula2016;
    const result = calculateCGPA(cgpaNumbers, formula);
    setFinalCgpa(result);
    setFinalGrade(gradeCalculation(result));
  }, [probidhan]);

  const resetAll = () => {
    setCgpas(Array(8).fill(""));
    setGrades(Array(8).fill("--"));
    setFinalCgpa("0.00");
    setFinalGrade("--");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.mainBox}>
              <View style={{ flexDirection: "column" }}>
                <View style={styles.header}>
                  <Text style={styles.title}>Probidhan</Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        probidhan === 2016 && styles.activeButton,
                      ]}
                      onPress={() => setProbidhan(2016)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          probidhan === 2016 && styles.activeButtonText,
                        ]}
                      >
                        2016
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.button,
                        probidhan === 2022 && styles.activeButton,
                      ]}
                      onPress={() => setProbidhan(2022)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          probidhan === 2022 && styles.activeButtonText,
                        ]}
                      >
                        2022
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {cgpas.map((value, index) => (
                <View key={index} style={styles.inputRow}>
                  <Text style={styles.label}>{getSemesterLabel(index)}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.input}
                      value={value}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor="#888"
                      onChangeText={(text) => handleInputChange(index, text)}
                    />
                    <Text style={styles.grade}>{grades[index]}</Text>
                  </View>
                </View>
              ))}

              <View style={{ alignItems: "center" }}>
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetAll}
                  >
                    <RefreshCw color="#fff" size={20} />
                    <Text style={styles.resetText}>Reset</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.calculateButton}
                    onPress={handleCalculate}
                  >
                    <Equal color="#fff" size={24} />
                  </TouchableOpacity>
                  
                </View>
                <View style={styles.resultContainer}>
                  <Text>
                   
                    <Text style={styles.resultText}>CGPA:</Text>
                    <Text style={styles.resultColor}> {finalCgpa}</Text>
                    <Text style={styles.resultText}>,GRADE: </Text>
                    <Text style={styles.resultColor}> {finalGrade}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 40,
    backgroundColor: "#b5ff00",
    alignItems: "center",
    flexGrow: 1,
  },
  mainBox: {
    width: "98%",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: normalizeFontSize(24),
    color: "#fff",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginHorizontal: 5,
    backgroundColor: "#333",
  },
  activeButton: {
    backgroundColor: "#99cc00",
    borderColor: "#000",
  },
  buttonText: {
    color: "#fff",
    fontSize: normalizeFontSize(18),
  },
  activeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#555",
    width: "100%",
    marginVertical: 15,
  },
  inputRow: {
    width: "100%",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: normalizeFontSize(14),
    fontWeight: "600",
    color: "#111",
    backgroundColor: "#b5ff00",
    width: "50%",
    height: 38,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 5,
    paddingTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    width: 80,
    height: 40,
    fontWeight: "bold",
    borderRadius: 8,
    marginRight: 5,
    fontSize: normalizeFontSize(18),
    textAlign: "center",
    backgroundColor: "#111",
    color: "#fff",
  },
  grade: {
    fontSize: normalizeFontSize(20),
    fontWeight: "bold",
    color: "#b5ff00",
    backgroundColor: "#111",
    width: 80,
    height: 40,
    borderRadius: 8,
    textAlign: "center",
    textAlignVertical: "center",
    paddingTop: 6,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  calculateButton: {
    backgroundColor: "#99cc00",
    borderRadius: 6,
    width: 40,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButton: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#99cc00",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
  },
  resultText: {
    fontSize: normalizeFontSize(18),
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  resultColor: {
    fontSize: normalizeFontSize(18),
    fontWeight: "bold",
    color: "#99cc00",
    textAlign: "center",
  },
});
