// app/login.tsx
import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const submit = async () => {
    setErrorMsg(null);
    setLoading(true);

    const { data, error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Falls "Confirm email" in Supabase aktiviert ist, gibt signUp zwar keinen
    // Fehler zurück, aber es existiert noch keine Session (data.session ist null),
    // bis die Mail bestätigt wurde
    if (mode === 'signup' && !data.session) {
      setSignupDone(true);
    }
    // Bei Erfolg mit Session übernimmt Stack.Protected in _layout.tsx automatisch
    // die Weiterleitung zur eigentlichen App
  };

  if (signupDone) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Fast fertig! Bestätige einmalig deine E-Mail-Adresse (Link in der Mail antippen),
          danach kannst du dich hier mit E-Mail + Passwort einloggen.
        </Text>
        <Pressable onPress={() => { setSignupDone(false); setMode('login'); }}>
          <Text style={styles.switchText}>Zurück zum Login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'login' ? 'Bei Spoken einloggen' : 'Konto erstellen'}</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      <TextInput
        style={styles.input}
        placeholder="deine@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort (mind. 6 Zeichen)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button
        title={loading ? 'Bitte warten...' : mode === 'login' ? 'Einloggen' : 'Konto erstellen'}
        onPress={submit}
        disabled={loading || !email || password.length < 6}
      />
      <Pressable onPress={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrorMsg(null); }}>
        <Text style={styles.switchText}>
          {mode === 'login' ? 'Noch kein Konto? Registrieren' : 'Schon ein Konto? Einloggen'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  text: { fontSize: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  error: { fontSize: 14, color: '#d33', textAlign: 'center' },
  switchText: { textAlign: 'center', color: '#2f95dc', marginTop: 8 },
});