// context/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DeviceEventEmitter,
  useColorScheme as useNativeColorScheme,
} from "react-native";

// Hier direkt definiert und exportiert, damit Constants unangetastet bleiben kann:
export type ThemeName = "blue" | "pink" | "green" | "red" | "yellow" | "violet";
export type ColorSchemeType = "light" | "dark";

export type DateFormat = "DD.MM.YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY";
export type TimeFormat = "24h" | "12h";

interface SettingsContextType {
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  language: "de" | "en";
  isDarkMode: boolean;
  themeName: ThemeName;
  setDateFormat: (format: DateFormat) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setLanguage: (lang: "de" | "en") => void;
  setIsDarkMode: (dark: boolean) => void;
  setThemeName: (name: ThemeName) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const THEME_CHANGE_EVENT = "THEME_CHANGE_EVENT";

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const nativeColorScheme = useNativeColorScheme();

  const [dateFormat, setDateFormatState] = useState<DateFormat>("DD.MM.YYYY");
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>("24h");
  const [language, setLanguageState] = useState<"de" | "en">("de");
  const [isDarkMode, setIsDarkModeState] = useState(
    nativeColorScheme === "dark",
  );
  const [themeName, setThemeNameState] = useState<ThemeName>("blue");

  useEffect(() => {
    (async () => {
      const savedDate = await AsyncStorage.getItem("@setting_date_format");
      const savedTime = await AsyncStorage.getItem("@setting_time_format");
      const savedLang = await AsyncStorage.getItem("@setting_language");
      const savedDark = await AsyncStorage.getItem("@setting_dark_mode");
      const savedTheme = await AsyncStorage.getItem("@setting_theme_name");

      if (savedDate) setDateFormatState(savedDate as DateFormat);
      if (savedTime) setTimeFormatState(savedTime as TimeFormat);
      if (savedLang) setLanguageState(savedLang as "de" | "en");
      if (savedDark !== null) setIsDarkModeState(JSON.parse(savedDark));
      if (savedTheme) setThemeNameState(savedTheme as ThemeName);
    })();
  }, []);

  const setDateFormat = (format: DateFormat) => {
    setDateFormatState(format);
    AsyncStorage.setItem("@setting_date_format", format);
  };

  const setTimeFormat = (format: TimeFormat) => {
    setTimeFormatState(format);
    AsyncStorage.setItem("@setting_time_format", format);
  };

  const setLanguage = (lang: "de" | "en") => {
    setLanguageState(lang);
    AsyncStorage.setItem("@setting_language", lang);
  };

  const setIsDarkMode = (dark: boolean) => {
    setIsDarkModeState(dark);
    AsyncStorage.setItem("@setting_dark_mode", JSON.stringify(dark));
    DeviceEventEmitter.emit(THEME_CHANGE_EVENT);
  };

  const setThemeName = (name: ThemeName) => {
    setThemeNameState(name);
    AsyncStorage.setItem("@setting_theme_name", name);
    DeviceEventEmitter.emit(THEME_CHANGE_EVENT);
  };

  return (
    <SettingsContext.Provider
      value={{
        dateFormat,
        timeFormat,
        language,
        isDarkMode,
        themeName,
        setDateFormat,
        setTimeFormat,
        setLanguage,
        setIsDarkMode,
        setThemeName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettings muss innerhalb von SettingsProvider verwendet werden",
    );
  }
  return context;
};

// Hook zur Unterstützung für den zentralen use-color-scheme Hook
export function useColorScheme(): {
  colorScheme: ColorSchemeType;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  setColorScheme: (scheme: ColorSchemeType) => void;
} {
  const { isDarkMode, themeName, setThemeName, setIsDarkMode } = useSettings();
  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(THEME_CHANGE_EVENT, () => {
      setDummy((prev) => prev + 1);
    });
    return () => sub.remove();
  }, []);

  return {
    colorScheme: isDarkMode ? "dark" : "light",
    themeName,
    setTheme: setThemeName,
    setColorScheme: (scheme: ColorSchemeType) =>
      setIsDarkMode(scheme === "dark"),
  };
}
