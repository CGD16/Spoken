// app/(tabs)/settings.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [language, setLanguage] = useState<"de" | "en">("de");
  const [dateFormat, setDateFormat] = useState<
    "DD.MM.YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY"
  >("DD.MM.YYYY");
  const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

  // Einstellungen beim Start laden
  useEffect(() => {
    loadSettings();
  }, []);

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

  const handleDarkModeToggle = (value: boolean) => {
    toggleDarkMode(value);
  };

  return (
    <ScrollView
      style={[styles.container, isDarkMode && styles.containerDark]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, isDarkMode && styles.textDark]}>
        Einstellungen
      </Text>

      {/* Erscheinungsbild */}
      <Text
        style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
      >
        Erscheinungsbild
      </Text>
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Feather
              name="moon"
              size={20}
              color={isDarkMode ? "#94A3B8" : "#1c2b39"}
            />
            <Text style={[styles.rowLabel, isDarkMode && styles.textDark]}>
              Dunkelmodus (Dark Mode)
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Sprache */}
      <Text
        style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
      >
        Sprache
      </Text>
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <TouchableOpacity
          style={[
            styles.optionRow,
            language === "de" &&
              (isDarkMode ? styles.optionSelectedDark : styles.optionSelected),
          ]}
          onPress={() => handleLanguageChange("de")}
        >
          <Text style={[styles.optionLabel, isDarkMode && styles.textDark]}>
            Deutsch
          </Text>
          {language === "de" && (
            <Feather name="check" size={18} color="#3B82F6" />
          )}
        </TouchableOpacity>

        <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

        <TouchableOpacity
          style={[
            styles.optionRow,
            language === "en" &&
              (isDarkMode ? styles.optionSelectedDark : styles.optionSelected),
          ]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text style={[styles.optionLabel, isDarkMode && styles.textDark]}>
            English
          </Text>
          {language === "en" && (
            <Feather name="check" size={18} color="#3B82F6" />
          )}
        </TouchableOpacity>
      </View>

      {/* Datumsformat */}
      <Text
        style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
      >
        Datumsformat
      </Text>
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        {[
          { label: "DD.MM.YYYY (z. B. 12.08.2026)", value: "DD.MM.YYYY" },
          { label: "YYYY-MM-DD (z. B. 2026-08-12)", value: "YYYY-MM-DD" },
          { label: "MM/DD/YYYY (z. B. 08/12/2026)", value: "MM/DD/YYYY" },
        ].map((item, index) => (
          <View key={item.value}>
            {index > 0 && (
              <View
                style={[styles.divider, isDarkMode && styles.dividerDark]}
              />
            )}
            <TouchableOpacity
              style={[
                styles.optionRow,
                dateFormat === item.value &&
                  (isDarkMode
                    ? styles.optionSelectedDark
                    : styles.optionSelected),
              ]}
              onPress={() => handleDateFormatChange(item.value as any)}
            >
              <Text style={[styles.optionLabel, isDarkMode && styles.textDark]}>
                {item.label}
              </Text>
              {dateFormat === item.value && (
                <Feather name="check" size={18} color="#3B82F6" />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Uhrzeitformat */}
      <Text
        style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
      >
        Uhrzeitformat
      </Text>
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <TouchableOpacity
          style={[
            styles.optionRow,
            timeFormat === "24h" &&
              (isDarkMode ? styles.optionSelectedDark : styles.optionSelected),
          ]}
          onPress={() => handleTimeFormatChange("24h")}
        >
          <Text style={[styles.optionLabel, isDarkMode && styles.textDark]}>
            24-Stunden (11:14)
          </Text>
          {timeFormat === "24h" && (
            <Feather name="check" size={18} color="#3B82F6" />
          )}
        </TouchableOpacity>

        <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

        <TouchableOpacity
          style={[
            styles.optionRow,
            timeFormat === "12h" &&
              (isDarkMode ? styles.optionSelectedDark : styles.optionSelected),
          ]}
          onPress={() => handleTimeFormatChange("12h")}
        >
          <Text style={[styles.optionLabel, isDarkMode && styles.textDark]}>
            12-Stunden (11:14 AM)
          </Text>
          {timeFormat === "12h" && (
            <Feather name="check" size={18} color="#3B82F6" />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fb" },
  containerDark: { backgroundColor: "#0f172a" },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1c2b39",
    marginBottom: 20,
  },
  textDark: { color: "#f8fafc" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 12,
    marginLeft: 4,
  },
  sectionTitleDark: { color: "#94A3B8" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  cardDark: { backgroundColor: "#1e293b", borderColor: "#334155" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowLabel: { fontSize: 15, fontWeight: "500", color: "#1c2b39" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionSelected: { backgroundColor: "#F1F5F9" },
  optionSelectedDark: { backgroundColor: "#334155" },
  optionLabel: { fontSize: 15, color: "#1c2b39", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#F1F5F9" },
  dividerDark: { backgroundColor: "#334155" },
});
