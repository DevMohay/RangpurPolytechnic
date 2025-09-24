import {
  DrawerContentScrollView,
  useDrawerStatus,
} from "@react-navigation/drawer";
import {
  Book,
  ClipboardPen,
  FileQuestion,
  GraduationCap,
  Home,
  Info,
  School,
  Shield,
} from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Animated Drawer Item Component
function AnimatedDrawerItem({ label, icon: Icon, onPress, index, isOpen, isActive }) {
  const animatedValue = useSharedValue(0);
  const pressValue = useSharedValue(1);

  useEffect(() => {
    if (isOpen) {
      // Reset and animate in with delay based on index
      animatedValue.value = 0;
      animatedValue.value = withDelay(
        index * 80, // 80ms delay between each item for faster sequence
        withSpring(1, {
          damping: 6, // Lower damping for more bounce
          stiffness: 120, // Higher stiffness for snappier animation
          mass: 0.7, // Lower mass for lighter feel
        })
      );
    } else {
      // Animate out quickly
      animatedValue.value = withTiming(0, {
        duration: 200,
      });
    }
  }, [isOpen, index]);

  const handlePressIn = () => {
    pressValue.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    pressValue.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const progress = animatedValue.value;
    const press = pressValue.value;

    return {
      opacity: interpolate(progress, [0, 1], [0, 1]),
      transform: [
        {
          translateX: interpolate(progress, [0, 0.7, 1], [-150, -15, 0]),
        },
        {
          scale:
            interpolate(progress, [0, 0.6, 0.85, 1], [0.5, 1.15, 0.95, 1]) *
            press,
        },
        {
          // 🔥 এখানে ঠিক করা হলো
          rotate: `${interpolate(progress, [0, 0.5, 1], [-3, 1, 0])}deg`,
        },
      ],
    };
  });

  const iconColor = isActive ? '#111' : '#b5ff00';
  const backgroundColor = isActive ? '#b5ff00' : 'rgba(181, 255, 0, 0.05)';
  const textColor = isActive ? '#111' : '#fff';
  const borderLeftColor = isActive ? '#74a100ff' : '#b5ff00';

  return (
    <Animated.View style={[animatedStyle, { marginVertical: 4 }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: "#b5ff0033", borderless: false }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderRadius: 15,
          backgroundColor: backgroundColor,
          borderLeftWidth: 4,
          borderLeftColor: borderLeftColor,
          marginHorizontal: 8,
          shadowColor: "#b5ff00",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <View style={{ marginRight: 16, opacity: 0.9 }}>
          <Icon color={iconColor} size={24} />
        </View>
        <Text
          style={{
            color: textColor,
            fontSize: 17,
            fontWeight: "600",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// Header Animation Component
function AnimatedHeader({ isOpen }) {
  const headerValue = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      headerValue.value = withDelay(
        20, // Very small delay for header to appear first
        withSpring(1, {
          damping: 8,
          stiffness: 150,
          mass: 0.8,
        })
      );
    } else {
      headerValue.value = withTiming(0, { duration: 150 });
    }
  }, [isOpen]);

  const headerStyle = useAnimatedStyle(() => {
    const progress = headerValue.value;

    return {
      opacity: interpolate(progress, [0, 1], [0, 1]),
      transform: [
        {
          translateX: interpolate(progress, [0, 0.6, 1], [-80, -5, 0]),
        },
        {
          translateY: interpolate(progress, [0, 0.4, 1], [-20, -2, 0]),
        },
        {
          scale: interpolate(progress, [0, 0.5, 0.8, 1], [0.7, 1.1, 0.98, 1]),
        },
        {
          rotate: `${interpolate(progress, [0, 0.5, 1], [-3, 1, 0])}deg`, // ✅ fixed
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        headerStyle,
        { paddingHorizontal: 20, paddingVertical: 16, marginBottom: 10 },
      ]}
    >
      <View
        style={{
          backgroundColor: "rgba(181, 255, 0, 0.1)",
          borderRadius: 20,
          paddingVertical: 20,
          paddingHorizontal: 24,
          alignItems: "center",
          borderWidth: 2,
          borderColor: "rgba(181, 255, 0, 0.3)",
        }}
      >
        <Text
          style={{
            color: "#b5ff00",
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          🎓 Rangpur Polytechnic
        </Text>
        <View
          style={{
            width: 60,
            height: 3,
            backgroundColor: "#b5ff00",
            borderRadius: 2,
            marginTop: 10,
          }}
        />
      </View>
    </Animated.View>
  );
}

// Footer Animation Component
function AnimatedFooter({ isOpen }) {
  const footerValue = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      footerValue.value = withDelay(
        800, // Delay until after all menu items
        withSpring(1, {
          damping: 12,
          stiffness: 100,
        })
      );
    } else {
      footerValue.value = withTiming(0, { duration: 100 });
    }
  }, [isOpen]);

  const footerStyle = useAnimatedStyle(() => {
    const progress = footerValue.value;

    return {
      opacity: interpolate(progress, [0, 1], [0, 0.7]),
      transform: [
        {
          translateY: interpolate(progress, [0, 1], [30, 0]),
        },
        {
          scale: interpolate(progress, [0, 1], [0.8, 1]),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[footerStyle, { paddingTop: 30, paddingHorizontal: 20 }]}
    >
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "rgba(181, 255, 0, 0.2)",
          paddingTop: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#666",
            fontSize: 12,
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          © 2024 Rangpur Polytechnic Institute
        </Text>
        <Text
          style={{
            color: "#555",
            fontSize: 10,
            textAlign: "center",
            marginTop: 4,
          }}
        >
          Made with ❤️ for education
        </Text>
      </View>
    </Animated.View>
  );
}

export default function SimpleDrawerContent(props) {
  const drawerStatus = useDrawerStatus();
  const isOpen = drawerStatus === "open";

  const activeDrawerRoute = props.state.routes[props.state.index];
  let activeRouteName = activeDrawerRoute.name;

  if (activeDrawerRoute.state) {
    const nestedState = activeDrawerRoute.state;
    activeRouteName = nestedState.routes[nestedState.index].name;
  }

  const menuItems = [
    {
      name: "index",
      label: "Home",
      icon: Home,
      action: () =>
        props.navigation.navigate("(tabs)", {
          screen: "index",
        }),
    },
    {
      name: "bteb",
      label: "BTEB",
      icon: Book,
      action: () => props.navigation.navigate("(tabs)", { screen: "bteb" }),
    },
    {
      name: "admission",
      label: "Admission",
      icon: ClipboardPen,
      action: () => props.navigation.navigate("(tabs)", { screen: "admission" }),
    },
    {
      name: "questions",
      label: "Questions",
      icon: FileQuestion,
      action: () => props.navigation.navigate("questions"),
    },
    {
      name: "results",
      label: "Results",
      icon: GraduationCap,
      action: () => props.navigation.navigate("results"),
    },
    {
      name: "about",
      label: "About",
      icon: Info,
      action: () => props.navigation.navigate("about"),
    },
    {
      name: "privacy-policy",
      label: "Privacy Policy",
      icon: Shield,
      action: () => props.navigation.navigate("privacy-policy"),
    },
  ];
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#111" }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Header */}
        <AnimatedHeader isOpen={isOpen} />

        {/* Animated Menu Items */}
        <View style={{ paddingTop: 10 }}>
          {menuItems.map((item, index) => (
            <AnimatedDrawerItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              onPress={item.action}
              index={index}
              isOpen={isOpen}
              isActive={item.name === activeRouteName}
            />
          ))}
        </View>

        {/* Animated Footer */}
        <AnimatedFooter isOpen={isOpen} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}
