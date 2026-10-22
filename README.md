# On Android, an `@expo/ui` control inside a `Pressable` loses a finger's tap

`@expo/ui` 58.0.21, Expo SDK 58 (React Native 0.88.0, New Architecture),
Android 17 emulator (x86_64), debug and release builds.

1. `npm install`, then `npx expo run:android`.
2. The screen has five rows, and each counts what a tap did, on screen and as
   a `[repro]` line in `adb logcat -s ReactNativeJS`:
   1. an `@expo/ui` `Button` inside a `Pressable` that has an `onPress` of its
      own;
   2. the same `Button` with that `Pressable` laid beneath it as a sibling
      instead of around it;
   3. an `@expo/ui` `Switch` inside a `Pressable`;
   4. React Native's own `Switch` inside a `Pressable`;
   5. an `@expo/ui` `TextInput` inside a `Pressable`.
3. Tap each control as a finger does. On a phone, use a finger. On an
   emulator, use a tap that moves 3 px over 200 ms, well inside the touch
   slop, so Android still counts it as a tap:

   ```
   adb shell input swipe <x> <y> <x+3> <y+3> 200
   ```

Expected: each tap presses the control under it, as it does for React
Native's `Switch` in row 4.

Actual: the `@expo/ui` controls in rows 1, 3 and 5 never respond, and in row 1
the `Pressable` around the button takes the press instead.

Ten taps on each control, the same in a debug build and in a release build:

| Row | Moving tap (`input swipe`, 3 px over 200 ms) | Still tap (`input tap`) |
| --- | --- | --- |
| 1. `@expo/ui` `Button` inside a `Pressable` | button 0, `Pressable` 10 | button 10, `Pressable` 10 |
| 2. The same `Button` beside a `Pressable` | button 10, `Pressable` 0 | button 10, `Pressable` 0 |
| 3. `@expo/ui` `Switch` inside a `Pressable` | 0 toggles | 10 toggles |
| 4. React Native's `Switch` inside a `Pressable` | 10 toggles | 10 toggles |
| 5. `@expo/ui` `TextInput` inside a `Pressable` | never focused, no keyboard | focused by the first tap |

`adb shell input tap` releases at once, without moving, which no finger does.
That is why an automated tap sees the controls work while a person does not.
Even that still tap is wrong in row 1: it presses both the button and the
`Pressable` around it. A finger tap behaves the same way while JavaScript is
busy, as it is for the first tap right after launch, so now and then a finger
tap seems to work.
