// utils/themeStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

type Listener = (isDark: boolean) => void;
let listeners: Listener[] = [];

export const ThemeStore = {
  async setDark(isDark: boolean) {
    try {
      await AsyncStorage.setItem("@setting_dark_mode", JSON.stringify(isDark));
      listeners.forEach((l) => l(isDark));
    } catch (e) {
      console.error(e);
    }
  },
  async getDark(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem("@setting_dark_mode");
      return val !== null ? JSON.parse(val) : false;
    } catch {
      return false;
    }
  },
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};