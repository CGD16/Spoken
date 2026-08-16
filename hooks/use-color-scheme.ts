// hooks/use-color-scheme.ts
import { useState, useEffect } from "react";
import { useColorScheme as useRNColorScheme, DeviceEventEmitter } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useColorScheme() {
  const systemScheme = useRNColorScheme() === "dark" ? "dark" : "light";
  const [mode, setMode] = useState<"light" | "dark" | null>(null);
  const [themeName, setThemeName] = useState<string>("blue"); // Standard-Theme (Blau)

  useEffect(() => {
    // Gespeicherte Einstellungen beim Start laden
    AsyncStorage.getItem("@setting_dark_mode").then((val) => {
      if (val !== null) {
        setMode(JSON.parse(val) ? "dark" : "light");
      } else {
        setMode(systemScheme);
      }
    });

    AsyncStorage.getItem("@setting_color_theme").then((val) => {
      if (val !== null) {
        setThemeName(val);
      }
    });

    // Event Listener für den Dunkelmodus-Schalter
    const darkSub = DeviceEventEmitter.addListener("onThemeChange", (isDark: boolean) => {
      setMode(isDark ? "dark" : "light");
    });

    // Event Listener für den Farbwechsel (Rosa, Grün, etc.)
    const themeSub = DeviceEventEmitter.addListener("onColorThemeChange", (newTheme: string) => {
      setThemeName(newTheme);
    });

    return () => {
      darkSub.remove();
      themeSub.remove();
    };
  }, [systemScheme]);

  // Zentale Methode zum Ändern und Speichern von Theme und Dark-Mode
  const setTheme = async (newThemeName: string, newColorScheme: "light" | "dark") => {
    const isDark = newColorScheme === "dark";
    
    // Lokale States direkt aktualisieren
    setThemeName(newThemeName);
    setMode(newColorScheme);

    // In AsyncStorage speichern
    await AsyncStorage.setItem("@setting_dark_mode", JSON.stringify(isDark));
    await AsyncStorage.setItem("@setting_color_theme", newThemeName);

    // Events für andere Komponenten auslösen
    DeviceEventEmitter.emit("onThemeChange", isDark);
    DeviceEventEmitter.emit("onColorThemeChange", newThemeName);
  };

  const activeColorScheme = mode ?? systemScheme;

  return {
    colorScheme: activeColorScheme,
    themeName: themeName,
    isDark: activeColorScheme === "dark",
    setTheme,
  };
}