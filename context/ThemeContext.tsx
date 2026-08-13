// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("@setting_dark_mode").then((value) => {
      if (value !== null) {
        setIsDarkMode(value === "dark" || value === "true");
      }
    });
  }, []);

  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    AsyncStorage.setItem("@setting_dark_mode", value ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
