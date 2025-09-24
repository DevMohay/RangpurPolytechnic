# 🎨 Drawer Navigation Animations

Your RangpurPolytechnic app now features beautiful, smooth animations for the drawer navigation menu!

## ✨ Animation Features

### 🎯 **Individual Menu Item Animations**
Each menu item animates with a **staggered sequence** (80ms delay between items):

- **Slide In**: Items slide from left (-150px) with overshoot effect
- **Fade In**: Opacity animates from 0 to 1
- **Bounce Effect**: Multi-keyframe scale animation (0.5 → 1.15 → 0.95 → 1.0)
- **Rotation**: Subtle rotation effect (2° → -1° → 0°) for extra flair
- **Press Animation**: Scale down to 0.95 when pressed with spring animation

### 🎭 **Header Animation**
The header "🎓 Rangpur Polytechnic" animates with:
- **Fast Entry**: 20ms delay (appears first)
- **Dramatic Slide**: From left with vertical offset
- **Scale Bounce**: (0.7 → 1.1 → 0.98 → 1.0)
- **Rotation**: (-3° → 1° → 0°)

### 👣 **Footer Animation**
The footer appears last with:
- **800ms Delay**: After all menu items finish
- **Fade In**: Soft opacity animation to 0.7
- **Slide Up**: From bottom with scale effect

## 🎛️ **Animation Timing**

```
Header:     20ms delay
Menu Item 1: 0ms delay
Menu Item 2: 80ms delay  
Menu Item 3: 160ms delay
Menu Item 4: 240ms delay
Menu Item 5: 320ms delay
Menu Item 6: 400ms delay
Menu Item 7: 480ms delay
Menu Item 8: 560ms delay
Footer:     800ms delay
```

## 🎨 **Visual Effects**

- **Shadows**: Dynamic green (#b5ff00) shadows with elevation
- **Border Effects**: Left border accents on each item
- **Ripple Effects**: Android ripple feedback
- **Smooth Springs**: React Native Reanimated spring physics
- **Color Theming**: Consistent green accent throughout

## 🚀 **How to Experience**

1. **Open Drawer**: Tap hamburger menu or swipe from left
2. **Watch Animation**: Each item slides in one by one with bounce
3. **Press Items**: Feel the subtle press feedback
4. **Close/Reopen**: Animation plays each time drawer opens

The animations create a delightful, professional user experience with perfect timing and smooth physics!