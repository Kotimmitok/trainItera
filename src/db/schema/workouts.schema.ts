export const WorkoutsTable = `
CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER REFERENCES routines(id) ON DELETE SET NULL,
  routine_name TEXT,
  started_at TEXT NOT NULL, 
  finished_at TEXT
);`;

export const WorkoutExercisesTable = `
CREATE TABLE IF NOT EXISTS workout_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE
);`;

export const WorkoutSetsTable = `
CREATE TABLE IF NOT EXISTS workout_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_exercise_id INTEGER REFERENCES workout_exercises(id) ON DELETE CASCADE,
  reps INTEGER NOT NULL,
  weight REAL,
  completed INTEGER NOT NULL DEFAULT 0
);`;