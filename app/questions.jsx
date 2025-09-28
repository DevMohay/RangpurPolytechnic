import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Text, Animated, FlatList } from "react-native";

import SwipeToOpenDrawer from "@/components/SwipeToOpenDrawer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const subjects = [
  { code: "21011", name: "Engineering Drawing" },
  { code: "25711", name: "Bangla-I" },
  { code: "25712", name: "English-I" },
  { code: "25721", name: "Bangla-II" },
  { code: "25722", name: "English-II" },
  { code: "25811", name: "Social Science" },
  { code: "25812", name: "Physical Education & Life Skills Development" },
  { code: "25831", name: "Business Communication" },
  { code: "25841", name: "Accounting" },
  { code: "25851", name: "Principles of Marketing" },
  { code: "25852", name: "Industrial Management" },
  { code: "25853", name: "Innovation & Entrepreneurship" },
  { code: "25911", name: "Mathematics-I" },
  { code: "25912", name: "Physics-I" },
  { code: "25913", name: "Chemistry" },
  { code: "25921", name: "Mathematics-II" },
  { code: "25922", name: "Physics-II" },
  { code: "25931", name: "Mathematics-III" },
  { code: "26211", name: "Automobile Fundamentals" },
  { code: "26411", name: "Civil Engineering Materials" },
  { code: "26421", name: "Civil Engineering Drawing" },
  { code: "26431", name: "Structural Mechanics" },
  { code: "26432", name: "Surveying-I" },
  { code: "26433", name: "Construction Process-I" },
  { code: "26441", name: "Construction Process-II" },
  { code: "26442", name: "Estimating & Costing-I" },
  { code: "26443", name: "Civil CAD-I" },
  { code: "26444", name: "Surveying-II" },
  { code: "26445", name: "Geotechnical Engineering" },
  { code: "26454", name: "Theory of Structure" },
  { code: "26455", name: "Water Supply Engineering" },
  { code: "26456", name: "Hydraulics" },
  { code: "26461", name: "Water Resources Engineering" },
  { code: "26462", name: "Advance Surveying" },
  { code: "26463", name: "Transportation Engineering-I" },
  { code: "26464", name: "Design of Structure-I" },
  { code: "26471", name: "Civil Engineering Project" },
  { code: "26472", name: "Sanitary Engineering" },
  { code: "26473", name: "Transportation Engineering-II" },
  { code: "26474", name: "Design of Structure-II" },
  { code: "26475", name: "Estimating & Costing-II" },
  { code: "26611", name: "Computer Office Application" },
  { code: "26621", name: "Python Programming" },
  { code: "26622", name: "Computer Graphics Design-I" },
  { code: "26631", name: "Application Development Using Python" },
  { code: "26632", name: "Computer Graphics Design-II" },
  { code: "26633", name: "IT Support Services" },
  { code: "26641", name: "Java Programming" },
  { code: "26642", name: "Data Structure & Algorithm" },
  { code: "26643", name: "Computer Peripherals & Interfacing" },
  { code: "26644", name: "Web Design & Development-I" },
  { code: "26651", name: "Application Development Using Java" },
  { code: "26652", name: "Web Design & Development-II" },
  { code: "26653", name: "Computer Architecture & Microprocessor" },
  { code: "26654", name: "Data Communication" },
  { code: "26655", name: "Operating System" },
  { code: "26656", name: "Project Work-I" },
  { code: "26661", name: "Database Management System" },
  { code: "26662", name: "Computer Networking" },
  { code: "26663", name: "Sensor & IoT System" },
  { code: "26664", name: "Microcontroller Based System Design & Development" },
  { code: "26665", name: "Surveillance Security System" },
  { code: "26666", name: "Web Development Project" },
  { code: "26667", name: "Programming in C" },
  { code: "26671", name: "Digital Marketing Technique" },
  { code: "26672", name: "Network Administration & Services" },
  { code: "26673", name: "Cyber Security & Ethics" },
  { code: "26674", name: "Apps Development Project" },
  { code: "26675", name: "Multimedia & Animation" },
  { code: "26676", name: "Project Work-II" },
  { code: "26711", name: "Basic Electricity" },
  { code: "26712", name: "Electrical Engineering Materials" },
  { code: "26721", name: "Electrical Circuits-I" },
  { code: "26722", name: "Electrical Engineering Drawing" },
  { code: "26731", name: "Electrical Circuits-II" },
  { code: "26732", name: "Electrical Appliances" },
  { code: "26741", name: "Electrical Installation, Planning and Estimating" },
  { code: "26742", name: "DC Machine" },
  { code: "26743", name: "Electrical Engineering Project-I" },
  { code: "26751", name: "Generation of Electrical Power" },
  { code: "26752", name: "Electrical & Electronic Measurements-I" },
  { code: "26753", name: "Electrical & Electronic Measurements-I" },
  { code: "26754", name: "Electrical Engineering Project-II" },
  { code: "26761", name: "AC Machine-I" },
  { code: "26762", name: "Transmission and Distribution of Electrical Power-I" },
  { code: "26763", name: "Electrical & Electronic Measurements-II" },
  { code: "26764", name: "Transmission and Distribution of Electrical Power" },
  { code: "26771", name: "AC Machine-II" },
  { code: "26772", name: "Transmission and Distribution of Electrical Power-II" },
  { code: "26773", name: "Switch Gear and Protection" },
  { code: "26774", name: "Electrical Engineering Project-III" },
  { code: "26811", name: "Basic Electronics" },
  { code: "26821", name: "Electronic Devices and Circuits" },
  { code: "26831", name: "Digital Electronics-I" },
  { code: "26832", name: "Power Electronics" },
  { code: "26833", name: "Industrial Electronics" },
  { code: "26841", name: "Digital Electronics-II" },
  { code: "26842", name: "Communication Engineering" },
  { code: "26843", name: "Networks, Filters and Transmission Lines" },
  { code: "26844", name: "Electronic Servicing" },
  { code: "26845", name: "Digital Electronics" },
  { code: "26851", name: "Television Engineering" },
  { code: "26852", name: "Electronic Appliances" },
  { code: "26853", name: "Microprocessor & Microcontroller" },
  { code: "26861", name: "TV Studio and Broadcasting" },
  { code: "26862", name: "Microcontroller and Embedded System" },
  { code: "26863", name: "PCB Design and Prototyping" },
  { code: "26871", name: "Microwave Radar and Navigation Aids" },
  { code: "26872", name: "Industrial Automation and PLC" },
  { code: "26873", name: "Control System and Robotics" },
  { code: "26874", name: "Electronic Project" },
  { code: "26875", name: "Automation Engineering & PLC" },
  { code: "27011", name: "Basic Workshop Practice" },
  { code: "27012", name: "Machine Shop Practice-I" },
  { code: "27021", name: "Mechanical Engineering Drawing" },
  { code: "27022", name: "Mechanical Engineering Materials" },
  { code: "27031", name: "Machine Shop Practice-II" },
  { code: "27041", name: "Engineering Mechanics" },
  { code: "27042", name: "Machine Shop Practice III" },
  { code: "27043", name: "Metallurgy" },
  { code: "27044", name: "Applied Mechanics" },
  { code: "27051", name: "Fluid Mechanics & Machineries" },
  { code: "27052", name: "Mechanical Estimating & Costing" },
  { code: "27053", name: "Advanced Welding-I" },
  { code: "27054", name: "Foundry & Pattern Making" },
  { code: "27055", name: "Manufacturing Process" },
  { code: "27061", name: "Strength of Materials" },
  { code: "27062", name: "Mechanical Measurement & Metrology" },
  { code: "27063", name: "CAD & CAM" },
  { code: "27064", name: "Advanced Welding-II" },
  { code: "27065", name: "Plant Engineering & Maintenance" },
  { code: "27071", name: "Design of Machine Elements" },
  { code: "27072", name: "Tool Design" },
  { code: "27073", name: "Heat Treatment of Metal" },
  { code: "27074", name: "Mechanical Engineering Project" },
  { code: "27075", name: "Production Planning & Control" },
  { code: "27111", name: "Power Engineering Fundamental" },
  { code: "27121", name: "Power Equipment Management & Safety" },
  { code: "27131", name: "Engineering Thermodynamics" },
  { code: "27141", name: "IC Engine Details" },
  { code: "27142", name: "Fuels & Lubricants" },
  { code: "27143", name: "Boiler Operation & Maintenance" },
  { code: "27151", name: "Fundamentals of Hybrid & Electric Vehicle" },
  { code: "27152", name: "Power Plant Engineering" },
  { code: "27161", name: "Engine Overhauling, Inspection & Testing" },
  { code: "27171", name: "Service Station Operation & Estimating Automotive" },
  { code: "27172", name: "Electricity, Electronics & Communication System" },
  { code: "27173", name: "Power Engineering Project" },
  { code: "27231", name: "RAC Cycles and Components" },
  { code: "28611", name: "Human Anatomy and Physiology" },
  { code: "28621", name: "Basic Biomedical Engineering" },
  { code: "28631", name: "Medical Transducer and Sensors" },
  { code: "28632", name: "Operating Room Equipment" },
  { code: "28641", name: "Dental Equipment" },
  { code: "28642", name: "Anaesthesia and Respiratory Equipment" },
  { code: "28651", name: "Radiology and Imaging Equipment" },
  { code: "28652", name: "Fibre Optics and Laser in Medical Field" },
  { code: "28653", name: "Physiotherapy and Rehabilitation Devices" },
  { code: "28654", name: "Bio-Medical Instruments" },
  { code: "28861", name: "Advanced Construction" },
  { code: "28863", name: "Steel Structures" },
  { code: "29041", name: "Environmental Studies" },
  { code: "29071", name: "Construction Management & Documentation" },
  { code: "29231", name: "Mechatronics & PLC" },
];

export default function QuestionsScreen() {
  const [searchText, setSearchText] = useState("");

  const filteredSubjects = subjects.filter(
    (s) =>
      s.code.toLowerCase().includes(searchText.toLowerCase()) ||
      s.name.toLowerCase().includes(searchText.toLowerCase())
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

  const renderItem = ({ item }) => {
    const anim = getAnimForKey(item.code);
    return (
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
    );
  };

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
    backgroundColor: "#b5ff00",
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
    gap: 12,
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
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
