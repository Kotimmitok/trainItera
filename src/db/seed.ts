import { getDb } from "./connection";
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

const MUSCLE_GROUPS = [
    'Chest',
    'Upper Back',
    'Lats',
    'Lower Back',
    'Shoulders',
    'Traps',
    'Biceps',
    'Triceps',
    'Forearms',
    'Core',
    'Abductors',
    'Adductors',
    'Hip Flexors',
    'Quads',
    'Hamstrings',
    'Glutes',
    'Calves',
];

const EXERCISES: { name: string; muscle_groups: string[] }[] = [
    // Gym 
    { name: 'Bench Press', muscle_groups: ['Chest', 'Triceps', 'Shoulders'] },
    { name: 'Incline Bench Press', muscle_groups: ['Chest', 'Shoulders', 'Triceps'] },
    { name: 'Deadlift', muscle_groups: ['Back', 'Glutes', 'Hamstrings', 'Forearms'] },
    { name: 'Squat', muscle_groups: ['Quads', 'Glutes', 'Hamstrings'] },
    { name: 'Overhead Press', muscle_groups: ['Shoulders', 'Triceps'] },
    { name: 'Barbell Row', muscle_groups: ['Back', 'Biceps', 'Forearms'] },
    { name: 'Lat Pulldown', muscle_groups: ['Back', 'Biceps'] },
    { name: 'Leg Press', muscle_groups: ['Quads', 'Glutes', 'Hamstrings'] },
    { name: 'Leg Curl', muscle_groups: ['Hamstrings'] },
    { name: 'Leg Extension', muscle_groups: ['Quads'] },
    { name: 'Cable Fly', muscle_groups: ['Chest'] },
    { name: 'Tricep Pushdown', muscle_groups: ['Triceps'] },
    { name: 'Bicep Curl', muscle_groups: ['Biceps', 'Forearms'] },
    { name: 'Hammer Curl', muscle_groups: ['Biceps', 'Forearms'] },
    { name: 'Lateral Raise', muscle_groups: ['Shoulders'] },
    { name: 'Face Pull', muscle_groups: ['Shoulders', 'Back'] },
    { name: 'Calf Raise', muscle_groups: ['Calves'] },
    { name: 'Hip Thrust', muscle_groups: ['Glutes', 'Hamstrings'] },
    { name: 'Romanian Deadlift', muscle_groups: ['Hamstrings', 'Glutes', 'Back'] },

    // Bodyweight 
    { name: 'Push-Up', muscle_groups: ['Chest', 'Triceps', 'Shoulders'] },
    { name: 'Pull-Up', muscle_groups: ['Back', 'Biceps'] },
    { name: 'Chin-Up', muscle_groups: ['Back', 'Biceps'] },
    { name: 'Dip', muscle_groups: ['Triceps', 'Chest', 'Shoulders'] },
    { name: 'Bodyweight Squat', muscle_groups: ['Quads', 'Glutes', 'Hamstrings'] },
    { name: 'Lunge', muscle_groups: ['Quads', 'Glutes', 'Hamstrings'] },
    { name: 'Plank', muscle_groups: ['Core'] },
    { name: 'Hollow Body Hold', muscle_groups: ['Core'] },
    { name: 'Leg Raise', muscle_groups: ['Core'] },
    { name: 'Mountain Climber', muscle_groups: ['Core', 'Shoulders'] },
    { name: 'Burpee', muscle_groups: ['Core', 'Chest', 'Quads', 'Shoulders'] },
    { name: 'Pike Push-Up', muscle_groups: ['Shoulders', 'Triceps'] },
    { name: 'Glute Bridge', muscle_groups: ['Glutes', 'Hamstrings'] },

    // Cardio
    { name: 'Running', muscle_groups: ['Quads', 'Hamstrings', 'Calves'] },
    { name: 'Cycling', muscle_groups: ['Quads', 'Hamstrings', 'Calves'] },
    { name: 'Rowing Machine', muscle_groups: ['Back', 'Core', 'Quads', 'Hamstrings'] },
    { name: 'Jump Rope', muscle_groups: ['Calves', 'Shoulders', 'Core'] },
    { name: 'Elliptical', muscle_groups: ['Quads', 'Hamstrings', 'Glutes'] },
    { name: 'Stair Climber', muscle_groups: ['Quads', 'Glutes', 'Calves'] },
];

