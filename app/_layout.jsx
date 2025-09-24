import 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Book, ClipboardPen, FileQuestion, GraduationCap, Home, Info, School, Shield } from 'lucide-react-native';
import { Image } from 'react-native';

import SimpleDrawerContent from '@/components/SimpleDrawerContent';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer
        screenOptions={{
          headerShown: true,
          swipeEnabled: true,
          swipeEdgeWidth: 50,
          headerStyle: { backgroundColor: '#b5ff00' },
          headerTintColor: '#111',
          drawerActiveTintColor: '#b5ff00',
          drawerActiveBackgroundColor: '#b5ff0011',
          drawerInactiveTintColor: '#fff',
          drawerStyle: { backgroundColor: '#111', width: 280 },
          headerRight: () => (
            <Image
              style={{ width: 40, height: 40, marginRight: 15, borderRadius: 20 }}
              source={require('@/assets/images/icon.png')}
            />
          ),
        }}
        drawerContent={(props) => <SimpleDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="rpi"
          options={{
            drawerLabel: 'RPI',
            title: 'RPI',
            drawerIcon: ({ color, size }) => <School color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="bteb"
          options={{
            drawerLabel: 'BTEB',
            title: 'BTEB',
            drawerIcon: ({ color, size }) => <Book color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="admission"
          options={{
            drawerLabel: 'Admission',
            title: 'Admission',
            drawerIcon: ({ color, size }) => <ClipboardPen color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="questions"
          options={{
            drawerLabel: 'Questions',
            title: 'Questions',
            drawerIcon: ({ color, size }) => <FileQuestion color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="results"
          options={{
            drawerLabel: 'Results',
            title: 'Results',
            drawerIcon: ({ color, size }) => <GraduationCap color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: 'About',
            title: 'About',
            drawerIcon: ({ color, size }) => <Info color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="privacy-policy"
          options={{
            drawerLabel: 'Privacy Policy',
            title: 'Privacy Policy',
            drawerIcon: ({ color, size }) => <Shield color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="webview"
          options={{
            drawerLabel: 'WebView',
            title: 'WebView',
            drawerIcon: ({ color, size }) => <Book color={color} size={size} />,
          }}
        />
      </Drawer>
      <StatusBar style="dark" backgroundColor="#b5ff00" translucent={false} />
    </ThemeProvider>
  );
}