// lib/notes.ts
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';

export async function uploadAudioAndCreateNote(localUri: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht eingeloggt');

  const fileName = `${user.id}/${Date.now()}.m4a`;
  const fileContent = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const { error: uploadError } = await supabase.storage
    .from('voice-notes')
    .upload(fileName, decode(fileContent), { contentType: 'audio/m4a' });

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

// Hilfsfunktion: Base64 zu ArrayBuffer (für den Storage-Upload benötigt)
function decode(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}