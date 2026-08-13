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
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

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
      <View style={[styles.backdrop, { backgroundColor: theme.backdrop }]}>
        <View style={[styles.dialog, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            Titel bearbeiten
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.inputBg,
                color: theme.text,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            autoFocus
            placeholder="Titel eingeben..."
            placeholderTextColor={theme.textPlaceholder}
          />
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    gap: 12,
  },
  title: { fontSize: 17, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
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
