// components/ConfirmDialog.tsx
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Bestätigen",
  cancelLabel = "Abbrechen",
  destructive = false,
  onConfirm,
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={[styles.backdrop, { backgroundColor: theme.backdrop }]}>
        <View style={[styles.dialog, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.textMuted }]}>
            {message}
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={({ hovered }) => [
                styles.cancelButton,
                hovered && { backgroundColor: theme.selectionBg },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: theme.textMuted }]}>
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              style={({ hovered }) => [
                styles.confirmButton,
                { backgroundColor: destructive ? theme.danger : theme.primary },
                hovered && {
                  backgroundColor: destructive
                    ? theme.dangerHover
                    : theme.primaryHover,
                },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
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
  message: { fontSize: 14, lineHeight: 20 },
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
