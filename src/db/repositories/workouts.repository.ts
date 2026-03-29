import { getDb } from "../connection";
import { Workout, WorkoutExercise, WorkoutSet } from "../models/workout.model";
import { Routine } from "../models/routine.model";

async function fetchWorkoutsWithExercises(whereClause = '', params: any[] = [], orderBy = 'w.id'): Promise<Workout[]> {
    const db = await getDb();
    const result = await db.query(`
        SELECT
            w.id as w_id, w.routine_id, w.routine_name, w.started_at, w.finished_at,
            we.id as we_id,
            e.id as e_id, e.name as e_name,
            mg.id as mg_id, mg.name as mg_name,
            ws.id as ws_id, ws.reps, ws.weight, ws.completed
        FROM workouts w
        LEFT JOIN workout_exercises we ON w.id = we.workout_id
        LEFT JOIN exercises e ON we.exercise_id = e.id
        LEFT JOIN exercise_muscle_groups emg ON e.id = emg.exercise_id
        LEFT JOIN muscle_groups mg ON emg.muscle_group_id = mg.id
        LEFT JOIN workout_sets ws ON we.id = ws.workout_exercise_id
        ${whereClause}
        ORDER BY ${orderBy}, we.id, ws.id
    `, params);

    const rows = result.values ?? [];
    const workoutMap = new Map<number, Workout>();
    const workoutExerciseMap = new Map<number, WorkoutExercise>();
    const mgIds = new Set<string>();
    const setIds = new Set<number>();

    for (const row of rows) {
        if (!workoutMap.has(row.w_id)) {
            workoutMap.set(row.w_id, {
                id: row.w_id,
                routine_id: row.routine_id,
                routine_name: row.routine_name,
                started_at: row.started_at,
                finished_at: row.finished_at,
                exercises: []
            });
        }
        const workout = workoutMap.get(row.w_id)!;

        if (!row.we_id) continue;

        if (!workoutExerciseMap.has(row.we_id)) {
            const we: WorkoutExercise = {
                id: row.we_id,
                exercise: { id: row.e_id, name: row.e_name, muscle_groups: [] },
                sets: []
            };
            workoutExerciseMap.set(row.we_id, we);
            workout.exercises.push(we);
        }
        const we = workoutExerciseMap.get(row.we_id)!;

        const mgKey = `${row.we_id}-${row.mg_id}`;
        if (row.mg_id && !mgIds.has(mgKey)) {
            mgIds.add(mgKey);
            we.exercise.muscle_groups.push({ id: row.mg_id, name: row.mg_name });
        }

        if (row.ws_id && !setIds.has(row.ws_id)) {
            setIds.add(row.ws_id);
            we.sets.push({
                id: row.ws_id,
                reps: row.reps,
                weight: row.weight,
                completed: row.completed === 1
            });
        }
    }

    return Array.from(workoutMap.values());
}

export async function getWorkouts(): Promise<Workout[]> {
    return fetchWorkoutsWithExercises('', [], 'w.id DESC');
}

export async function getWorkoutById(id: number): Promise<Workout | null> {
    const workouts = await fetchWorkoutsWithExercises(`WHERE w.id = ?`, [id]);
    return workouts[0] ?? null;
}

// copy all exercises and sets from routine to workout
export async function createWorkoutFromRoutine(routine: Routine): Promise<number> {
    const db = await getDb();
    await db.run(
        `INSERT INTO workouts (routine_id, routine_name, started_at) VALUES (?, ?, ?)`,
        [routine.id, routine.name, new Date().toISOString()]
    );
    const result = await db.query(
        `SELECT id FROM workouts ORDER BY id DESC LIMIT 1`
    );
    const workoutId = result.values?.[0]?.id;

    for (const re of routine.exercises) {
        await db.run(
            `INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?)`,
            [workoutId, re.exercise.id]
        );
        const weResult = await db.query(
            `SELECT id FROM workout_exercises ORDER BY id DESC LIMIT 1`
        );
        const weId = weResult.values?.[0]?.id;

        for (const set of re.sets) {
            await db.run(
                `INSERT INTO workout_sets (workout_exercise_id, reps, weight, completed) VALUES (?, ?, ?, 0)`,
                [weId, set.reps, set.weight]
            );
        }
    }

    return workoutId;
}

export async function completeWorkout(id: number): Promise<void> {
    const db = await getDb();
    await db.run(
        `UPDATE workouts SET finished_at = ? WHERE id = ?`,
        [new Date().toISOString(), id]
    );
}

export async function deleteWorkout(id: number): Promise<void> {
    const db = await getDb();
    await db.run(`DELETE FROM workouts WHERE id = ?`, [id]);
}

export async function toggleSetCompleted(id: number, completed: boolean): Promise<void> {
    const db = await getDb();
    await db.run(
        `UPDATE workout_sets SET completed = ? WHERE id = ?`,
        [completed ? 1 : 0, id]
    );
}

export async function updateWorkoutSet(id: number, reps: number, weight: number | null): Promise<void> {
    const db = await getDb();
    await db.run(
        `UPDATE workout_sets SET reps = ?, weight = ? WHERE id = ?`,
        [reps, weight, id]
    );
}

export async function addSetToWorkoutExercise(
    workoutExerciseId: number,
    reps: number,
    weight: number | null
): Promise<void> {
    const db = await getDb();
    await db.run(
        `INSERT INTO workout_sets (workout_exercise_id, reps, weight, completed) VALUES (?, ?, ?, 0)`,
        [workoutExerciseId, reps, weight]
    );
}

export async function addExerciseToWorkout(
    workoutId: number,
    exerciseId: number
): Promise<number> {
    const db = await getDb();
    await db.run(
        `INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?)`,
        [workoutId, exerciseId]
    );
    const result = await db.query(
        `SELECT id FROM workout_exercises ORDER BY id DESC LIMIT 1`
    );
    return result.values?.[0]?.id;
}

export async function removeSetFromWorkout(id: number): Promise<void> {
    const db = await getDb();
    await db.run(`DELETE FROM workout_sets WHERE id = ?`, [id]);
}

export async function removeExerciseFromWorkout(id: number): Promise<void> {
    const db = await getDb();
    await db.run(`DELETE FROM workout_exercises WHERE id = ?`, [id]);
}