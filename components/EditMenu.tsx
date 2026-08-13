// components/EditMenu.tsx
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

type Props = {
  visible: boolean;
  onClose: () => void;
  onRenameTitle: () => void;
  onEditTags: () => void;
  onEditResult: () => void;
  onDelete: () => void;
};

export default function EditMenu({
  visible,
  onClose,
  onRenameTitle,
  onEditTags,
  onEditResult,
  onDelete,
}: Props) {
  const handle = (fn: () => void) => {
    onClose();
    fn();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <BlurView
            intensity={45}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.content}>
            {/* 1. Titel bearbeiten */}
            <Pressable onPress={() => handle(onRenameTitle)}>
              {({ hovered }) => (
                <View style={[styles.option, hovered && styles.optionHovered]}>
                  <Feather
                    name="edit-3"
                    size={20}
                    color={hovered ? "#1E40AF" : "#2563EB"}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      hovered && styles.optionTextHovered,
                    ]}
                  >
                    Titel bearbeiten
                  </Text>
                </View>
              )}
            </Pressable>

            {/* 2. Tags bearbeiten */}
            <Pressable onPress={() => handle(onEditTags)}>
              {({ hovered }) => (
                <View style={[styles.option, hovered && styles.optionHovered]}>
                  <Feather
                    name="tag"
                    size={20}
                    color={hovered ? "#1E40AF" : "#2563EB"}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      hovered && styles.optionTextHovered,
                    ]}
                  >
                    Tags bearbeiten
                  </Text>
                </View>
              )}
            </Pressable>

            {/* 3. Ergebnis bearbeiten */}
            <Pressable onPress={() => handle(onEditResult)}>
              {({ hovered }) => (
                <View style={[styles.option, hovered && styles.optionHovered]}>
                  <Feather
                    name="align-left"
                    size={20}
                    color={hovered ? "#1E40AF" : "#2563EB"}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      hovered && styles.optionTextHovered,
                    ]}
                  >
                    Ergebnis bearbeiten
                  </Text>
                </View>
              )}
            </Pressable>

            <View style={styles.divider} />

            {/* Löschen */}
            <Pressable onPress={() => handle(onDelete)}>
              {({ hovered }) => (
                <View
                  style={[styles.option, hovered && styles.optionDeleteHovered]}
                >
                  <Feather name="trash-2" size={20} color="#DC2626" />
                  <Text style={styles.deleteText}>Löschen</Text>
                </View>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "rgba(240, 246, 255, 0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(225, 232, 240, 0.8)",
    overflow: "hidden",
  },
  content: { padding: 16, gap: 4 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionHovered: { backgroundColor: "#E0F2FE" },
  optionDeleteHovered: { backgroundColor: "#FEE2E2" },
  optionText: { fontSize: 14, color: "#4A5568", fontWeight: "500" },
  optionTextHovered: { color: "#1E40AF", fontWeight: "600" },
  deleteText: { fontSize: 14, color: "#DC2626", fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "rgba(225, 232, 240, 0.6)",
    marginVertical: 8,
  },
});
