// scripts/poc/4-test-edge-function.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
}

async function main() {
  const email = await ask('Deine E-Mail-Adresse (für Login-Link): ');
  const { error: otpError } = await supabase.auth.signInWithOtp({ email });
  if (otpError) throw otpError;

  console.log('\nLink wurde per E-Mail verschickt (auch im Spam-Ordner nachschauen).');
  console.log('Öffne die Mail, aber klick den Link NICHT an – kopier stattdessen die komplette');
  console.log('Link-URL (Rechtsklick auf "Sign in" → "Link-Adresse kopieren").\n');
  const link = await ask('Komplette Link-URL hier einfügen: ');

  const url = new URL(link.trim());
  const tokenHash = url.searchParams.get('token');
  if (!tokenHash) throw new Error('Kein token-Parameter im Link gefunden – falschen Link kopiert?');

  const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: 'magiclink',
  });
  if (verifyError) throw verifyError;
  console.log('✅ Eingeloggt als:', sessionData.user.email);

  // Test-Audio hochladen (nutzt dieselbe Datei wie in Schritt 2)
  const audioPath = path.join(__dirname, 'test-audio', 'todo-test.mp3');
  const audioBuffer = fs.readFileSync(audioPath);
  const fileName = `${sessionData.user.id}/${Date.now()}.mp3`;

  const { error: uploadError } = await supabase.storage
    .from('voice-notes')
    .upload(fileName, audioBuffer, { contentType: 'audio/mpeg' });
  if (uploadError) throw uploadError;
  console.log('✅ Audio hochgeladen:', fileName);

  // Notiz-Eintrag anlegen
  const { data: note, error: insertError } = await supabase
    .from('notes')
    .insert({ user_id: sessionData.user.id, audio_url: fileName, status: 'recorded' })
    .select()
    .single();
  if (insertError) throw insertError;
  console.log('✅ Notiz angelegt:', note.id);

  // Edge Function aufrufen
  console.log('\n🚀 Rufe process-note auf...');
  const { data: result, error: fnError } = await supabase.functions.invoke('process-note', {
    body: { noteId: note.id, mode: 'todo' },
  });
  if (fnError) throw fnError;

  console.log('\n✅ Ergebnis:\n');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error('❌ Fehler:', err);
});