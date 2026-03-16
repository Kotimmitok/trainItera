import { runMigrations } from "./migrations";
import { seedDatabase } from "./seed";

export async function initDatabase() {
    console.log("Initializing database");

    await runMigrations();
    await seedDatabase();

    console.log("Database ready");
}