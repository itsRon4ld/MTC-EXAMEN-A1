import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log('Seeding 200 questions to Neon Postgres...');
  const jsonPath = path.join(process.cwd(), 'src', 'core', 'training-quiz', 'server', 'data', 'balotario-200.json');
  const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  for (const q of questions) {
    await sql`
      INSERT INTO questions (id, code, category, prompt, media_url, options, correct_answer, explanation)
      VALUES (
        ${q.id},
        ${q.code || null},
        ${q.category},
        ${q.prompt},
        ${q.mediaUrl || null},
        ${JSON.stringify(q.options)},
        ${q.correctAnswer},
        ${q.explanation || null}
      )
      ON CONFLICT (id) DO UPDATE SET
        code = EXCLUDED.code,
        category = EXCLUDED.category,
        prompt = EXCLUDED.prompt,
        media_url = EXCLUDED.media_url,
        options = EXCLUDED.options,
        correct_answer = EXCLUDED.correct_answer,
        explanation = EXCLUDED.explanation;
    `;
  }

  const countRes = await sql`SELECT count(*) as total FROM questions;`;
  console.log(`Successfully seeded! Total questions in database: ${countRes[0].total}`);
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
