// app/(tabs)/_layout.tsx
import { View, useWindowDimensions } from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import SidebarNavigation from '@/components/SidebarNavigation';

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
  trash: "trash",
};

const PATH_TO_TAB: Record<string, TabKey> = {
  "/": "notes",
  "/categories": "categories",
  "/tags": "tags",
  "/favorites": "favorites",
  "/search": "search",
  "/settings": "settings",
  "/trash": 'trash',
};

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const activeTab = PATH_TO_TAB[pathname] ?? 'notes';

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <SidebarNavigation
        activeTab={activeTab}
        onTabChange={(tab) => router.push(TAB_TO_PATH[tab] as any)}
        defaultCollapsed={!isWide}
      />
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </View>
  );
}