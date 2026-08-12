import { View, Text, StyleSheet } from 'react-native';

export default function TagsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meine Tags</Text>
      <Text style={styles.placeholder}>Kommt in einer späteren Version.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f7f9fb' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1c2b39', marginBottom: 12 },
  placeholder: { fontSize: 14, color: '#9aa5b1' },
});