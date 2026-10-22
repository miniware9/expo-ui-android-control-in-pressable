import { Button, Host, Switch, TextInput } from '@expo/ui';
import { useState } from 'react';
import { Pressable, Switch as ReactNativeSwitch, StyleSheet, Text, View } from 'react-native';

// Every press is counted on screen and logged as a "[repro]" line, so a run
// can be read from the screen or from `adb logcat -s ReactNativeJS`.
function useCounter(name: string) {
  const [count, setCount] = useState(0);
  const press = () => {
    console.log(`[repro] ${name}`);
    setCount((previous) => previous + 1);
  };
  return [count, press] as const;
}

export default function App() {
  const [insideButton, pressInsideButton] = useCounter('1 button');
  const [insidePressable, pressInsidePressable] = useCounter('1 pressable');
  const [besideButton, pressBesideButton] = useCounter('2 button');
  const [besidePressable, pressBesidePressable] = useCounter('2 pressable');
  const [isExpoUiSwitchOn, setIsExpoUiSwitchOn] = useState(false);
  const [isReactNativeSwitchOn, setIsReactNativeSwitchOn] = useState(false);
  const [focusCount, countFocus] = useCounter('5 focus');

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>1. @expo/ui Button inside a Pressable</Text>
      <Pressable onPress={pressInsidePressable} style={styles.card}>
        <Host matchContents>
          <Button label="Press me" onPress={pressInsideButton} />
        </Host>
      </Pressable>
      <Text>{`Button: ${insideButton}   Pressable: ${insidePressable}`}</Text>

      <Text style={styles.title}>2. The same Button beside a Pressable</Text>
      <View style={styles.card}>
        <Pressable onPress={pressBesidePressable} style={StyleSheet.absoluteFill} />
        <Host matchContents>
          <Button label="Press me" onPress={pressBesideButton} />
        </Host>
      </View>
      <Text>{`Button: ${besideButton}   Pressable: ${besidePressable}`}</Text>

      <Text style={styles.title}>3. @expo/ui Switch inside a Pressable</Text>
      <Pressable style={styles.card}>
        <Host matchContents>
          <Switch
            value={isExpoUiSwitchOn}
            onValueChange={(value) => {
              console.log(`[repro] 3 switch ${value ? 'on' : 'off'}`);
              setIsExpoUiSwitchOn(value);
            }}
          />
        </Host>
      </Pressable>
      <Text>{isExpoUiSwitchOn ? 'On' : 'Off'}</Text>

      <Text style={styles.title}>4. React Native's Switch inside a Pressable</Text>
      <Pressable style={styles.card}>
        <ReactNativeSwitch
          value={isReactNativeSwitchOn}
          onValueChange={(value) => {
            console.log(`[repro] 4 switch ${value ? 'on' : 'off'}`);
            setIsReactNativeSwitchOn(value);
          }}
        />
      </Pressable>
      <Text>{isReactNativeSwitchOn ? 'On' : 'Off'}</Text>

      <Text style={styles.title}>5. @expo/ui TextInput inside a Pressable</Text>
      <Pressable style={styles.card}>
        <Host matchContents={{ vertical: true }} style={styles.field}>
          <TextInput placeholder="Tap to type" onFocus={countFocus} />
        </Host>
      </Pressable>
      <Text>{`Focused: ${focusCount} times`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 20, gap: 6 },
  title: { fontWeight: 'bold', marginTop: 10 },
  card: {
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
  },
  field: { alignSelf: 'stretch' },
});
