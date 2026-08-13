// hooks/useNotes.ts
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import {
  uploadAudioAndProcessNote,
  processNote,
  toggleFavorite as toggleFavoriteApi,
  deleteNote as deleteNoteApi,
  updateNoteTitle,
  updateNoteTags,
} from '@/lib/notes';
import type { Note } from '@/types/note';
import type { NoteMode } from '@/components/ModeActionSheet';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotes = useCallback(async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    setNotes(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const refresh = () => {
    setRefreshing(true);
    loadNotes();
  };

  const recordAndProcess = async (localUri: string, mode: NoteMode, customInstruction?: string) => {
    await uploadAudioAndProcessNote(localUri, mode, customInstruction);
    loadNotes();
  };

  const reprocess = async (noteId: string, mode: NoteMode, customInstruction?: string) => {
    await processNote(noteId, mode, customInstruction);
    loadNotes();
  };

  const toggleFavorite = async (note: Note) => {
    const nextState = !note.is_favorite;

    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, is_favorite: nextState } : n))
    );

    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_favorite: nextState })
        .eq('id', note.id);

      if (error) throw error;
    } catch (err) {
      console.error('Fehler beim Favorisieren:', err);
      loadNotes();
    }
  };

  const renameTitle = async (noteId: string, title: string) => {
    await updateNoteTitle(noteId, title);
    loadNotes();
  };

  const saveTags = async (noteId: string, tags: string[]) => {
    await updateNoteTags(noteId, tags);
    loadNotes();
  };

  const saveResult = async (noteId: string, text: string) => {
    await supabase
      .from('notes')
      .update({ processed_text: text })
      .eq('id', noteId);
    loadNotes();
  };

  const remove = async (noteId: string) => {
    await deleteNoteApi(noteId);
    loadNotes();
  };

  const favoriteNotes = notes.filter((note) => !!note.is_favorite);

  return {
    notes,
    favoriteNotes,
    loading,
    refreshing,
    refresh,
    recordAndProcess,
    reprocess,
    toggleFavorite,
    renameTitle,
    saveTags,
    saveResult,
    remove,
  };
}