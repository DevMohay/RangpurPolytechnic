import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import RoundedTabBar from '@/components/RoundedTabBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <RoundedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cgpa"
        options={{
          title: 'CGPA',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="graduationcap.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bteb"
        options={{
          href: null, // Hidden from tab bar
          title: 'BTEB',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="admission"
        options={{
          href: null, // Hidden from tab bar  
          title: 'Admission',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="graduationcap.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}