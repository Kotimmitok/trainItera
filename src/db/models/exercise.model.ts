export interface MuscleGroup {
    id: number;
    name: string;
}

export interface Exercise {
    id: number;
    name: string;
    muscle_groups: MuscleGroup[];
}