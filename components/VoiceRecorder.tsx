// components/VoiceRecorder.tsx
import { useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
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
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Mikrofon-Zugriff benötigt', 'Bitte erlaube den Mikrofonzugriff in den Einstellungen.');
      }
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
    <View style={styles.container}>
      <Button
        title={recorderState.isRecording ? '⏹ Aufnahme stoppen' : '🎤 Aufnahme starten'}
        onPress={recorderState.isRecording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
});