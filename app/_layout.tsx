// app/_layout.tsx
import { View, useWindowDimensions, ActivityIndicator } from "react-native";
import { Slot, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SidebarNavigation from "@/components/SidebarNavigation";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type TabKey =
  | "notes"
  | "categories"
  | "tags"
  | "favorites"
  | "search"
  | "settings"
  | "trash";

const TAB_TO_PATH: Record<TabKey, string> = {
  notes: "/",
  categories: "/categories",
  tags: "/tags",
  favorites: "/favorites",
  search: "/search",
  settings: "/settings",
  trash: "/trash",
};

const PATH_TO_TAB: Record<string, TabKey> = {
  "/": "notes",
  "/categories": "categories",
  "/tags": "tags",
  "/favorites": "favorites",
  "/search": "search",
  "/settings": "settings",
  "/trash": "trash",
};

function MainLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  const { isLoading } = useAuth();

  const activeTab = PATH_TO_TAB[pathname] ?? "notes";

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SidebarNavigation
        activeTab={activeTab}
        onTabChange={(tab) => router.push(TAB_TO_PATH[tab] as any)}
        defaultCollapsed={!isWide}
      />
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <Slot />
      </View>
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

const styles = {
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, flexDirection: "row" },
  content: { flex: 1 },
} as const;
