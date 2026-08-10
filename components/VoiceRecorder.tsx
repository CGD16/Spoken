// components/VoiceRecorder.tsx
import { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';

type Props = {
  onRecordingComplete: (uri: string) => void;
};

export default function VoiceRecorder({ onRecordingComplete }: Props) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  useEffect(() => {
    (async () => {
      await AudioModule.requestRecordingPermissionsAsync();
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    })();
  }, []);

  const startRecording = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    if (audioRecorder.uri) {
      onRecordingComplete(audioRecorder.uri);
    }
  };

  return (
    <Pressable
      style={[styles.fab, recorderState.isRecording && styles.fabRecording]}
      onPress={recorderState.isRecording ? stopRecording : startRecording}
    >
      <Text style={styles.icon}>{recorderState.isRecording ? '⏹' : '🎤'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#16a596',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  fabRecording: {
    backgroundColor: '#d9534f',
  },
  icon: { fontSize: 26 },
});