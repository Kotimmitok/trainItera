import { Exercise } from "./exercise.model";

export interface RoutineSet {
    id: number;
    reps: number;
    weight: number | null;
}

export interface RoutineExercise {
    id: number;
    exercise: Exercise;
    sets: RoutineSet[];
}

export interface Routine {
    id: number;
    name: string;
    exercises: RoutineExercise[];
}