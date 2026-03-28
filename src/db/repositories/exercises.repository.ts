import { getDb } from "../connection";
import { Exercise } from "../models/exercise.model";

async function fetchExercisesWithMuscleGroups(whereClause = '', params: any[] = []): Promise<Exercise[]> {
    const db = await getDb();
    const result = await db.query(`
        SELECT 
            e.id, e.name,
            mg.id as mg_id, mg.name as mg_name
        FROM exercises e
        LEFT JOIN exercise_muscle_groups emg ON e.id = emg.exercise_id
        LEFT JOIN muscle_groups mg ON emg.muscle_group_id = mg.id
        ${whereClause}
        ORDER BY e.id
    `, params);

    const rows = result.values ?? [];
    const map = new Map<number, Exercise>();

    for (const row of rows) {
        if (!map.has(row.id)) {
            map.set(row.id, { id: row.id, name: row.name, muscle_groups: [] });
        }
        if (row.mg_id) {
            map.get(row.id)!.muscle_groups.push({ id: row.mg_id, name: row.mg_name });
        }
    }
    return Array.from(map.values());
}

export async function getExercises(): Promise<Exercise[]> {
    return fetchExercisesWithMuscleGroups();
}

export async function getExercisesByMuscleGroup(muscleGroupId: number): Promise<Exercise[]> {
    return fetchExercisesWithMuscleGroups(
        `WHERE e.id IN (SELECT exercise_id FROM exercise_muscle_groups WHERE muscle_group_id = ?)`,
        [muscleGroupId]
    );
}

export async function createExercise(name: string, muscleGroupIds: number[]): Promise<void> {
    const db = await getDb();
    await db.run(`INSERT INTO exercises (name) VALUES (?)`, [name]);
    const result = await db.query(
        `SELECT id FROM exercises WHERE name = ? ORDER BY id DESC LIMIT 1`,
        [name]
    );
    const exerciseId = result.values?.[0]?.id;

    for (const mgId of muscleGroupIds) {
        await db.run(
            `INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id) VALUES (?, ?)`,
            [exerciseId, mgId]
        );
    }
}

export async function deleteExercise(id: number): Promise<void> {
    const db = await getDb();
    await db.run(`DELETE FROM exercises WHERE id = ?`, [id]);
}

export async function updateExercise(id: number, name: string, muscleGroupIds: number[]): Promise<void> {
    const db = await getDb();
    await db.run(`UPDATE exercises SET name = ? WHERE id = ?`, [name, id]);
    await db.run(`DELETE FROM exercise_muscle_groups WHERE exercise_id = ?`, [id]);
    for (const mgId of muscleGroupIds) {
        await db.run(
            `INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id) VALUES (?, ?)`,
            [id, mgId]
        );
    }
}