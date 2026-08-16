// app/(tabs)/settings.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  DeviceEventEmitter,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SettingsScreen() {
  const { colorScheme, themeName, setTheme } = useColorScheme();

  // Robuste Theme-Auflösung mit Fallback auf Blau
  const rawTheme =
    (Themes as any)[themeName]?.[colorScheme ?? "light"] ??
    Themes.blue[colorScheme ?? "light"];

  const theme = {
    ...Themes.blue[colorScheme ?? "light"],
    ...rawTheme,
  };

  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [currentThemeName, setCurrentThemeName] = useState(themeName);
  const [language, setLanguage] = useState<"de" | "en">("de");
  const [dateFormat, setDateFormat] = useState<
    "DD.MM.YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY"
  >("DD.MM.YYYY");
  const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

  // Alle Einstellungen beim Start laden
  useEffect(() => {
    loadSettings();
  }, []);

  // Synchronisieren, falls sich der Zustand von außen ändert
  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
    setCurrentThemeName(themeName);
  }, [colorScheme, themeName]);

  const loadSettings = async () => {
    try {
      const savedLang = await AsyncStorage.getItem("@setting_language");
      const savedDate = await AsyncStorage.getItem("@setting_date_format");
      const savedTime = await AsyncStorage.getItem("@setting_time_format");

      if (savedLang) setLanguage(savedLang as "de" | "en");
      if (savedDate) setDateFormat(savedDate as any);
      if (savedTime) setTimeFormat(savedTime as any);
    } catch (e) {
      console.error("Fehler beim Laden der Einstellungen", e);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
    } catch (e) {
      console.error("Fehler beim Speichern der Einstellung", e);
    }
  };

  const handleDarkModeToggle = async (value: boolean) => {
    setIsDarkMode(value);
    const newColorScheme = value ? "dark" : "light";
    await AsyncStorage.setItem("@setting_dark_mode", JSON.stringify(value));
    await setTheme(currentThemeName, newColorScheme);
    DeviceEventEmitter.emit("onThemeChange", value);
  };

  const handleThemeColorChange = async (newThemeName: string) => {
    setCurrentThemeName(newThemeName);
    const activeColorScheme = isDarkMode ? "dark" : "light";
    await setTheme(newThemeName, activeColorScheme);
  };

  const handleLanguageChange = (lang: "de" | "en") => {
    setLanguage(lang);
    saveSetting("@setting_language", lang);
  };

  const handleDateFormatChange = (
    format: "DD.MM.YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY",
  ) => {
    setDateFormat(format);
    saveSetting("@setting_date_format", format);
  };

  const handleTimeFormatChange = (format: "24h" | "12h") => {
    setTimeFormat(format);
    saveSetting("@setting_time_format", format);
  };

  const themeOptions = [
    { label: "Blau (Standard)", value: "blue", color: "#2f95dc" },
    { label: "Rosa", value: "pink", color: "#e64980" },
    { label: "Grün", value: "green", color: "#2b8a3e" },
    { label: "Rot", value: "red", color: "#e03131" },
    { label: "Gelb", value: "yellow", color: "#f59f00" },
    { label: "Violett", value: "violet", color: "#9c36b5" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, { color: theme.text }]}>Einstellungen</Text>

      {/* Erscheinungsbild */}
      <Text style={[styles.sectionTitle, { color: theme.textSubtle }]}>
        Erscheinungsbild
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Feather
              name="moon"
              size={20}
              color={isDarkMode ? theme.textMuted : theme.text}
            />
            <Text style={[styles.rowLabel, { color: theme.text }]}>
              Dunkelmodus (Dark Mode)
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: "#CBD5E1", true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Farbthema */}
      <Text style={[styles.sectionTitle, { color: theme.textSubtle }]}>
        Farbthema
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {themeOptions.map((item, index) => (
          <View key={item.value}>
            {index > 0 && (
              <View
                style={[styles.divider, { backgroundColor: theme.selectionBg }]}
              />
            )}
            <TouchableOpacity
              style={[
                styles.optionRow,
                currentThemeName === item.value && {
                  backgroundColor: theme.selectionBg,
                },
              ]}
              onPress={() => handleThemeColorChange(item.value)}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={[styles.optionLabel, { color: theme.text }]}>
                  {item.label}
                </Text>
              </View>
              {currentThemeName === item.value && (
                <Feather name="check" size={18} color={theme.primary} />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Sprache */}
      <Text style={[styles.sectionTitle, { color: theme.textSubtle }]}>
        Sprache
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.optionRow,
            language === "de" && { backgroundColor: theme.selectionBg },
          ]}
          onPress={() => handleLanguageChange("de")}
        >
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            Deutsch
          </Text>
          {language === "de" && (
            <Feather name="check" size={18} color={theme.primary} />
          )}
        </TouchableOpacity>

        <View
          style={[styles.divider, { backgroundColor: theme.selectionBg }]}
        />

        <TouchableOpacity
          style={[
            styles.optionRow,
            language === "en" && { backgroundColor: theme.selectionBg },
          ]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            English
          </Text>
          {language === "en" && (
            <Feather name="check" size={18} color={theme.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Datumsformat */}
      <Text style={[styles.sectionTitle, { color: theme.textSubtle }]}>
        Datumsformat
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {[
          { label: "DD.MM.YYYY (z. B. 12.08.2026)", value: "DD.MM.YYYY" },
          { label: "YYYY-MM-DD (z. B. 2026-08-12)", value: "YYYY-MM-DD" },
          { label: "MM/DD/YYYY (z. B. 08/12/2026)", value: "MM/DD/YYYY" },
        ].map((item, index) => (
          <View key={item.value}>
            {index > 0 && (
              <View
                style={[styles.divider, { backgroundColor: theme.selectionBg }]}
              />
            )}
            <TouchableOpacity
              style={[
                styles.optionRow,
                dateFormat === item.value && {
                  backgroundColor: theme.selectionBg,
                },
              ]}
              onPress={() => handleDateFormatChange(item.value as any)}
            >
              <Text style={[styles.optionLabel, { color: theme.text }]}>
                {item.label}
              </Text>
              {dateFormat === item.value && (
                <Feather name="check" size={18} color={theme.primary} />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Uhrzeitformat */}
      <Text style={[styles.sectionTitle, { color: theme.textSubtle }]}>
        Uhrzeitformat
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.optionRow,
            timeFormat === "24h" && { backgroundColor: theme.selectionBg },
          ]}
          onPress={() => handleTimeFormatChange("24h")}
        >
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            24-Stunden (11:14)
          </Text>
          {timeFormat === "24h" && (
            <Feather name="check" size={18} color={theme.primary} />
          )}
        </TouchableOpacity>

        <View
          style={[styles.divider, { backgroundColor: theme.selectionBg }]}
        />

        <TouchableOpacity
          style={[
            styles.optionRow,
            timeFormat === "12h" && { backgroundColor: theme.selectionBg },
          ]}
          onPress={() => handleTimeFormatChange("12h")}
        >
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            12-Stunden (11:14 AM)
          </Text>
          {timeFormat === "12h" && (
            <Feather name="check" size={18} color={theme.primary} />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowLabel: { fontSize: 15, fontWeight: "500" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionLabel: { fontSize: 15, fontWeight: "500" },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  divider: { height: 1 },
});
