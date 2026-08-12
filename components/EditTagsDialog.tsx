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
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Tags bearbeiten</Text>

          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
                <Pressable onPress={() => removeTag(tag)} hitSlop={8}>
                  <Feather name="x" size={14} color="#5b6b7a" />
                </Pressable>
              </View>
            ))}
            {tags.length === 0 && (
              <Text style={styles.emptyText}>Keine Tags</Text>
            )}
          </View>

          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Neuer Tag..."
              onSubmitEditing={addTag}
            />
            <Pressable style={styles.addButton} onPress={addTag}>
              <Feather name="plus" size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Abbrechen</Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    gap: 14,
  },
  title: { fontSize: 17, fontWeight: "700", color: "#1c2b39" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#eef6fb",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tagChipText: { fontSize: 13, color: "#2f95dc", fontWeight: "600" },
  emptyText: { fontSize: 13, color: "#9aa5b1", fontStyle: "italic" },
  addRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e8f0",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#2f95dc",
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
  cancelText: { fontSize: 14, fontWeight: "600", color: "#5b6b7a" },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#2f95dc",
  },
  confirmText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
