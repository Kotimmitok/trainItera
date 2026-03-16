export const MuscleGroupsTable = `
CREATE TABLE IF NOT EXISTS muscle_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);`;

export const ExercisesTable = `
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);`;

export const ExerciseMuscleGroupsTable = `
CREATE TABLE IF NOT EXISTS exercise_muscle_groups (
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_group_id INTEGER REFERENCES muscle_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, muscle_group_id)
);`;