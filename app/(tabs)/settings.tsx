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
import { useTranslation } from "react-i18next";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
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
  const [language, setLanguage] = useState<"de" | "en">(
    (i18n.language as "de" | "en") || "de",
  );

  // 1. FEHLER BEHOBEN: useState-Syntax korrigiert
  const [dateFormat, setDateFormat] = useState<
    "DD.MM.YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY"
  >("DD.MM.YYYY");
  const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
    setCurrentThemeName(themeName);
  }, [colorScheme, themeName]);

  const loadSettings = async () => {
    try {
      const savedLang = await AsyncStorage.getItem("@setting_language");
      const savedDate = await AsyncStorage.getItem("@setting_date_format");
      const savedTime = await AsyncStorage.getItem("@setting_time_format");

      if (savedLang) {
        setLanguage(savedLang as "de" | "en");
        await i18n.changeLanguage(savedLang);
      }
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

  // 2. OPTIMIERUNG: i18n.changeLanguage ist async
  const handleLanguageChange = async (lang: "de" | "en") => {
    setLanguage(lang);
    await saveSetting("@setting_language", lang);
    await i18n.changeLanguage(lang);
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
    { label: t("settings.themes.blue"), value: "blue", color: "#2f95dc" },
    { label: t("settings.themes.pink"), value: "pink", color: "#e64980" },
    { label: t("settings.themes.green"), value: "green", color: "#2b8a3e" },
    { label: t("settings.themes.red"), value: "red", color: "#e03131" },
    { label: t("settings.themes.yellow"), value: "yellow", color: "#f59f00" },
    { label: t("settings.themes.violet"), value: "violet", color: "#9c36b5" },
  ];

  const dateFormatOptions = [
    { label: t("settings.dateFormats.ddmmyyyy"), value: "DD.MM.YYYY" },
    { label: t("settings.dateFormats.yyyymmdd"), value: "YYYY-MM-DD" },
    { label: t("settings.dateFormats.mmddyyyy"), value: "MM/DD/YYYY" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, { color: theme.text }]}>
        {t("settings.title")}
      </Text>

      {/* Erscheinungsbild */}
      <Text style={[styles.sectionTitle, { color: theme.textSubtle }]}>
        {t("settings.appearance")}
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
              {t("settings.darkMode")}
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
        {t("settings.colorTheme")}
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
        {t("settings.language")}
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
            {t("settings.languages.de")}
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
            {t("settings.languages.en")}
          </Text>
          {language === "en" && (
            <Feather name="check" size={18} color={theme.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Datumsformat */}
      <Text style={[styles.sectionTitle, { color: theme.textSubtle }]}>
        {t("settings.dateFormat")}
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {dateFormatOptions.map((item, index) => (
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
        {t("settings.timeFormat")}
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
            {t("settings.timeFormats.24h")}
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
            {t("settings.timeFormats.12h")}
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
