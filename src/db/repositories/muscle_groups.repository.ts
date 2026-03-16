import { getDb } from "../connection";
import { MuscleGroup } from "../models/exercise.model";

export async function getMuscleGroups(): Promise<MuscleGroup[]> {
    const db = await getDb();
    const result = await db.query(`SELECT * FROM muscle_groups ORDER BY name`);
    return result.values ?? [];
}