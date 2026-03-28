import { RoutinesTable, RoutineExercisesTable, RoutineSetsTable } from "../schema/routines.schema";

export const migration_02_init_routines = `
    ${RoutinesTable}
    ${RoutineExercisesTable}
    ${RoutineSetsTable}
`;