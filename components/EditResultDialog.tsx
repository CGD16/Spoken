// components/EditResultDialog.tsx
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
  initialResult: string;
  onSave: (result: string) => void;
  onCancel: () => void;
};

export default function EditResultDialog({
  visible,
  initialResult,
  onSave,
  onCancel,
}: Props) {
  const [result, setResult] = useState(initialResult);

  useEffect(() => {
    if (visible) setResult(initialResult);
  }, [visible, initialResult]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Ergebnis bearbeiten</Text>
          <TextInput
            style={styles.input}
            value={result}
            onChangeText={setResult}
            autoFocus
            multiline
            textAlignVertical="top"
            placeholder="Ergebnis-Text eingeben..."
          />
          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Abbrechen</Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
              onPress={() => result.trim() && onSave(result.trim())}
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
    maxWidth: 480,
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
    minHeight: 140,
    maxHeight: 300,
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