const ROUTINE_SEEDS = [
    {
        name: 'Push',
        exercises: [
            { name: 'Bench Press', sets: [{ reps: 8, weight: 80 }, { reps: 8, weight: 80 }, { reps: 8, weight: 80 }] },
            { name: 'Incline Bench Press', sets: [{ reps: 10, weight: 60 }, { reps: 10, weight: 60 }, { reps: 10, weight: 60 }] },
            { name: 'Overhead Press', sets: [{ reps: 8, weight: 50 }, { reps: 8, weight: 50 }, { reps: 8, weight: 50 }] },
            { name: 'Lateral Raise', sets: [{ reps: 12, weight: 12 }, { reps: 12, weight: 12 }, { reps: 12, weight: 12 }] },
            { name: 'Tricep Pushdown', sets: [{ reps: 12, weight: 30 }, { reps: 12, weight: 30 }, { reps: 12, weight: 30 }] },
        ]
    },
    {
        name: 'Pull',
        exercises: [
            { name: 'Deadlift', sets: [{ reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }] },
            { name: 'Barbell Row', sets: [{ reps: 8, weight: 70 }, { reps: 8, weight: 70 }, { reps: 8, weight: 70 }] },
            { name: 'Lat Pulldown', sets: [{ reps: 10, weight: 60 }, { reps: 10, weight: 60 }, { reps: 10, weight: 60 }] },
            { name: 'Bicep Curl', sets: [{ reps: 12, weight: 15 }, { reps: 12, weight: 15 }, { reps: 12, weight: 15 }] },
            { name: 'Face Pull', sets: [{ reps: 15, weight: 20 }, { reps: 15, weight: 20 }, { reps: 15, weight: 20 }] },
        ]
    },
    {
        name: 'Legs',
        exercises: [
            { name: 'Squat', sets: [{ reps: 8, weight: 90 }, { reps: 8, weight: 90 }, { reps: 8, weight: 90 }] },
            { name: 'Romanian Deadlift', sets: [{ reps: 10, weight: 70 }, { reps: 10, weight: 70 }, { reps: 10, weight: 70 }] },
            { name: 'Leg Press', sets: [{ reps: 12, weight: 120 }, { reps: 12, weight: 120 }, { reps: 12, weight: 120 }] },
            { name: 'Leg Curl', sets: [{ reps: 12, weight: 40 }, { reps: 12, weight: 40 }, { reps: 12, weight: 40 }] },
            { name: 'Calf Raise', sets: [{ reps: 15, weight: 50 }, { reps: 15, weight: 50 }, { reps: 15, weight: 50 }] },
        ]
    }
];

async function seedRoutines(db: SQLiteDBConnection): Promise<void> {
    const exResult = await db.query(`SELECT id, name FROM exercises`);
    const exMap = new Map<string, number>(
        (exResult.values ?? []).map(row => [row.name, row.id])
    );

    for (const routine of ROUTINE_SEEDS) {
        const existing = await db.query(
            `SELECT id FROM routines WHERE name = ?`, [routine.name]
        );
        if (existing.values && existing.values.length > 0) continue;

        await db.run(`INSERT INTO routines (name) VALUES (?)`, [routine.name]);
        const rResult = await db.query(
            `SELECT id FROM routines WHERE name = ? ORDER BY id DESC LIMIT 1`, [routine.name]
        );
        const routineId = rResult.values?.[0]?.id;

        for (const exercise of routine.exercises) {
            const exerciseId = exMap.get(exercise.name);
            if (!exerciseId) continue;

            await db.run(
                `INSERT INTO routine_exercises (routine_id, exercise_id) VALUES (?, ?)`,
                [routineId, exerciseId]
            );
            const reResult = await db.query(
                `SELECT id FROM routine_exercises ORDER BY id DESC LIMIT 1`
            );
            const reId = reResult.values?.[0]?.id;

            for (const set of exercise.sets) {
                await db.run(
                    `INSERT INTO routine_sets (routine_exercise_id, reps, weight) VALUES (?, ?, ?)`,
                    [reId, set.reps, set.weight]
                );
            }
        }
    }
}

export async function seedDatabase(): Promise<void> {
    const db = await getDb();

    for (const name of MUSCLE_GROUPS) {
        await db.run(
            `INSERT OR IGNORE INTO muscle_groups (name) VALUES (?)`,
            [name]
        );
    }

    const mgResult = await db.query(`SELECT id, name FROM muscle_groups`);
    const mgMap = new Map<string, number>(
        (mgResult.values ?? []).map(row => [row.name, row.id])
    );

    for (const exercise of EXERCISES) {
        const existing = await db.query(
            `SELECT id FROM exercises WHERE name = ?`,
            [exercise.name]
        );
        if (existing.values && existing.values.length > 0) continue;

        await db.run(`INSERT INTO exercises (name) VALUES (?)`, [exercise.name]);
        const result = await db.query(
            `SELECT id FROM exercises WHERE name = ? ORDER BY id DESC LIMIT 1`,
            [exercise.name]
        );
        const exerciseId = result.values?.[0]?.id;

        for (const mgName of exercise.muscle_groups) {
            const mgId = mgMap.get(mgName);
            if (mgId) {
                await db.run(
                    `INSERT OR IGNORE INTO exercise_muscle_groups (exercise_id, muscle_group_id) VALUES (?, ?)`,
                    [exerciseId, mgId]
                );
            }
        }
    }

    await seedRoutines(db);
}