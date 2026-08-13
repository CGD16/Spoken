// components/NoteCard.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { Note } from "@/types/note";
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable
      style={[styles.card, isDark && styles.cardDark]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        {/* Einfaches Standard-Datum ohne Context/Provider */}
        <Text style={[styles.cardDate, isDark && styles.cardDateDark]}>
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
                  hovered &&
                    (isDark
                      ? styles.iconButtonHoveredDark
                      : styles.iconButtonHovered),
                ]}
              >
                <Ionicons
                  name={isFav ? "star" : "star-outline"}
                  size={18}
                  color={
                    isFav
                      ? "#EAB308"
                      : hovered
                        ? isDark
                          ? "#60A5FA"
                          : "#2553B8"
                        : isDark
                          ? "#64748B"
                          : "#9aa5b1"
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
                  hovered &&
                    (isDark
                      ? styles.iconButtonHoveredDark
                      : styles.iconButtonHovered),
                ]}
              >
                <Feather
                  name="edit-2"
                  size={18}
                  color={
                    hovered
                      ? isDark
                        ? "#60A5FA"
                        : "#2553B8"
                      : isDark
                        ? "#64748B"
                        : "#9aa5b1"
                  }
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
                  hovered &&
                    (isDark
                      ? styles.iconButtonHoveredDark
                      : styles.iconButtonHovered),
                ]}
              >
                <Feather
                  name="more-horizontal"
                  size={18}
                  color={
                    hovered
                      ? isDark
                        ? "#60A5FA"
                        : "#2553B8"
                      : isDark
                        ? "#64748B"
                        : "#9aa5b1"
                  }
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
        {note.title ?? "Unbenannte Notiz"}
      </Text>
      <Text
        style={[styles.cardPreview, isDark && styles.cardPreviewDark]}
        numberOfLines={2}
      >
        {note.processed_text ?? note.raw_transcript ?? "Wird verarbeitet..."}
      </Text>
      {note.tags && note.tags.length > 0 && (
        <Text style={[styles.tags, isDark && styles.tagsDark]}>
          {note.tags.join(" · ")}
        </Text>
      )}
      <Text style={[styles.status, isDark && styles.statusDark]}>
        {note.status}
      </Text>
      <View style={styles.miniWaveform}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.miniBar,
              isDark && styles.miniBarDark,
              { height: 4 + ((i * 5) % 12) },
            ]}
          />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#1E293B",
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderIcons: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconButton: { padding: 6, borderRadius: 8 },
  iconButtonHovered: {
    backgroundColor: "#E2F1FF",
    borderWidth: 1,
    borderColor: "#C5E2FF",
  },
  iconButtonHoveredDark: {
    backgroundColor: "#1E3A8A",
    borderWidth: 1,
    borderColor: "#1D4ED8",
  },
  cardDate: { fontSize: 12, color: "#9aa5b1" },
  cardDateDark: { color: "#64748B" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1c2b39" },
  cardTitleDark: { color: "#F8FAFC" },
  cardPreview: { fontSize: 14, color: "#5b6b7a", lineHeight: 19 },
  cardPreviewDark: { color: "#94A3B8" },
  tags: { fontSize: 12, color: "#2f95dc", fontWeight: "600" },
  tagsDark: { color: "#38BDF8" },
  status: { fontSize: 11, color: "#c2cad3" },
  statusDark: { color: "#475569" },
  miniWaveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 16,
    marginTop: 4,
  },
  miniBar: { width: 2, borderRadius: 1, backgroundColor: "#cfe4f0" },
  miniBarDark: { backgroundColor: "#334155" },
});
