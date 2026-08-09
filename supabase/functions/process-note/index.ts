// supabase/functions/process-note/index.ts
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { GoogleGenAI, Type } from "npm:@google/genai";
import Groq from "npm:groq-sdk";

const groq = new Groq({ apiKey: Deno.env.get("GROQ_API_KEY") });
const ai = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_API_KEY") });

// Gemeinsames Ausgabe-Schema für alle 7 Modi
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Kurzer, prägnanter Titel für die Notiz" },
    formatted_content: { type: Type.STRING, description: "Der umgewandelte/formatierte Text" },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-4 thematische Schlagwörter",
    },
    suggested_type: {
      type: Type.STRING,
      enum: ["todo", "diary", "idea", "message", "style", "blog", "custom"],
    },
  },
  required: ["title", "formatted_content", "tags", "suggested_type"],
};

const PROMPTS: Record<string, (text: string, instruction?: string) => string> = {
  todo: (text) => `Wandle die folgende gesprochene Notiz in eine strukturierte To-Do-Liste um.
Erkenne einzelne Aufgaben, formuliere sie als klare Handlungspunkte (im Imperativ), 
entferne Füllwörter und Wiederholungen. Falls Zeitangaben genannt werden, übernimm sie.

Notiz: "${text}"`,

  diary: (text) => `Wandle die folgende gesprochene Notiz in einen zusammenhängenden Tagebucheintrag um.
Behalte die persönliche, emotionale Perspektive bei, glätte aber Grammatik und Satzbau.
Schreibe in der Ich-Form, in einem warmen, reflektierten Ton.

Notiz: "${text}"`,

  idea: (text) => `Wandle die folgende gesprochene Notiz in eine strukturierte Ideen-Notiz um.
Fasse die Kernidee klar zusammen, ergänze ggf. 2-3 Unterpunkte, die die Idee ausdifferenzieren.

Notiz: "${text}"`,

  message: (text) => `Wandle die folgende gesprochene Notiz in einen Entwurf für eine Nachricht 
(E-Mail oder WhatsApp, je nach Ton) um. Formuliere höflich, klar und auf den Punkt. 
Wähle einen passenden Betreff/Einstieg, falls es sich wie eine E-Mail liest.

Notiz: "${text}"`,

  style: (text) => `Verbessere den Stil des folgenden, strukturlos gesprochenen Textes:
Mach ihn flüssiger, eleganter und grammatikalisch korrekt, ohne den Inhalt oder die 
ursprüngliche Aussage zu verändern.

Notiz: "${text}"`,

  blog: (text) => `Wandle die folgende gesprochene Notiz in den Entwurf für einen kurzen 
Blogartikel um (3-5 Absätze). Strukturiere mit einer Einleitung, die neugierig macht, 
einem Hauptteil, der den Gedanken ausführt, und einem kurzen Fazit.

Notiz: "${text}"`,

  // Freier Modus: der User gibt seine eigene Anweisung ein, statt eine feste Vorlage zu nutzen
  custom: (text, instruction) => `${instruction}

Wende diese Anweisung auf die folgende gesprochene Notiz an:

Notiz: "${text}"`,
};

export default {
  // auth: "user" bedeutet: die Funktion wird nur mit einer gültigen User-Session aufgerufen
  // (aus der App via supabase.functions.invoke) und ctx.supabase ist automatisch auf den
  // aufrufenden User beschränkt – die RLS-Policies aus 3.1 greifen also automatisch,
  // kein manueller service_role-Client nötig.
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    const { noteId, mode, customInstruction } = await req.json();

    const promptFn = PROMPTS[mode];
    if (!promptFn) {
      return Response.json({ error: `Unbekannter Modus: ${mode}` }, { status: 400 });
    }
    if (mode === "custom" && !customInstruction) {
      return Response.json(
        { error: "Für den custom-Modus wird eine eigene Anweisung benötigt" },
        { status: 400 }
      );
    }

    const { data: note, error: noteError } = await ctx.supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .single();
    if (noteError) throw noteError;

    const { data: audioBlob, error: downloadError } = await ctx.supabase.storage
      .from("voice-notes")
      .download(note.audio_url);
    if (downloadError) throw downloadError;

    // Groq braucht ein Datei-Objekt MIT Namen/Endung (nicht nur ein rohes Blob),
    // damit es das Audioformat erkennt
    const fileName = note.audio_url.split("/").pop() ?? "audio.mp3";
    const audioFile = new File([audioBlob], fileName, {
      type: audioBlob.type || "audio/mpeg",
    });

    // 1. Transkription (Groq)
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      language: "de",
    });

    // 2. Transformation (Gemini)
    const contents =
      mode === "custom" ? promptFn(transcription.text, customInstruction) : promptFn(transcription.text);
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
      config: { responseMimeType: "application/json", responseSchema },
    });
    const result = JSON.parse(geminiResponse.text);

    // 3. Ergebnis in der DB aktualisieren
    const { error: updateError } = await ctx.supabase
      .from("notes")
      .update({
        raw_transcript: transcription.text,
        processed_text: result.formatted_content,
        title: result.title,
        tags: result.tags,
        note_type: result.suggested_type,
        status: "done",
      })
      .eq("id", noteId);
    if (updateError) throw updateError;

    return Response.json({ success: true, result });
  }),
};