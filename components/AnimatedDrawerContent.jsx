// import { DrawerContentScrollView } from '@react-navigation/drawer';
// import { Pressable, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// function AnimatedDrawerItem({ label, icon, focused, onPress, activeTintColor, inactiveTintColor }) {
//   const color = focused ? activeTintColor : inactiveTintColor;

//   return (
//     <Pressable
//       onPress={onPress}
//       android_ripple={{ color: '#00000022' }}
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         marginVertical: 2,
//         borderRadius: 12,
//         borderWidth: focused ? 2 : 1,
//         borderColor: focused ? '#b5ff00' : '#555',
//         backgroundColor: focused ? '#b5ff0011' : 'transparent',
//       }}
//     >
//       {icon ? <View style={{ marginRight: 16 }}>{icon({ color, size: 22 })}</View> : null}
//       <Text style={{ color, fontSize: 16, fontWeight: focused ? '700' : '500' }}>{label}</Text>
//     </Pressable>
//   );
// }

// export default function AnimatedDrawerContent(props) {
//   const routes = props.state?.routes || [];
//   const activeTintColor = '#b5ff00';
//   const inactiveTintColor = '#fff';

//   return (
//     <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#111' }}>
//       <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}>
//         <View style={{ paddingHorizontal: 8, gap: 6 }}>
//           {routes.map((route, index) => {
//             const focused = props.state.index === index;
//             const { drawerLabel, title, drawerIcon } = props.descriptors[route.key].options;
//             const label = typeof drawerLabel === 'string' ? drawerLabel : (title ?? route.name);
//             return (
//               <AnimatedDrawerItem
//                 key={route.key}
//                 label={label}
//                 icon={drawerIcon}
//                 focused={focused}
//                 activeTintColor={activeTintColor}
//                 inactiveTintColor={inactiveTintColor}
//                 onPress={() => {
//                   if (route.name === 'bteb') {
//                     props.navigation.navigate('webview', { url: 'https://bteb.gov.bd/' });
//                   } else if (route.name === 'admission') {
//                     props.navigation.navigate('webview', { url: 'http://btebadmission.gov.bd/website/' });
//                   } else {
//                     props.navigation.navigate(route.name);
//                   }
//                 }}
//               />
//             );
//           })}
//         </View>
//       </DrawerContentScrollView>
//     </SafeAreaView>
//   );
// }
