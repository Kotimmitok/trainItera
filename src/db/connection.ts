import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";

const sqlite = new SQLiteConnection(CapacitorSQLite);

let db: SQLiteDBConnection | null = null;

export async function getDb(): Promise<SQLiteDBConnection> {
    if (db) return db;

    db = await sqlite.createConnection(
        "fitness_db",
        false,
        "no-encryption",
        1,
        false
    );

    await db.open();

    return db;
}