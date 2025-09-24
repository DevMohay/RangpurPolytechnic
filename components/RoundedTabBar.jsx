import { Book, GraduationCap, Home } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#b5ff00';

export default function RoundedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  const items = [
    { name: 'index', label: 'Home', Icon: Home },
    { name: 'cgpa', label: 'CGPA', Icon: GraduationCap },
    { name: 'books', label: 'Books', Icon: Book },
  ];

  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 12 + insets.bottom,
        backgroundColor: '#111',
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
        borderWidth: 1,
        borderColor: PRIMARY,
        
      }}
    >
      {items.map((item, idx) => {
        const isFocused = state.routes[state.index].name === item.name;
        const color = isFocused ? '#111' : '#ddd';
        const bg = isFocused ? PRIMARY : '#1b1b1b';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[idx]?.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(item.name);
          }
        };

        return (
          <Pressable
            key={item.name}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center' }}
            android_ripple={{ color: '#ffffff22', borderless: false }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 56,
                backgroundColor: bg,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: isFocused ? 2 : 1,
                borderColor: isFocused ? '#111' : '#2a2a2a',
              }}
            >
              <item.Icon color={color} size={26} />
            </View>
            <Text style={{ marginTop: 6, fontSize: 12, color: isFocused ? PRIMARY : '#bbb', fontWeight: isFocused ? '700' : '500' }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}


