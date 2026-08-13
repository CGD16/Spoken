// components/ModeActionSheet.tsx
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type NoteMode =
  | "todo"
  | "diary"
  | "idea"
  | "message"
  | "style"
  | "blog"
  | "custom";

type ModeConfig = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

const MODE_CONFIGS: Record<NoteMode, ModeConfig> = {
  todo: { label: "To-Do-Liste", icon: "check-square" },
  diary: { label: "Tagebucheintrag", icon: "book" },
  idea: { label: "Ideen-Notiz", icon: "zap" },
  message: { label: "Nachrichten-Entwurf", icon: "mail" },
  style: { label: "Stil verbessern", icon: "edit-3" },
  blog: { label: "Blogartikel-Entwurf", icon: "file-text" },
  custom: { label: "Eigener Modus", icon: "target" },
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (mode: NoteMode, customInstruction?: string) => void;
  onDelete?: () => void;
};

export default function ModeActionSheet({
  visible,
  onClose,
  onSelect,
  onDelete,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDarkMode = colorScheme === "dark";

  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");

  const handlePress = (mode: NoteMode) => {
    if (mode === "custom") {
      setCustomMode(true);
      return;
    }
    onClose();
    onSelect(mode);
  };

  const submitCustom = () => {
    if (!customText.trim()) return;
    setCustomMode(false);
    onClose();
    onSelect("custom", customText.trim());
    setCustomText("");
  };

  const handleClose = () => {
    setCustomMode(false);
    onClose();
  };

  const handleDeletePress = () => {
    onClose();
    onDelete?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.backdrop }]}
        onPress={handleClose}
      >
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: theme.sheetBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <BlurView
            intensity={45}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.content}>
            {!customMode && (
              <>
                {(Object.keys(MODE_CONFIGS) as NoteMode[]).map((mode) => {
                  const config = MODE_CONFIGS[mode];
                  return (
                    <Pressable key={mode} onPress={() => handlePress(mode)}>
                      {({ hovered }) => (
                        <View
                          style={[
                            styles.option,
                            hovered && {
                              backgroundColor: theme.hoverBg,
                              borderColor: theme.borderLight,
                            },
                          ]}
                        >
                          <Feather
                            name={config.icon}
                            size={20}
                            color={
                              hovered ? theme.primaryActive : theme.primary
                            }
                          />
                          <Text
                            style={[
                              styles.optionText,
                              { color: theme.text },
                              hovered && {
                                color: theme.primaryActive,
                                fontWeight: "600",
                              },
                            ]}
                          >
                            {config.label}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}

                {onDelete && (
                  <>
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.borderLight },
                      ]}
                    />
                    <Pressable onPress={handleDeletePress}>
                      {({ hovered }) => (
                        <View
                          style={[
                            styles.option,
                            hovered && {
                              backgroundColor: theme.deleteHoverBg,
                              borderColor: theme.dangerLight,
                            },
                          ]}
                        >
                          <Feather
                            name="trash-2"
                            size={20}
                            color={theme.danger}
                          />
                          <Text
                            style={[
                              styles.deleteText,
                              { color: theme.danger },
                              hovered && { fontWeight: "600" },
                            ]}
                          >
                            Notiz löschen
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </>
                )}
              </>
            )}

            {customMode && (
              <View style={styles.customContainer}>
                <Text style={[styles.titleText, { color: theme.primary }]}>
                  Was soll damit gemacht werden?
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
                  placeholder="z.B. Fasse als Haiku zusammen"
                  placeholderTextColor={theme.textPlaceholder}
                  value={customText}
                  onChangeText={setCustomText}
                  autoFocus
                  multiline
                />
                <Pressable
                  style={({ hovered }) => [
                    styles.submitButton,
                    { backgroundColor: theme.primary },
                    hovered && { backgroundColor: theme.primaryHover },
                  ]}
                  onPress={submitCustom}
                >
                  <Text style={styles.submitButtonText}>Anwenden</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  content: {
    padding: 16,
    gap: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  customContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
