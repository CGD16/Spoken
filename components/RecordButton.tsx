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
import { useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Themes } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  onRecordingComplete: (uri: string) => void;
};

export default function RecordButton({ onRecordingComplete }: Props) {
  const { t } = useTranslation();
  const { colorScheme, themeName } = useColorScheme();

  // Robuste Theme-Auflösung mit Fallback auf Blau
  const rawTheme =
    (Themes as any)[themeName]?.[colorScheme ?? "light"] ??
    Themes.blue[colorScheme ?? "light"];

  const theme = {
    ...Themes.blue[colorScheme ?? "light"],
    ...rawTheme,
  };

  const isDark = colorScheme === "dark";

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const isRecording = recorderState.isRecording;

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  const [cancelHintVisible, setCancelHintVisible] = useState(false);

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
      setCancelHintVisible(true);
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
      setCancelHintVisible(false);
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

  const cancelRecording = async () => {
    await audioRecorder.stop();
  };

  const isRecordingRef = useRef(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        scale.value = withSpring(0.95);
      },

      onPanResponderMove: (_, gestureState) => {
        if (isRecordingRef.current) {
          if (gestureState.dx < 0) {
            translateX.value = Math.max(gestureState.dx, -130);
          }
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        scale.value = withSpring(1);

        if (!isRecordingRef.current) {
          startRecording();
        } else {
          if (gestureState.dx < -80) {
            cancelRecording();
          } else {
            stopRecording();
          }
        }

        translateX.value = withSpring(0);
      },

      onPanResponderTerminate: () => {
        scale.value = withSpring(1);
        if (isRecordingRef.current) {
          cancelRecording();
        }
        translateX.value = withSpring(0);
      },
    }),
  ).current;

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value === 1 ? pulseScale.value : scale.value },
    ],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      {cancelHintVisible && (
        <View
          style={[
            styles.cancelHintContainer,
            { backgroundColor: theme.deleteHoverBg },
          ]}
        >
          <Feather name="trash-2" size={18} color={theme.danger} />
        </View>
      )}

      <View
        style={[
          styles.pill,
          {
            shadowColor: theme.shadowColor,
            boxShadow: isDark
              ? "0px 6px 20px rgba(0, 0, 0, 0.4)"
              : "0px 6px 20px rgba(30, 41, 59, 0.12)",
          },
        ]}
      >
        <BlurView
          intensity={65}
          tint={isDark ? "dark" : "light"}
          style={[
            styles.blur,
            {
              backgroundColor: theme.sheetBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.label, { color: theme.text }]}>
            {isRecording
              ? t("recorder.recording", "Aufnahme läuft...")
              : t("recorder.record", "Aufnehmen")}
          </Text>

          <Animated.View
            {...panResponder.panHandlers}
            style={iconAnimatedStyle}
          >
            <LinearGradient
              colors={
                isRecording
                  ? [theme.danger, theme.dangerHover]
                  : [theme.primary, theme.success]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <Feather name="mic" size={20} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelHintContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  pill: {
    borderRadius: 9999,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  blur: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 9999,
    overflow: "hidden",
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
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
