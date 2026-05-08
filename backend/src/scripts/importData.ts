import { readFile } from 'fs/promises';
import { connectDB } from '../config/db';
import { collections } from '../storage/collections';
import { writeCollection } from '../storage/fileStore';

async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error('Usage: ts-node-dev --transpile-only src/scripts/importData.ts <export-file.json>');
  }

  await connectDB();
  const raw = await readFile(filePath, 'utf8');
  const payload = JSON.parse(raw) as { business?: unknown; users?: unknown[]; feedback?: unknown[]; products?: unknown[]; inventoryMovements?: unknown[]; events?: unknown[]; automationRules?: unknown[]; notifications?: unknown[] };

  await writeCollection(collections.businesses, payload.business ? [payload.business] : []);
  await writeCollection(collections.users, payload.users ?? []);
  await writeCollection(collections.feedback, payload.feedback ?? []);
  await writeCollection(collections.products, payload.products ?? []);
  await writeCollection(collections.inventoryMovements, payload.inventoryMovements ?? []);
  await writeCollection(collections.eventLogs, payload.events ?? []);
  await writeCollection(collections.automationRules, payload.automationRules ?? []);
  await writeCollection(collections.notifications, payload.notifications ?? []);

  console.log(`Imported data from ${filePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
