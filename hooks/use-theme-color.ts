// hooks/use-theme-color.ts
import { Themes } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Themes.blue.light & keyof typeof Themes.blue.dark
) {
  const { colorScheme, themeName } = useColorScheme();
  
  // Aktuelles Theme sicher auflösen (mit Fallback auf blue)
  const theme =
    Themes[themeName as keyof typeof Themes]?.[colorScheme] ??
    Themes.blue[colorScheme];

  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Direktes Auslesen aus dem Theme-Objekt mit absolutem Fallback (#000)
    return (theme as Record<string, string>)[colorName] ?? '#000';
  }
}