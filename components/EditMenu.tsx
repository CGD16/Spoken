// components/EditMenu.tsx
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

type Props = {
  visible: boolean;
  onClose: () => void;
  onRenameTitle: () => void;
  onEditTags: () => void;
  onDelete: () => void;
};

export default function EditMenu({
  visible,
  onClose,
  onRenameTitle,
  onEditTags,
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
            <Pressable
              style={styles.option}
              onPress={() => handle(onRenameTitle)}
            >
              <Feather name="edit-3" size={20} color="#2563EB" />
              <Text style={styles.optionText}>Titel umbenennen</Text>
            </Pressable>
            <Pressable style={styles.option} onPress={() => handle(onEditTags)}>
              <Feather name="tag" size={20} color="#2563EB" />
              <Text style={styles.optionText}>Tags bearbeiten</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.option} onPress={() => handle(onDelete)}>
              <Feather name="trash-2" size={20} color="#DC2626" />
              <Text style={styles.deleteText}>Löschen</Text>
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
    backgroundColor: "rgba(240, 246, 255, 0.85)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(225, 232, 240, 0.6)",
    overflow: "hidden",
  },
  content: { padding: 16, gap: 4 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionText: { fontSize: 14, color: "#4A5568", fontWeight: "500" },
  deleteText: { fontSize: 14, color: "#DC2626", fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "rgba(225, 232, 240, 0.6)",
    marginVertical: 8,
  },
});
