import { View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ThemedView({ style, lightColor, darkColor, ...otherProps }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <View style={[{ backgroundColor, flex: 1 }, style]} {...otherProps} />
  );
}
