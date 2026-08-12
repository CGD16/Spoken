// components/RecordButton.tsx
import { Feather } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  onRecordingComplete: (uri: string) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RecordButton({ onRecordingComplete }: Props) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const isRecording = recorderState.isRecording;

  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    (async () => {
      await AudioModule.requestRecordingPermissionsAsync();
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, {
            duration: 700,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1.0, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      pulseScale.value = withTiming(1);
      pulseOpacity.value = withTiming(1);
    }
  }, [isRecording]);

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

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value === 1 ? pulseScale.value : scale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.pill, containerAnimatedStyle]}
    >
      <BlurView intensity={65} tint="light" style={styles.blur}>
        <Text style={styles.label}>
          {isRecording ? "Aufnahme läuft..." : "Aufnehmen"}
        </Text>
        <Animated.View style={iconAnimatedStyle}>
          <LinearGradient
            colors={
              isRecording ? ["#FCA5A5", "#EF4444"] : ["#93C5FD", "#6EE7B7"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Feather name="mic" size={20} color="#fff" />
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 9999,
    // iOS / Native Schatten
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // Android Schatten
    elevation: 8,
    // Web Schatten (verhindert das Abschneiden durch overflow)
    boxShadow: "0px 6px 20px rgba(30, 41, 59, 0.12)",
  },
  blur: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(225, 232, 240, 0.7)",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A202C",
    marginRight: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
});
