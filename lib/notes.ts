// lib/notes.ts
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export async function uploadAudioAndCreateNote(localUri: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht eingeloggt');

  // Web und Handy liefern die Aufnahme in unterschiedlichen Formaten:
  // Handy: file://-Pfad, über expo-file-system als Base64 lesbar
  // Web: blob:-URL, expo-file-system unterstützt das nicht – hier direkt per fetch() als Blob laden
  let fileData: Blob | ArrayBuffer;
  let ext = 'm4a';
  let contentType = 'audio/m4a';

  if (Platform.OS === 'web') {
    const response = await fetch(localUri);
    fileData = await response.blob();
    contentType = (fileData as Blob).type || 'audio/webm';
    ext = contentType.includes('webm') ? 'webm' : 'm4a';
  } else {
    const fileContent = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    fileData = decode(fileContent);
  }

  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('voice-notes')
    .upload(fileName, fileData, { contentType });

  if (uploadError) throw uploadError;

  const { data: noteData, error: insertError } = await supabase
    .from('notes')
    .insert({ user_id: user.id, audio_url: fileName, status: 'recorded' })
    .select()
    .single();

  if (insertError) throw insertError;
  return noteData;
}

export async function uploadAudioAndProcessNote(
  localUri: string,
  mode: string,
  customInstruction?: string
) {
  const note = await uploadAudioAndCreateNote(localUri);
  const { data, error } = await supabase.functions.invoke('process-note', {
    body: { noteId: note.id, mode, customInstruction },
  });
  if (error) throw error;
  return data.result;
}

// Für 3.4: bestehende (schon hochgeladene) Notiz erneut verarbeiten, z. B. wenn
// der User im Drei-Punkte-Menü einen anderen Modus wählt als beim ersten Mal
export async function processNote(
  noteId: string,
  mode: string,
  customInstruction?: string
) {
  const { data, error } = await supabase.functions.invoke('process-note', {
    body: { noteId, mode, customInstruction },
  });
  if (error) throw error;
  return data.result;
}

// Für 3.4b: erzeugt eine zeitlich begrenzte, abspielbare URL für eine private Audio-Datei
export async function getAudioSignedUrl(audioPath: string) {
  const { data, error } = await supabase.storage
    .from('voice-notes')
    .createSignedUrl(audioPath, 3600); // 1 Stunde gültig
  if (error) throw error;
  return data.signedUrl;
}

export async function toggleFavorite(noteId: string, isFavorite: boolean) {
  const { error } = await supabase.from('notes').update({ is_favorite: isFavorite }).eq('id', noteId);
  if (error) throw error;
}

export async function deleteNote(noteId: string) {
  const { data: note, error: fetchError } = await supabase
    .from('notes')
    .select('audio_url')
    .eq('id', noteId)
    .single();
  if (fetchError) throw fetchError;

  if (note?.audio_url) {
    await supabase.storage.from('voice-notes').remove([note.audio_url]);
  }

  const { error } = await supabase.from('notes').delete().eq('id', noteId);
  if (error) throw error;
}

export async function updateNoteTitle(noteId: string, title: string) {
  const { error } = await supabase.from('notes').update({ title }).eq('id', noteId);
  if (error) throw error;
}

export async function updateNoteTags(noteId: string, tags: string[]) {
  const { error } = await supabase.from('notes').update({ tags }).eq('id', noteId);
  if (error) throw error;
}


// Hilfsfunktion: Base64 zu ArrayBuffer (nur für den nativen Pfad benötigt)
function decode(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}