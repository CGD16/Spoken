// components/ModeActionSheet.tsx
import { useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, StyleSheet } from 'react-native';

export type NoteMode = 'todo' | 'diary' | 'idea' | 'message' | 'style' | 'blog' | 'custom';

const MODE_LABELS: Record<NoteMode, string> = {
  todo: '✅ To-Do-Liste',
  diary: '📔 Tagebucheintrag',
  idea: '💡 Ideen-Notiz',
  message: '✉️ Nachrichten-Entwurf',
  style: '✨ Stil verbessern',
  blog: '📝 Blogartikel-Entwurf',
  custom: '🎯 Eigener Modus',
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (mode: NoteMode, customInstruction?: string) => void;
};

export default function ModeActionSheet({ visible, onClose, onSelect }: Props) {
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');

  const handlePress = (mode: NoteMode) => {
    if (mode === 'custom') {
      setCustomMode(true);
      return;
    }
    onClose();
    onSelect(mode);
  };

  const submitCustom = () => {
    if (!customText.trim()) return;
    setCustomMode(false);
    onClose();
    onSelect('custom', customText.trim());
    setCustomText('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {!customMode ? (
            (Object.keys(MODE_LABELS) as NoteMode[]).map((mode) => (
              <Pressable key={mode} style={styles.option} onPress={() => handlePress(mode)}>
                <Text style={styles.optionText}>{MODE_LABELS[mode]}</Text>
              </Pressable>
            ))
          ) : (
            <View style={styles.customContainer}>
              <Text style={styles.optionText}>Was soll damit gemacht werden?</Text>
              <TextInput
                style={styles.input}
                placeholder="z.B. Fasse als Haiku zusammen"
                value={customText}
                onChangeText={setCustomText}
                autoFocus
                multiline
              />
              <Pressable style={styles.submitButton} onPress={submitCustom}>
                <Text style={styles.submitButtonText}>Anwenden</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, gap: 4 },
  option: { paddingVertical: 14, paddingHorizontal: 8 },
  optionText: { fontSize: 16 },
  customContainer: { gap: 12, paddingVertical: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#2f95dc', borderRadius: 8, padding: 14, alignItems: 'center' },
  submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});