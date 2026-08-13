// app/(tabs)/index.tsx
import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useNotes } from "@/hooks/useNotes";
import type { Note } from "@/types/note";
import NoteCard from "@/components/NoteCard";
import RecordButton from "@/components/RecordButton";
import ModeActionSheet, { NoteMode } from "@/components/ModeActionSheet";
import ConfirmDialog from "@/components/ConfirmDialog";
import EditMenu from "@/components/EditMenu";
import RenameTitleDialog from "@/components/RenameTitleDialog";
import EditTagsDialog from "@/components/EditTagsDialog";

export default function NotesListScreen() {
  const router = useRouter();
  const {
    notes,
    loading,
    refreshing,
    refresh,
    recordAndProcess,
    reprocess,
    toggleFavorite,
    renameTitle,
    saveTags,
    remove,
  } = useNotes();

  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const [editTargetNote, setEditTargetNote] = useState<Note | null>(null);
  const [editMenuVisible, setEditMenuVisible] = useState(false);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [tagsDialogVisible, setTagsDialogVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleRecordingComplete = (uri: string) => {
    setPendingUri(uri);
    setPendingNoteId(null);
    setSheetVisible(true);
  };

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
        await recordAndProcess(pendingUri, mode, customInstruction);
      } else if (pendingNoteId) {
        await reprocess(pendingNoteId, mode, customInstruction);
      }
    } catch (err) {
      console.error("Fehler bei der Verarbeitung:", err);
    }
  };

  const openEditMenu = (note: Note) => {
    setEditTargetNote(note);
    setEditMenuVisible(true);
  };

  const handleRenameTitle = async (newTitle: string) => {
    if (!editTargetNote) return;
    try {
      await renameTitle(editTargetNote.id, newTitle);
      setRenameDialogVisible(false);
      setEditTargetNote(null);
    } catch (err) {
      console.error("Fehler beim Umbenennen:", err);
    }
  };

  const handleSaveTags = async (newTags: string[]) => {
    if (!editTargetNote) return;
    try {
      await saveTags(editTargetNote.id, newTags);
      setTagsDialogVisible(false);
      setEditTargetNote(null);
    } catch (err) {
      console.error("Fehler beim Speichern der Tags:", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await remove(deleteTargetId);
      setDeleteTargetId(null);
      setEditTargetNote(null);
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
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Noch keine Notizen – tippe unten auf 🎤
          </Text>
        }
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => router.push(`/note/${item.id}`)}
            onToggleFavorite={() => toggleFavorite(item)}
            onOpenEditMenu={() => openEditMenu(item)}
            onOpenModeMenu={() => openMenuForNote(item.id)}
          />
        )}
      />

      <View style={styles.recorderContainer}>
        <RecordButton onRecordingComplete={handleRecordingComplete} />
      </View>

      <ModeActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSelect={handleModeSelected}
      />

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
  recorderContainer: { position: "absolute", bottom: 24, right: 20 },
});
