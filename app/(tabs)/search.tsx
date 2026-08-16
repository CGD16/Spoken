// app/search.tsx
import { View, Text, StyleSheet } from "react-native";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SearchScreen() {
  const { colorScheme, themeName } = useColorScheme();

  // Robuste Theme-Auflösung mit Fallback auf Blau
  const rawTheme =
    (Themes as any)[themeName]?.[colorScheme ?? "light"] ??
    Themes.blue[colorScheme ?? "light"];

  const theme = {
    ...Themes.blue[colorScheme ?? "light"],
    ...rawTheme,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Suche</Text>
      <Text style={[styles.placeholder, { color: theme.textSubtle }]}>
        Kommt in einer späteren Version.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
  },
});
