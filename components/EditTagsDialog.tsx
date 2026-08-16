// components/EditTagsDialog.tsx
import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  visible: boolean;
  initialTags: string[];
  onSave: (tags: string[]) => void;
  onCancel: () => void;
};

export default function EditTagsDialog({
  visible,
  initialTags,
  onSave,
  onCancel,
}: Props) {
  const { colorScheme, themeName } = useColorScheme();

  // Robuste Theme-Auflösung mit Fallback auf Blau
  const rawTheme =
    (Themes as any)[themeName]?.[colorScheme ?? "light"] ??
    Themes.blue[colorScheme ?? "light"];

  const theme = {
    ...Themes.blue[colorScheme ?? "light"],
    ...rawTheme,
  };

  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (visible) setTags(initialTags);
  }, [visible, initialTags]);

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={[styles.backdrop, { backgroundColor: theme.backdrop }]}>
        <View style={[styles.dialog, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            Tags bearbeiten
          </Text>

          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <View
                key={tag}
                style={[styles.tagChip, { backgroundColor: theme.tagBg }]}
              >
                <Text style={[styles.tagChipText, { color: theme.tagText }]}>
                  {tag}
                </Text>
                <Pressable onPress={() => removeTag(tag)} hitSlop={8}>
                  <Feather name="x" size={14} color={theme.textMuted} />
                </Pressable>
              </View>
            ))}
            {tags.length === 0 && (
              <Text style={[styles.emptyText, { color: theme.textSubtle }]}>
                Keine Tags
              </Text>
            )}
          </View>

          <View style={styles.addRow}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.inputBg,
                  color: theme.text,
                },
              ]}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Neuer Tag..."
              placeholderTextColor={theme.textPlaceholder}
              onSubmitEditing={addTag}
            />
            <Pressable
              style={({ hovered }) => [
                styles.addButton,
                { backgroundColor: theme.primary },
                hovered && { backgroundColor: theme.primaryHover },
              ]}
              onPress={addTag}
            >
              <Feather name="plus" size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ hovered }) => [
                styles.cancelButton,
                hovered && { backgroundColor: theme.selectionBg },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: theme.textMuted }]}>
                Abbrechen
              </Text>
            </Pressable>
            <Pressable
              style={({ hovered }) => [
                styles.confirmButton,
                { backgroundColor: theme.primary },
                hovered && { backgroundColor: theme.primaryHover },
              ]}
              onPress={() => onSave(tags)}
            >
              <Text style={styles.confirmText}>Speichern</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    gap: 14,
  },
  title: { fontSize: 17, fontWeight: "700" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tagChipText: { fontSize: 13, fontWeight: "600" },
  emptyText: { fontSize: 13, fontStyle: "italic" },
  addRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  cancelText: { fontSize: 14, fontWeight: "600" },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
