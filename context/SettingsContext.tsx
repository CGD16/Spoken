// context/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DateFormat = "DD.MM.YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY";
export type TimeFormat = "24h" | "12h";

interface SettingsContextType {
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  language: "de" | "en";
  isDarkMode: boolean;
  setDateFormat: (format: DateFormat) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setLanguage: (lang: "de" | "en") => void;
  setIsDarkMode: (dark: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dateFormat, setDateFormatState] = useState<DateFormat>("DD.MM.YYYY");
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>("24h");
  const [language, setLanguageState] = useState<"de" | "en">("de");
  const [isDarkMode, setIsDarkModeState] = useState(false);

  useEffect(() => {
    (async () => {
      const savedDate = await AsyncStorage.getItem("@setting_date_format");
      const savedTime = await AsyncStorage.getItem("@setting_time_format");
      const savedLang = await AsyncStorage.getItem("@setting_language");
      const savedDark = await AsyncStorage.getItem("@setting_dark_mode");

      if (savedDate) setDateFormatState(savedDate as DateFormat);
      if (savedTime) setTimeFormatState(savedTime as TimeFormat);
      if (savedLang) setLanguageState(savedLang as "de" | "en");
      if (savedDark !== null) setIsDarkModeState(JSON.parse(savedDark));
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
  };

  return (
    <SettingsContext.Provider
      value={{
        dateFormat,
        timeFormat,
        language,
        isDarkMode,
        setDateFormat,
        setTimeFormat,
        setLanguage,
        setIsDarkMode,
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
