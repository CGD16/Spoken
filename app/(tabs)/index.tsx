// app/(tabs)/index.tsx
import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import {
  uploadAudioAndProcessNote,
  processNote,
  toggleFavorite,
  deleteNote,
  updateNoteTitle,
  updateNoteTags,
} from "@/lib/notes";
import RecordButton from "@/components/RecordButton";
import ModeActionSheet, { NoteMode } from "@/components/ModeActionSheet";
import ConfirmDialog from "@/components/ConfirmDialog";
import EditMenu from "@/components/EditMenu";
import RenameTitleDialog from "@/components/RenameTitleDialog";
import EditTagsDialog from "@/components/EditTagsDialog";

type Note = {
  id: string;
  raw_transcript: string | null;
  processed_text: string | null;
  title: string | null;
  tags: string[] | null;
  status: string;
  created_at: string;
  is_favorite: boolean | null;
};

export default function NotesListScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Aufnahme -> Modus wählen (bestehender Flow, unverändert)
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Bearbeiten-Menü (Stift-Icon): Titel/Tags/Löschen
  const [editTargetNote, setEditTargetNote] = useState<Note | null>(null);
  const [editMenuVisible, setEditMenuVisible] = useState(false);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [tagsDialogVisible, setTagsDialogVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    setNotes(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadNotes();
  };

  const handleRecordingComplete = (uri: string) => {
    setPendingUri(uri);
    setPendingNoteId(null);
    setSheetVisible(true);
  };

  // Drei-Punkte-Icon: bleibt wie gehabt -> Modus-Auswahl (kein Löschen mehr hier)
  const openMenuForNote = (noteId: string) => {
    setPendingNoteId(noteId);
    setPendingUri(null);
    setSheetVisible(true);
  };

  const handleModeSelected = async (
    mode: NoteMode,
    customInstruction?: string,
  ) => {
    try {
      if (pendingUri) {
        await uploadAudioAndProcessNote(pendingUri, mode, customInstruction);
      } else if (pendingNoteId) {
        await processNote(pendingNoteId, mode, customInstruction);
      }
      loadNotes();
    } catch (err) {
      console.error("Fehler bei der Verarbeitung:", err);
    }
  };

  const handleToggleFavorite = async (note: Note) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === note.id ? { ...n, is_favorite: !n.is_favorite } : n,
      ),
    );
    try {
      await toggleFavorite(note.id, !note.is_favorite);
    } catch (err) {
      console.error("Fehler beim Favorisieren:", err);
      loadNotes();
    }
  };

  // Stift-Icon: öffnet das Bearbeiten-Dropdown
  const openEditMenu = (note: Note) => {
    setEditTargetNote(note);
    setEditMenuVisible(true);
  };

  const handleRenameTitle = async (newTitle: string) => {
    if (!editTargetNote) return;
    try {
      await updateNoteTitle(editTargetNote.id, newTitle);
      setRenameDialogVisible(false);
      setEditTargetNote(null);
      loadNotes();
    } catch (err) {
      console.error("Fehler beim Umbenennen:", err);
    }
  };

  const handleSaveTags = async (newTags: string[]) => {
    if (!editTargetNote) return;
    try {
      await updateNoteTags(editTargetNote.id, newTags);
      setTagsDialogVisible(false);
      setEditTargetNote(null);
      loadNotes();
    } catch (err) {
      console.error("Fehler beim Speichern der Tags:", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteNote(deleteTargetId);
      setDeleteTargetId(null);
      setEditTargetNote(null);
      loadNotes();
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      setDeleteTargetId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notizen</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Noch keine Notizen – tippe unten auf 🎤
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/note/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>
                {new Date(item.created_at).toLocaleDateString("de-DE")}
              </Text>

              <View style={styles.cardHeaderIcons}>
                <Pressable
                  onPress={() => handleToggleFavorite(item)}
                  hitSlop={12}
                >
                  {({ hovered }) => (
                    <View
                      style={[
                        styles.iconButton,
                        hovered && styles.iconButtonHovered,
                      ]}
                    >
                      <Ionicons
                        name={item.is_favorite ? "star" : "star-outline"}
                        size={18}
                        color={
                          item.is_favorite
                            ? "#FFF051"
                            : hovered
                              ? "#2553B8"
                              : "#9aa5b1"
                        }
                      />
                    </View>
                  )}
                </Pressable>
                <Pressable onPress={() => openEditMenu(item)} hitSlop={12}>
                  {({ hovered }) => (
                    <View
                      style={[
                        styles.iconButton,
                        hovered && styles.iconButtonHovered,
                      ]}
                    >
                      <Feather
                        name="edit-2"
                        size={18}
                        color={hovered ? "#2553B8" : "#9aa5b1"}
                      />
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => openMenuForNote(item.id)}
                  hitSlop={12}
                >
                  {({ hovered }) => (
                    <View
                      style={[
                        styles.iconButton,
                        hovered && styles.iconButtonHovered,
                      ]}
                    >
                      <Feather
                        name="more-horizontal"
                        size={18}
                        color={hovered ? "#2553B8" : "#9aa5b1"}
                      />
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
            <Text style={styles.cardTitle}>
              {item.title ?? "Unbenannte Notiz"}
            </Text>
            <Text style={styles.cardPreview} numberOfLines={2}>
              {item.processed_text ??
                item.raw_transcript ??
                "Wird verarbeitet..."}
            </Text>
            {item.tags && item.tags.length > 0 && (
              <Text style={styles.tags}>{item.tags.join(" · ")}</Text>
            )}
            <Text style={styles.status}>{item.status}</Text>
            <View style={styles.miniWaveform}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.miniBar, { height: 4 + ((i * 5) % 12) }]}
                />
              ))}
            </View>
          </Pressable>
        )}
      />

      <View style={styles.recorderContainer}>
        <RecordButton onRecordingComplete={handleRecordingComplete} />
      </View>

      {/* Drei-Punkte -> Modus-Auswahl (kein Löschen mehr hier) */}
      <ModeActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSelect={handleModeSelected}
      />

      {/* Stift-Icon -> Bearbeiten-Dropdown */}
      <EditMenu
        visible={editMenuVisible}
        onClose={() => setEditMenuVisible(false)}
        onRenameTitle={() => setRenameDialogVisible(true)}
        onEditTags={() => setTagsDialogVisible(true)}
        onDelete={() => editTargetNote && setDeleteTargetId(editTargetNote.id)}
      />

      <RenameTitleDialog
        visible={renameDialogVisible}
        initialTitle={editTargetNote?.title ?? ""}
        onSave={handleRenameTitle}
        onCancel={() => {
          setRenameDialogVisible(false);
          setEditTargetNote(null);
        }}
      />

      <EditTagsDialog
        visible={tagsDialogVisible}
        initialTags={editTargetNote?.tags ?? []}
        onSave={handleSaveTags}
        onCancel={() => {
          setTagsDialogVisible(false);
          setEditTargetNote(null);
        }}
      />

      <ConfirmDialog
        visible={!!deleteTargetId}
        title="Notiz löschen?"
        message="Möchtest du diese Notiz wirklich löschen?"
        confirmLabel="Löschen"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTargetId(null);
          setEditTargetNote(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 16,
    paddingBottom: 8,
    color: "#1c2b39",
  },
  empty: { textAlign: "center", color: "#9aa5b1", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderIcons: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconButton: { padding: 6, borderRadius: 8},
  iconButtonHovered: {
    backgroundColor: "#E2F1FF",
    borderWidth: 1,
    borderColor: "#C5E2FF",
  },
  cardDate: { fontSize: 12, color: "#9aa5b1" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1c2b39" },
  cardPreview: { fontSize: 14, color: "#5b6b7a", lineHeight: 19 },
  tags: { fontSize: 12, color: "#2f95dc", fontWeight: "600" },
  status: { fontSize: 11, color: "#c2cad3" },
  miniWaveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 16,
    marginTop: 4,
  },
  miniBar: { width: 2, borderRadius: 1, backgroundColor: "#cfe4f0" },
  recorderContainer: { position: "absolute", bottom: 24, right: 20 },
});
