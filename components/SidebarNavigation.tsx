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
import { useTranslation } from "react-i18next";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
  icon: keyof typeof Feather.glyphMap;
};

// Schlanke Array-Definition ohne doppelte oder unschöne Strings
const MAIN_ITEMS: NavItem[] = [
  { key: "notes", icon: "file-text" },
  { key: "categories", icon: "grid" },
  { key: "tags", icon: "tag" },
  { key: "favorites", icon: "star" },
  { key: "search", icon: "search" },
  { key: "trash", icon: "trash-2" },
];

const FOOTER_ITEM: NavItem = {
  key: "settings",
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
  const { t } = useTranslation();
  const { colorScheme, themeName } = useColorScheme();

  const rawTheme =
    (Themes as any)[themeName]?.[colorScheme ?? "light"] ??
    Themes.blue[colorScheme ?? "light"];

  const theme = {
    ...Themes.blue[colorScheme ?? "light"],
    ...rawTheme,
  };

  const isDark = colorScheme === "dark";

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
          const iconColor = isDark
            ? isActive
              ? theme.primaryActive
              : hovered
                ? theme.primaryHover
                : theme.textMuted
            : isNotesActive
              ? theme.primaryActive
              : isActive || hovered
                ? theme.primaryHover
                : theme.textMuted;

          return (
            <View
              style={[
                styles.item,
                hovered &&
                  !isActive && {
                    backgroundColor: theme.hoverBg,
                    borderColor: theme.hoverBorder,
                  },
                isActive && {
                  backgroundColor: theme.activeBg,
                  borderColor: theme.activeBorder,
                },
                isNotesActive && {
                  backgroundColor: theme.notesActiveBg,
                  borderColor: theme.notesActiveBorder,
                },
              ]}
            >
              <Feather name={item.icon} size={20} color={iconColor} />
              {!collapsed && (
                <Text
                  style={[
                    styles.itemLabel,
                    { color: theme.textMuted },
                    hovered && { color: theme.primaryHover, fontWeight: "600" },
                    isActive && {
                      color: theme.primaryActive,
                      fontWeight: "600",
                    },
                    isNotesActive && {
                      color: theme.primaryActive,
                      fontSize: 15,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {t(`sidebar.${item.key}`)}
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
        {
          borderColor: theme.border,
          backgroundColor: theme.sidebarBg,
        },
        containerStyle,
      ]}
    >
      <BlurView
        intensity={45}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>
        <Pressable
          onPress={toggleCollapse}
          style={[styles.menuButton, { backgroundColor: theme.menuButtonBg }]}
        >
          <Feather name="menu" size={20} color={theme.primary} />
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
    overflow: "hidden",
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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
  itemLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    marginTop: "auto",
    marginBottom: 16,
  },
});