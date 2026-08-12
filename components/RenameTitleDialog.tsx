// components/RenameTitleDialog.tsx
import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

type Props = {
  visible: boolean;
  initialTitle: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export default function RenameTitleDialog({
  visible,
  initialTitle,
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (visible) setTitle(initialTitle);
  }, [visible, initialTitle]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Titel umbenennen</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            autoFocus
            placeholder="Titel eingeben..."
          />
          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Abbrechen</Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
              onPress={() => title.trim() && onSave(title.trim())}
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
    maxWidth: 340,
    gap: 12,
  },
  title: { fontSize: 17, fontWeight: "700", color: "#1c2b39" },
  input: {
    borderWidth: 1,
    borderColor: "#e1e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#1c2b39",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
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
