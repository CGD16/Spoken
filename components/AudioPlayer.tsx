// components/AudioPlayer.tsx
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = { uri: string | null };

export default function AudioPlayer({ uri }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const player = useAudioPlayer(uri ?? undefined);
  const status = useAudioPlayerStatus(player);

  if (!uri) return null;

  const togglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = status.duration ? status.currentTime / status.duration : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceMuted }]}>
      <Pressable
        style={[styles.playButton, { backgroundColor: theme.primary }]}
        onPress={togglePlay}
      >
        <Text style={styles.playIcon}>{status.playing ? "⏸" : "▶"}</Text>
      </Pressable>
      <View style={styles.waveform}>
        {Array.from({ length: 28 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: 6 + ((i * 7) % 18),
                backgroundColor: theme.waveformInactive,
              },
              i / 28 < progress && { backgroundColor: theme.primary },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.time, { color: theme.textMuted }]}>
        {formatTime(status.currentTime ?? 0)} /{" "}
        {formatTime(status.duration ?? 0)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 12,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: { color: "white", fontSize: 14 },
  waveform: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 24,
  },
  bar: { width: 3, borderRadius: 2 },
  time: { fontSize: 12 },
});
