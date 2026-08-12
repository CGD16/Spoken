// components/SidebarNavigation.tsx
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type TabKey =
  | "notes"
  | "categories"
  | "tags"
  | "favorites"
  | "search"
  | "settings";

type NavItem = {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

const MAIN_ITEMS: NavItem[] = [
  { key: "notes", label: "Meine Notizen", icon: "file-text" },
  { key: "categories", label: "Kategorien", icon: "grid" },
  { key: "tags", label: "Meine Tags", icon: "tag" },
  { key: "favorites", label: "Meine Favoriten", icon: "star" },
  { key: "search", label: "Suche", icon: "search" },
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
    return (
      <Pressable
        key={item.key}
        onPress={() => onTabChange(item.key)}
        style={[styles.item, isActive && styles.itemActive]}
      >
        <Feather
          name={item.icon}
          size={20}
          color={isActive ? "#2563EB" : "#4A5568"}
        />
        {!collapsed && (
          <Text style={[styles.itemLabel, isActive && styles.itemLabelActive]}>
            {item.label}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <BlurView intensity={45} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.inner}>
        <Pressable onPress={toggleCollapse} style={styles.menuButton}>
          <Feather name="menu" size={20} color="#2563EB" />
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
  },
  itemActive: {
    backgroundColor: "#E0F2FE",
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
  },
  itemLabelActive: {
    color: "#1E40AF",
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
    marginBottom: 16,
  },
});
