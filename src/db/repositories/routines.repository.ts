import { getDb } from "../connection";
import { Routine, RoutineExercise, RoutineSet } from "../models/routine.model";

async function fetchRoutinesWithExercises(whereClause = '', params: any[] = []): Promise<Routine[]> {
    const db = await getDb();
    const result = await db.query(`
        SELECT
            r.id as r_id, r.name as r_name,
            re.id as re_id,
            e.id as e_id, e.name as e_name,
            mg.id as mg_id, mg.name as mg_name,
            rs.id as rs_id, rs.reps, rs.weight
        FROM routines r
        LEFT JOIN routine_exercises re ON r.id = re.routine_id
        LEFT JOIN exercises e ON re.exercise_id = e.id
        LEFT JOIN exercise_muscle_groups emg ON e.id = emg.exercise_id
        LEFT JOIN muscle_groups mg ON emg.muscle_group_id = mg.id
        LEFT JOIN routine_sets rs ON re.id = rs.routine_exercise_id
        ${whereClause}
        ORDER BY r.id, re.id, rs.id
    `, params);

    const rows = result.values ?? [];
    const routineMap = new Map<number, Routine>();
    const routineExerciseMap = new Map<number, RoutineExercise>();
    const mgIds = new Set<string>();
    const setIds = new Set<number>();

    for (const row of rows) {
        if (!routineMap.has(row.r_id)) {
            routineMap.set(row.r_id, { id: row.r_id, name: row.r_name, exercises: [] });
        }
        const routine = routineMap.get(row.r_id)!;

        if (!row.re_id) continue;

        if (!routineExerciseMap.has(row.re_id)) {
            const routineExercise: RoutineExercise = {
                id: row.re_id,
                exercise: { id: row.e_id, name: row.e_name, muscle_groups: [] },
                sets: []
            };
            routineExerciseMap.set(row.re_id, routineExercise);
            routine.exercises.push(routineExercise);
        }
        const re = routineExerciseMap.get(row.re_id)!;

        const mgKey = `${row.re_id}-${row.mg_id}`;
        if (row.mg_id && !mgIds.has(mgKey)) {
            mgIds.add(mgKey);
            re.exercise.muscle_groups.push({ id: row.mg_id, name: row.mg_name });
        }

        if (row.rs_id && !setIds.has(row.rs_id)) {
            setIds.add(row.rs_id);
            re.sets.push({ id: row.rs_id, reps: row.reps, weight: row.weight });
        }
    }

    return Array.from(routineMap.values());
}

export async function getRoutines(): Promise<Routine[]> {
    return fetchRoutinesWithExercises();
}

export async function getRoutineById(id: number): Promise<Routine | null> {
    const routines = await fetchRoutinesWithExercises(`WHERE r.id = ?`, [id]);
    return routines[0] ?? null;
}

export async function createRoutine(name: string): Promise<number> {
    const db = await getDb();
    await db.run(`INSERT INTO routines (name) VALUES (?)`, [name]);
    const result = await db.query(
        `SELECT id FROM routines WHERE name = ? ORDER BY id DESC LIMIT 1`,
        [name]
    );
    return result.values?.[0]?.id;
}

export async function deleteRoutine(id: number): Promise<void> {
    const db = await getDb();
    await db.run(`DELETE FROM routines WHERE id = ?`, [id]);
}

export async function renameRoutine(id: number, name: string): Promise<void> {
    const db = await getDb();
    await db.run(`UPDATE routines SET name = ? WHERE id = ?`, [name, id]);
}

export async function addExerciseToRoutine(
    routineId: number,
    exerciseId: number,
    sets: { reps: number; weight: number | null }[]
): Promise<void> {
    const db = await getDb();
    await db.run(
        `INSERT INTO routine_exercises (routine_id, exercise_id) VALUES (?, ?)`,
        [routineId, exerciseId]
    );
    const result = await db.query(
        `SELECT id FROM routine_exercises WHERE routine_id = ? AND exercise_id = ? ORDER BY id DESC LIMIT 1`,
        [routineId, exerciseId]
    );
    const reId = result.values?.[0]?.id;

    for (const set of sets) {
        await db.run(
            `INSERT INTO routine_sets (routine_exercise_id, reps, weight) VALUES (?, ?, ?)`,
            [reId, set.reps, set.weight]
        );
    }
}

export async function updateExerciseSets(
    routineExerciseId: number,
    sets: { reps: number; weight: number | null }[]
): Promise<void> {
    const db = await getDb();
    await db.run(`DELETE FROM routine_sets WHERE routine_exercise_id = ?`, [routineExerciseId]);
    for (const set of sets) {
        await db.run(
            `INSERT INTO routine_sets (routine_exercise_id, reps, weight) VALUES (?, ?, ?)`,
            [routineExerciseId, set.reps, set.weight]
        );
    }
}

export async function removeExerciseFromRoutine(id: number): Promise<void> {
    const db = await getDb();
    await db.run(`DELETE FROM routine_exercises WHERE id = ?`, [id]);
}