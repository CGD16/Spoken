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
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  onRecordingComplete: (uri: string) => void;
};

export default function VoiceRecorder({ onRecordingComplete }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

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
      <View
        style={[
          styles.label,
          {
            backgroundColor: theme.surface,
            shadowColor: theme.shadowColor,
            boxShadow: isDark
              ? "0px 2px 8px rgba(0, 0, 0, 0.4)"
              : "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        ]}
      >
        <Text style={[styles.labelText, { color: theme.text }]}>
          {isRecording ? "Aufnahme läuft..." : "Aufnehmen"}
        </Text>
      </View>
      <Pressable
        style={({ hovered }) => [
          styles.fab,
          {
            backgroundColor: isRecording ? theme.danger : theme.success,
            shadowColor: theme.shadowColor,
          },
          hovered && {
            backgroundColor: isRecording
              ? theme.dangerHover
              : theme.primaryHover,
          },
        ]}
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
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelText: { fontSize: 13, fontWeight: "600" },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: { fontSize: 26 },
});
