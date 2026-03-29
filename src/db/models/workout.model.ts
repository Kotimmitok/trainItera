import { Exercise } from "./exercise.model";

export interface WorkoutSet {
    id: number;
    reps: number;
    weight: number | null;
    completed: boolean;
}

export interface WorkoutExercise {
    id: number;
    exercise: Exercise;
    sets: WorkoutSet[];
}

export interface Workout {
    id: number;
    routine_id: number | null;
    routine_name: string | null;
    started_at: string;
    finished_at: string | null;
    exercises: WorkoutExercise[];
}