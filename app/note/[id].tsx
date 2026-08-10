// app/note/[id].tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getAudioSignedUrl } from '@/lib/notes';
import AudioPlayer from '@/components/AudioPlayer';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setNote(data);
        setLoading(false);
        if (data?.audio_url) {
          getAudioSignedUrl(data.audio_url).then(setAudioUrl);
        }
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.center}>
        <Text>Notiz nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AudioPlayer uri={audioUrl} />
      <Text style={styles.title}>{note.title ?? 'Unbenannte Notiz'}</Text>
      <Text style={styles.meta}>
        {new Date(note.created_at).toLocaleString('de-DE')} · {note.status}
      </Text>
      {note.tags?.length > 0 && <Text style={styles.tags}>{note.tags.join(' · ')}</Text>}

      {note.processed_text && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Ergebnis</Text>
          <Text style={styles.body}>{note.processed_text}</Text>
        </View>
      )}

      {note.raw_transcript && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Original-Transkript</Text>
          <Text style={styles.bodySecondary}>{note.raw_transcript}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  meta: { fontSize: 13, color: '#888' },
  tags: { fontSize: 13, color: '#2f95dc' },
  section: { marginTop: 16, gap: 6 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  body: { fontSize: 16, lineHeight: 22 },
  bodySecondary: { fontSize: 14, lineHeight: 20, color: '#666', fontStyle: 'italic' },
});