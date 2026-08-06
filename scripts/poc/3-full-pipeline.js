// scripts/poc/3-full-pipeline.js
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { transcribe } from './1-transcribe.js';
import { transform } from './2-transform.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runPipeline(audioFileName, mode, customInstruction) {
  const audioFilePath = path.join(__dirname, 'test-audio', audioFileName);

  console.log(`\n🎤 Transkribiere: ${audioFileName}...`);
  const rawText = await transcribe(audioFilePath);
  console.log(`📝 Transkript: "${rawText}"`);

  console.log(`\n🤖 Transformiere (Modus: ${mode})...`);
  const result = await transform(mode, rawText, customInstruction);

  console.log('\n✅ Endergebnis:\n');
  console.log(JSON.stringify(result, null, 2));

  return result;
}

async function main() {
  // Beispiel 1: To-Do-Audio → todo-Modus
  await runPipeline('todo-test.mp3', 'todo');

  // Beispiel 2: E-Mail-Audio → message-Modus
  await runPipeline('email-test.mp3', 'message');

  // Beispiel 3: Gedanken-Audio → diary-Modus
  await runPipeline('gedanken-test.mp3', 'diary');
}

main().catch(console.error);