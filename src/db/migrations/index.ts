import { getDb } from "../connection";
import { migration_01_init_exercises } from "./migration_01_init_exercises";

export async function runMigrations() {
    const db = await getDb();

    await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations(
      id INTEGER PRIMARY KEY
    )
  `);

    const applied = await db.query("SELECT id FROM migrations");
    const appliedIds = new Set(applied.values?.map(v => v.id) || []);

    const migrations = [
        { id: 1, sql: migration_01_init_exercises },
    ];

    for (const m of migrations) {
        if (!appliedIds.has(m.id)) {
            await db.execute(m.sql);
            await db.run("INSERT INTO migrations (id) VALUES (?)", [m.id]);
        }
    }
}