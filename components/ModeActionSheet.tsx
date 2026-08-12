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
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <BlurView
            intensity={45}
            tint="light"
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
                            hovered && styles.optionHovered,
                          ]}
                        >
                          <Feather
                            name={config.icon}
                            size={20}
                            color="#2563EB"
                          />
                          <Text
                            style={[
                              styles.optionText,
                              hovered && styles.optionTextHovered,
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
                    <View style={styles.divider} />
                    <Pressable onPress={handleDeletePress}>
                      {({ hovered }) => (
                        <View
                          style={[
                            styles.option,
                            hovered && styles.deleteHovered,
                          ]}
                        >
                          <Feather
                            name="trash-2"
                            size={20}
                            color={hovered ? "#DC2626" : "#E53E3E"}
                          />
                          <Text
                            style={[
                              styles.deleteText,
                              hovered && styles.deleteTextHovered,
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
                <Text style={styles.titleText}>
                  Was soll damit gemacht werden?
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="z.B. Fasse als Haiku zusammen"
                  placeholderTextColor="#A0AEC0"
                  value={customText}
                  onChangeText={setCustomText}
                  autoFocus
                  multiline
                />
                <Pressable style={styles.submitButton} onPress={submitCustom}>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "rgba(240, 246, 255, 0.85)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(225, 232, 240, 0.6)",
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
  optionHovered: {
    backgroundColor: "#E2F1FF",
    borderColor: "#C5E2FF",
  },
  optionText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "500",
  },
  optionTextHovered: {
    color: "#2553B8",
    fontWeight: "600",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
  },
  customContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(225, 232, 240, 0.8)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#4A5568",
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#2563EB",
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
    backgroundColor: "rgba(225, 232, 240, 0.6)",
    marginVertical: 8,
  },
  deleteText: {
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "500",
  },
  deleteHovered: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  deleteTextHovered: {
    color: "#B91C1C",
    fontWeight: "600",
  },
});
