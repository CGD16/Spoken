// lib/notes.ts
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';

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

// Hilfsfunktion: Base64 zu ArrayBuffer (für den Storage-Upload benötigt)
function decode(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}