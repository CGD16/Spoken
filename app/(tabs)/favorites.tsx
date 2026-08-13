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
import ModeActionSheet, { NoteMode } from "@/components/ModeActionSheet";
import ConfirmDialog from "@/components/ConfirmDialog";
import EditMenu from "@/components/EditMenu";
import RenameTitleDialog from "@/components/RenameTitleDialog";
import EditTagsDialog from "@/components/EditTagsDialog";
import EditResultDialog from "@/components/EditResultDialog";

export default function FavoritesScreen() {
  const router = useRouter();
  const {
    favoriteNotes,
    loading,
    refreshing,
    refresh,
    reprocess,
    toggleFavorite,
    renameTitle,
    saveTags,
    saveResult,
    remove,
  } = useNotes();

  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const [editTargetNote, setEditTargetNote] = useState<Note | null>(null);
  const [editMenuVisible, setEditMenuVisible] = useState(false);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [tagsDialogVisible, setTagsDialogVisible] = useState(false);
  const [resultDialogVisible, setResultDialogVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const openMenuForNote = (noteId: string) => {
    setPendingNoteId(noteId);
    setSheetVisible(true);
  };

  const handleModeSelected = async (
    mode: NoteMode,
    customInstruction?: string,
  ) => {
    try {
      if (pendingNoteId) {
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
    await renameTitle(editTargetNote.id, newTitle);
    setRenameDialogVisible(false);
    setEditTargetNote(null);
  };

  const handleSaveTags = async (newTags: string[]) => {
    if (!editTargetNote) return;
    await saveTags(editTargetNote.id, newTags);
    setTagsDialogVisible(false);
    setEditTargetNote(null);
  };

  const handleSaveResult = async (newResult: string) => {
    if (!editTargetNote) return;
    await saveResult(editTargetNote.id, newResult);
    setResultDialogVisible(false);
    setEditTargetNote(null);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    await remove(deleteTargetId);
    setDeleteTargetId(null);
    setEditTargetNote(null);
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
      <Text style={styles.header}>Favoriten</Text>
      <FlatList
        data={favoriteNotes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Noch keine Favoriten vorhanden. Markiere Notizen mit dem Stern ⭐
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
        onEditResult={() => setResultDialogVisible(true)}
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

      <EditResultDialog
        visible={resultDialogVisible}
        initialResult={
          editTargetNote?.processed_text ?? editTargetNote?.raw_transcript ?? ""
        }
        onSave={handleSaveResult}
        onCancel={() => {
          setResultDialogVisible(false);
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
});
