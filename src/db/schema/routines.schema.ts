export const RoutinesTable = `
CREATE TABLE IF NOT EXISTS routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);`;

export const RoutineExercisesTable = `
CREATE TABLE IF NOT EXISTS routine_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER REFERENCES routines(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE
);`;

export const RoutineSetsTable = `
CREATE TABLE IF NOT EXISTS routine_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_exercise_id INTEGER REFERENCES routine_exercises(id) ON DELETE CASCADE,
  reps INTEGER NOT NULL DEFAULT 10,
  weight REAL DEFAULT NULL
);`;