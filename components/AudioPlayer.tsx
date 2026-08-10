// components/AudioPlayer.tsx
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

type Props = { uri: string | null };

export default function AudioPlayer({ uri }: Props) {
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
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = status.duration ? status.currentTime / status.duration : 0;

  return (
    <View style={styles.container}>
      <Pressable style={styles.playButton} onPress={togglePlay}>
        <Text style={styles.playIcon}>{status.playing ? '⏸' : '▶'}</Text>
      </Pressable>
      <View style={styles.waveform}>
        {Array.from({ length: 28 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              { height: 6 + ((i * 7) % 18) },
              i / 28 < progress && styles.barActive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.time}>
        {formatTime(status.currentTime ?? 0)} / {formatTime(status.duration ?? 0)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#eef6fb',
    borderRadius: 14,
    padding: 12,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2f95dc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: { color: 'white', fontSize: 14 },
  waveform: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2, height: 24 },
  bar: { width: 3, borderRadius: 2, backgroundColor: '#b7d8ec' },
  barActive: { backgroundColor: '#2f95dc' },
  time: { fontSize: 12, color: '#5b6b7a' },
});