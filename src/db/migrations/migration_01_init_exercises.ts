import { ExercisesTable, MuscleGroupsTable, ExerciseMuscleGroupsTable } from "../schema/exercises.schema";

export const migration_01_init_exercises = `
    ${MuscleGroupsTable}
    ${ExercisesTable}
    ${ExerciseMuscleGroupsTable}
`;