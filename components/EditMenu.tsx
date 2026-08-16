// components/EditMenu.tsx
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
  const { colorScheme, themeName } = useColorScheme();

  // Robuste Theme-Auflösung mit Fallback auf Blau
  const rawTheme =
    (Themes as any)[themeName]?.[colorScheme ?? "light"] ??
    Themes.blue[colorScheme ?? "light"];

  const theme = {
    ...Themes.blue[colorScheme ?? "light"],
    ...rawTheme,
  };

  const isDarkMode = colorScheme === "dark";

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
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.backdrop }]}
        onPress={onClose}
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
            {/* 1. Titel bearbeiten */}
            <Pressable onPress={() => handle(onRenameTitle)}>
              {({ hovered }) => (
                <View
                  style={[
                    styles.option,
                    hovered && { backgroundColor: theme.hoverBg },
                  ]}
                >
                  <Feather
                    name="edit-3"
                    size={20}
                    color={hovered ? theme.primaryActive : theme.primary}
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
                    Titel bearbeiten
                  </Text>
                </View>
              )}
            </Pressable>

            {/* 2. Tags bearbeiten */}
            <Pressable onPress={() => handle(onEditTags)}>
              {({ hovered }) => (
                <View
                  style={[
                    styles.option,
                    hovered && { backgroundColor: theme.hoverBg },
                  ]}
                >
                  <Feather
                    name="tag"
                    size={20}
                    color={hovered ? theme.primaryActive : theme.primary}
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
                    Tags bearbeiten
                  </Text>
                </View>
              )}
            </Pressable>

            {/* 3. Ergebnis bearbeiten */}
            <Pressable onPress={() => handle(onEditResult)}>
              {({ hovered }) => (
                <View
                  style={[
                    styles.option,
                    hovered && { backgroundColor: theme.hoverBg },
                  ]}
                >
                  <Feather
                    name="align-left"
                    size={20}
                    color={hovered ? theme.primaryActive : theme.primary}
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
                    Ergebnis bearbeiten
                  </Text>
                </View>
              )}
            </Pressable>

            <View
              style={[styles.divider, { backgroundColor: theme.borderLight }]}
            />

            {/* Löschen */}
            <Pressable onPress={() => handle(onDelete)}>
              {({ hovered }) => (
                <View
                  style={[
                    styles.option,
                    hovered && { backgroundColor: theme.deleteHoverBg },
                  ]}
                >
                  <Feather name="trash-2" size={20} color={theme.danger} />
                  <Text style={[styles.deleteText, { color: theme.danger }]}>
                    Löschen
                  </Text>
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
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
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
  optionText: { fontSize: 14, fontWeight: "500" },
  deleteText: { fontSize: 14, fontWeight: "600" },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});
