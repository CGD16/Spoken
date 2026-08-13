// components/NoteCard.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { Note } from "@/types/note";

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

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>
          {new Date(note.created_at).toLocaleDateString("de-DE")}
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
                style={[styles.iconButton, hovered && styles.iconButtonHovered]}
              >
                <Ionicons
                  name={isFav ? "star" : "star-outline"}
                  size={18}
                  color={isFav ? "#EAB308" : hovered ? "#2553B8" : "#9aa5b1"}
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
                style={[styles.iconButton, hovered && styles.iconButtonHovered]}
              >
                <Feather
                  name="edit-2"
                  size={18}
                  color={hovered ? "#2553B8" : "#9aa5b1"}
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
                style={[styles.iconButton, hovered && styles.iconButtonHovered]}
              >
                <Feather
                  name="more-horizontal"
                  size={18}
                  color={hovered ? "#2553B8" : "#9aa5b1"}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <Text style={styles.cardTitle}>{note.title ?? "Unbenannte Notiz"}</Text>
      <Text style={styles.cardPreview} numberOfLines={2}>
        {note.processed_text ?? note.raw_transcript ?? "Wird verarbeitet..."}
      </Text>
      {note.tags && note.tags.length > 0 && (
        <Text style={styles.tags}>{note.tags.join(" · ")}</Text>
      )}
      <Text style={styles.status}>{note.status}</Text>
      <View style={styles.miniWaveform}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[styles.miniBar, { height: 4 + ((i * 5) % 12) }]}
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
  cardDate: { fontSize: 12, color: "#9aa5b1" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1c2b39" },
  cardPreview: { fontSize: 14, color: "#5b6b7a", lineHeight: 19 },
  tags: { fontSize: 12, color: "#2f95dc", fontWeight: "600" },
  status: { fontSize: 11, color: "#c2cad3" },
  miniWaveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 16,
    marginTop: 4,
  },
  miniBar: { width: 2, borderRadius: 1, backgroundColor: "#cfe4f0" },
});
