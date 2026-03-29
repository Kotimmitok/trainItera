import { WorkoutsTable, WorkoutExercisesTable, WorkoutSetsTable } from "../schema/workouts.schema";

export const migration_03_init_workouts = `
    ${WorkoutsTable}
    ${WorkoutExercisesTable}
    ${WorkoutSetsTable}
`;