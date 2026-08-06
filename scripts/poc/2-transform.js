// scripts/poc/2-transform.js

import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Gemeinsames Ausgabe-Schema für alle 6 Modi
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Kurzer, prägnanter Titel für die Notiz",
    },
    formatted_content: {
      type: Type.STRING,
      description: "Der umgewandelte/formatierte Text",
    },
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

const PROMPTS = {
  todo: (
    text,
  ) => `Wandle die folgende gesprochene Notiz in eine strukturierte To-Do-Liste um.
Erkenne einzelne Aufgaben, formuliere sie als klare Handlungspunkte (im Imperativ), 
entferne Füllwörter und Wiederholungen. Falls Zeitangaben genannt werden, übernimm sie.

Notiz: "${text}"`,

  diary: (
    text,
  ) => `Wandle die folgende gesprochene Notiz in einen zusammenhängenden Tagebucheintrag um.
Behalte die persönliche, emotionale Perspektive bei, glätte aber Grammatik und Satzbau.
Schreibe in der Ich-Form, in einem warmen, reflektierten Ton.

Notiz: "${text}"`,

  idea: (
    text,
  ) => `Wandle die folgende gesprochene Notiz in eine strukturierte Ideen-Notiz um.
Fasse die Kernidee klar zusammen, ergänze ggf. 2-3 Unterpunkte, die die Idee ausdifferenzieren.

Notiz: "${text}"`,

  message: (
    text,
  ) => `Wandle die folgende gesprochene Notiz in einen Entwurf für eine Nachricht 
(E-Mail oder WhatsApp, je nach Ton) um. Formuliere höflich, klar und auf den Punkt. 
Wähle einen passenden Betreff/Einstieg, falls es sich wie eine E-Mail liest.

Notiz: "${text}"`,

  style: (
    text,
  ) => `Verbessere den Stil des folgenden, strukturlos gesprochenen Textes:
Mach ihn flüssiger, eleganter und grammatikalisch korrekt, ohne den Inhalt oder die 
ursprüngliche Aussage zu verändern.

Notiz: "${text}"`,

  blog: (
    text,
  ) => `Wandle die folgende gesprochene Notiz in den Entwurf für einen kurzen 
Blogartikel um (3-5 Absätze). Strukturiere mit einer Einleitung, die neugierig macht, 
einem Hauptteil, der den Gedanken ausführt, und einem kurzen Fazit.

Notiz: "${text}"`,

  // Freier Modus: der User gibt seine eigene Anweisung ein, statt eine feste Vorlage zu nutzen
  custom: (text, instruction) => `${instruction}

Wende diese Anweisung auf die folgende gesprochene Notiz an:

Notiz: "${text}"`,
};

// async function transform(mode, rawText, customInstruction) {
export async function transform(mode, rawText, customInstruction) {
  const promptFn = PROMPTS[mode];
  if (!promptFn) throw new Error(`Unbekannter Modus: ${mode}`);
  if (mode === "custom" && !customInstruction) {
    throw new Error("Für den custom-Modus wird eine eigene Anweisung benötigt");
  }

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest", // zeigt immer auf die aktuelle empfohlene Flash-Version
    contents:
      mode === "custom"
        ? promptFn(rawText, customInstruction)
        : promptFn(rawText),
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  return JSON.parse(response.text);
}

async function main() {
  // const rawText = 'ich muss noch die wäsche waschen und meine schwester anrufen und ich sollte auch noch milch kaufen'; // ersetzen durch echtes Transkript aus 2.3
  // const mode = 'custom'; // 'todo' | 'diary' | 'idea' | 'message' | 'style' | 'blog' | 'custom'
  // const customInstruction = 'Fass die Notiz als kurzes, launiges Haiku zusammen.'; // nur bei mode === 'custom' relevant

  // const rawText = 'heute war irgendwie ein komischer Tag, ich hab mich beim Meeting total unsicher gefühlt obwohl ich eigentlich gut vorbereitet war, keine Ahnung warum das so war';
  // const mode = 'diary';

  const rawText =
    "Ich muss kurz festhalten, was mir gerade durch den Kopf geht. Der Tag war echt intensiv heute. Einerseits hat das Projekt in der Abend super geklappt, was mich riesig freut. Aber andererseits merke ich einfach, wie platt ich bin. Ich nehme mir im Moment irgendwie zu wenig Zeit für mich selbst, um einfach mal durchzuatmen. Und heute Abend mache ich definitiv nichts Produktives mehr, sondern lege mich einfach nur noch ins Bett.";
  const mode = "custom";
  const customInstruction =
    "Fasse die Notiz in genau 3 knackigen Bulletpoints zusammen, jeweils maximal 5 Wörter.";

  const result = await transform(mode, rawText, customInstruction);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
