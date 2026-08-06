// scripts/poc/1-transcribe.js
import "dotenv/config";
import fs from "fs";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function transcribe(audioFilePath) {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: "whisper-large-v3-turbo", // schneller; für höchste Genauigkeit alternativ 'whisper-large-v3'
    language: "de",
    response_format: "json",
    temperature: 0.0,
  });
  return transcription.text;
}

async function main() {
  //  const testFile = path.join(__dirname, 'test-audio', 'todo-test.mp3');
  const testFile = path.join(__dirname, "test-audio", "gedanken-test.wav");
  // const testFile = path.join(__dirname, 'test-audio', 'gedanken-test.m4a');
  // const testFile = path.join(__dirname, 'test-audio', 'email-test.mp3');

  console.log("Transkribiere:", testFile);
  const text = await transcribe(testFile);
  console.log("\n--- Ergebnis ---\n");
  console.log(text);
}

main().catch(console.error);

export { transcribe };
