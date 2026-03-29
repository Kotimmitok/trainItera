import { getDb } from "../connection";
import { migration_01_init_exercises } from "./migration_01_init_exercises";
import { migration_02_init_routines } from "./migration_02_init_routines";
import { migration_03_init_workouts } from "./migration_03_init_workouts";

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
        { id: 2, sql: migration_02_init_routines },
        { id: 3, sql: migration_03_init_workouts },
    ];

    for (const m of migrations) {
        if (!appliedIds.has(m.id)) {
            await db.execute(m.sql);
            await db.run("INSERT INTO migrations (id) VALUES (?)", [m.id]);
        }
    }
}