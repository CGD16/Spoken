// components/VoiceRecorder.tsx
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onRecordingComplete: (uri: string) => void;
};

export default function VoiceRecorder({ onRecordingComplete }: Props) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  useEffect(() => {
    (async () => {
      await AudioModule.requestRecordingPermissionsAsync();
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
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

  const isRecording = recorderState.isRecording;

  return (
    <View style={styles.row}>
      <View style={styles.label}>
        <Text style={styles.labelText}>
          {isRecording ? "Aufnahme läuft..." : "Aufnehmen"}
        </Text>
      </View>
      <Pressable
        style={[styles.fab, isRecording && styles.fabRecording]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.icon}>{isRecording ? "⏹" : "🎤"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelText: { fontSize: 13, fontWeight: "600", color: "#1c2b39" },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#16a596",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  fabRecording: {
    backgroundColor: "#d9534f",
  },
  icon: { fontSize: 26 },
});
