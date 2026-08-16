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
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
  const { colorScheme, themeName } = useColorScheme();

  // Robuste Theme-Auflösung mit Fallback auf Blau
  const rawTheme =
    (Themes as any)[themeName]?.[colorScheme ?? "light"] ??
    Themes.blue[colorScheme ?? "light"];

  const theme = {
    ...Themes.blue[colorScheme ?? "light"],
    ...rawTheme,
  };

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
      <View style={[styles.backdrop, { backgroundColor: theme.backdrop }]}>
        <View style={[styles.dialog, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            Ergebnis bearbeiten
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
            value={result}
            onChangeText={setResult}
            autoFocus
            multiline
            textAlignVertical="top"
            placeholder="Ergebnis-Text eingeben..."
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 480,
    gap: 12,
  },
  title: { fontSize: 17, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
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
  cancelText: { fontSize: 14, fontWeight: "600" },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
