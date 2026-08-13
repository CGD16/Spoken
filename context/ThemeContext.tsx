// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useRNColorScheme } from "react-native";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  useEffect(() => {
    // Gespeicherten Zustand beim Start laden
    AsyncStorage.getItem("@setting_dark_mode").then((val) => {
      if (val !== null) {
        setIsDarkMode(JSON.parse(val));
      }
    });
  }, []);

  const toggleDarkMode = async (value: boolean) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem("@setting_dark_mode", JSON.stringify(value));
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Wir exportieren es so, dass dein use-color-scheme Hook darauf zugreifen kann
export const useAppTheme = () => useContext(ThemeContext);
