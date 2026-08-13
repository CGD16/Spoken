// components/SidebarNavigation.tsx
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";

type TabKey =
  | "notes"
  | "categories"
  | "tags"
  | "favorites"
  | "search"
  | "settings"
  | "trash";

type NavItem = {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

const MAIN_ITEMS: NavItem[] = [
  { key: "notes", label: "Notizen", icon: "file-text" },
  { key: "categories", label: "Kategorien", icon: "grid" },
  { key: "tags", label: "Tags", icon: "tag" },
  { key: "favorites", label: "Favoriten", icon: "star" },
  { key: "search", label: "Suche", icon: "search" },
  { key: "trash", label: "Papierkorb", icon: "trash-2" },
];

const FOOTER_ITEM: NavItem = {
  key: "settings",
  label: "Einstellungen",
  icon: "settings",
};

type Props = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  defaultCollapsed?: boolean;
};

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 70;

export default function SidebarNavigation({
  activeTab,
  onTabChange,
  defaultCollapsed = false,
}: Props) {
  const { isDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const width = useSharedValue(
    defaultCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
  );

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    width.value = withTiming(next ? COLLAPSED_WIDTH : EXPANDED_WIDTH, {
      duration: 250,
    });
  };

  const containerStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const renderItem = (item: NavItem) => {
    const isActive = activeTab === item.key;
    const isNotesActive = isActive && item.key === "notes";

    return (
      <Pressable key={item.key} onPress={() => onTabChange(item.key)}>
        {({ hovered }) => {
          // Icon-Farbe passend zum Dark Mode und aktiven Zustand
          const iconColor = isDarkMode
            ? isActive
              ? "#60A5FA"
              : hovered
                ? "#93C5FD"
                : "#94A3B8"
            : isNotesActive
              ? "#1D4ED8"
              : isActive || hovered
                ? "#2563EB"
                : "#4A5568";

          return (
            <View
              style={[
                styles.item,
                hovered &&
                  !isActive &&
                  (isDarkMode ? styles.itemHoveredDark : styles.itemHovered),
                isActive &&
                  (isDarkMode ? styles.itemActiveDark : styles.itemActive),
                isNotesActive &&
                  (isDarkMode
                    ? styles.itemActiveNotesDark
                    : styles.itemActiveNotes),
              ]}
            >
              <Feather name={item.icon} size={20} color={iconColor} />
              {!collapsed && (
                <Text
                  style={[
                    styles.itemLabel,
                    isDarkMode && styles.itemLabelDark,
                    hovered &&
                      (isDarkMode
                        ? styles.itemLabelHoveredDark
                        : styles.itemLabelHovered),
                    isActive &&
                      (isDarkMode
                        ? styles.itemLabelActiveDark
                        : styles.itemLabelActive),
                    isNotesActive &&
                      (isDarkMode
                        ? styles.itemLabelActiveNotesDark
                        : styles.itemLabelActiveNotes),
                  ]}
                >
                  {item.label}
                </Text>
              )}
            </View>
          );
        }}
      </Pressable>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isDarkMode && styles.containerDark,
        containerStyle,
      ]}
    >
      <BlurView
        intensity={45}
        tint={isDarkMode ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>
        <Pressable
          onPress={toggleCollapse}
          style={[styles.menuButton, isDarkMode && styles.menuButtonDark]}
        >
          <Feather
            name="menu"
            size={20}
            color={isDarkMode ? "#60A5FA" : "#2563EB"}
          />
        </Pressable>

        <View style={styles.nav}>{MAIN_ITEMS.map(renderItem)}</View>

        <View style={styles.footer}>{renderItem(FOOTER_ITEM)}</View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    borderRightWidth: 1,
    borderColor: "rgba(225, 232, 240, 0.6)",
    backgroundColor: "rgba(240, 246, 255, 0.65)",
    overflow: "hidden",
  },
  containerDark: {
    borderColor: "rgba(51, 65, 85, 0.6)",
    backgroundColor: "rgba(15, 23, 42, 0.85)",
  },
  inner: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(219, 234, 254, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  menuButtonDark: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
  },
  nav: {
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  // Light Mode Styles
  itemHovered: {
    backgroundColor: "#E2F1FF",
    borderColor: "#C5E2FF",
  },
  itemActive: {
    backgroundColor: "#E0F2FE",
    borderColor: "#1E40AF",
  },
  itemActiveNotes: {
    backgroundColor: "#D1E9FF",
    borderColor: "#1D4ED8",
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
  },
  itemLabelHovered: {
    color: "#2563EB",
    fontWeight: "600",
  },
  itemLabelActive: {
    color: "#1E40AF",
    fontWeight: "600",
  },
  itemLabelActiveNotes: {
    color: "#1D4ED8",
    fontSize: 15,
    fontWeight: "700",
  },

  // Dark Mode Styles
  itemHoveredDark: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderColor: "#334155",
  },
  itemActiveDark: {
    backgroundColor: "#1E293B",
    borderColor: "#3B82F6",
  },
  itemActiveNotesDark: {
    backgroundColor: "#1E293B",
    borderColor: "#60A5FA",
  },
  itemLabelDark: {
    color: "#94A3B8",
  },
  itemLabelHoveredDark: {
    color: "#93C5FD",
    fontWeight: "600",
  },
  itemLabelActiveDark: {
    color: "#60A5FA",
    fontWeight: "600",
  },
  itemLabelActiveNotesDark: {
    color: "#60A5FA",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    marginTop: "auto",
    marginBottom: 16,
  },
});
