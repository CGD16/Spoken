// components/NoteCard.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { Note } from "@/types/note";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  note: Note;
  onPress: () => void;
  onToggleFavorite: () => void;
  onOpenEditMenu: () => void;
  onOpenModeMenu: () => void;
};

export default function NoteCard({
  note,
  onPress,
  onToggleFavorite,
  onOpenEditMenu,
  onOpenModeMenu,
}: Props) {
  const isFav = !!note.is_favorite;
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
    <Pressable
      style={({ hovered }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.shadowColor,
        },
        hovered && { borderColor: theme.primaryLight },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardDate, { color: theme.textMuted }]}>
          {new Date(note.created_at).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        <View style={styles.cardHeaderIcons}>
          {/* Favoriten-Stern */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            hitSlop={12}
          >
            {({ hovered }) => (
              <View
                style={[
                  styles.iconButton,
                  hovered && {
                    backgroundColor: theme.hoverBg,
                    borderColor: theme.borderLight,
                  },
                ]}
              >
                <Ionicons
                  name={isFav ? "star" : "star-outline"}
                  size={18}
                  color={
                    isFav
                      ? theme.starActive
                      : hovered
                        ? theme.primaryActive
                        : theme.textMuted
                  }
                />
              </View>
            )}
          </Pressable>

          {/* Edit-Stift */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onOpenEditMenu();
            }}
            hitSlop={12}
          >
            {({ hovered }) => (
              <View
                style={[
                  styles.iconButton,
                  hovered && {
                    backgroundColor: theme.hoverBg,
                    borderColor: theme.borderLight,
                  },
                ]}
              >
                <Feather
                  name="edit-2"
                  size={18}
                  color={hovered ? theme.primaryActive : theme.textMuted}
                />
              </View>
            )}
          </Pressable>

          {/* More Horizontal */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onOpenModeMenu();
            }}
            hitSlop={12}
          >
            {({ hovered }) => (
              <View
                style={[
                  styles.iconButton,
                  hovered && {
                    backgroundColor: theme.hoverBg,
                    borderColor: theme.borderLight,
                  },
                ]}
              >
                <Feather
                  name="more-horizontal"
                  size={18}
                  color={hovered ? theme.primaryActive : theme.textMuted}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <Text style={[styles.cardTitle, { color: theme.text }]}>
        {note.title ?? "Unbenannte Notiz"}
      </Text>
      <Text
        style={[styles.cardPreview, { color: theme.textMuted }]}
        numberOfLines={2}
      >
        {note.processed_text ?? note.raw_transcript ?? "Wird verarbeitet..."}
      </Text>
      {note.tags && note.tags.length > 0 && (
        <Text style={[styles.tags, { color: theme.primary }]}>
          {note.tags.join(" · ")}
        </Text>
      )}
      <Text style={[styles.status, { color: theme.textSubtle }]}>
        {note.status}
      </Text>
      <View style={styles.miniWaveform}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.miniBar,
              {
                height: 4 + ((i * 5) % 12),
                backgroundColor: theme.waveformInactive,
              },
            ]}
          />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderIcons: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardDate: { fontSize: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardPreview: { fontSize: 14, lineHeight: 19 },
  tags: { fontSize: 12, fontWeight: "600" },
  status: { fontSize: 11 },
  miniWaveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 16,
    marginTop: 4,
  },
  miniBar: { width: 2, borderRadius: 1 },
});
