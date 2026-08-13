// app/_layout.tsx
import { View, useWindowDimensions, ActivityIndicator } from "react-native";
import { Slot, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SidebarNavigation from "@/components/SidebarNavigation";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

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

  const { isDarkMode } = useTheme();
  const { isLoading } = useAuth();

  const activeTab = PATH_TO_TAB[pathname] ?? "notes";

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
      }}
    >
      <SidebarNavigation
        activeTab={activeTab}
        onTabChange={(tab) => router.push(TAB_TO_PATH[tab] as any)}
        defaultCollapsed={!isWide}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
        }}
      >
        <Slot />
      </View>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}
