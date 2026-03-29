import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonButtons,
    IonBackButton, IonCheckbox, IonIcon, IonModal,
    IonBadge, IonSearchbar,
    IonItemSliding, IonItemOptions, IonItemOption,
    useIonViewWillEnter
} from '@ionic/react';
import { checkmarkCircle, timeOutline, addOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Workout } from '../db/models/workout.model';
import { Exercise } from '../db/models/exercise.model';
import {
    getWorkoutById, toggleSetCompleted, updateWorkoutSet,
    completeWorkout, addSetToWorkoutExercise, addExerciseToWorkout,
    removeSetFromWorkout, removeExerciseFromWorkout
} from '../db/repositories/workouts.repository';
import { getExercises } from '../db/repositories/exercises.repository';
import { useTimer } from '../hooks/useTimer';
import ExercisePicker from '../components/ExercisePicker';

const WorkoutDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [search, setSearch] = useState('');
    const history = useHistory();

    const isFinished = !!workout?.finished_at;

    const load = async () => {
        const w = await getWorkoutById(Number(id));
        setWorkout(w);
        return w;
    };

    const { formattedTime } = useTimer(
        workout?.started_at ?? null,
        workout?.finished_at ?? null
    );

    const handleToggleSet = async (setId: number, completed: boolean) => {
        await toggleSetCompleted(setId, !completed);
        await load();
    };

    const handleAddSet = async (workoutExerciseId: number, lastSet?: { reps: number; weight: number | null }) => {
        await addSetToWorkoutExercise(
            workoutExerciseId,
            lastSet?.reps ?? 10,
            lastSet?.weight ?? null
        );
        await load();
    };

    const handleRemoveSet = async (setId: number) => {
        await removeSetFromWorkout(setId);
        await load();
    };

    const handleRemoveExercise = async (workoutExerciseId: number) => {
        await removeExerciseFromWorkout(workoutExerciseId);
        await load();
    };

    const handleOpenExercisePicker = async () => {
        setExercises(await getExercises());
        setSearch('');
        setIsPickerOpen(true);
    };

    const handleAddExercise = async (exercise: Exercise) => {
        await addExerciseToWorkout(Number(id), exercise.id);
        setIsPickerOpen(false);
        await load();
    };

    const handleComplete = async () => {
        await completeWorkout(Number(id));
        history.push('/workouts');
    };

    const filteredExercises = exercises.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle_groups.some(mg => mg.name.toLowerCase().includes(search.toLowerCase()))
    );

    const completedSets = workout?.exercises.flatMap(e => e.sets).filter(s => s.completed).length ?? 0;
    const totalSets = workout?.exercises.flatMap(e => e.sets).length ?? 0;
    const startedExercises = workout?.exercises.filter(e => e.sets.some(s => s.completed)).length ?? 0;
    const totalExercises = workout?.exercises.length ?? 0;

    useIonViewWillEnter(() => { load(); });


    const inputStyle: React.CSSProperties = {
        width: '100%',
        textAlign: 'center',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--ion-color-medium)',
        color: 'var(--ion-text-color)',
        fontSize: '1rem',
        padding: '4px',
        outline: 'none',
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/workouts" />
                    </IonButtons>
                    <IonTitle>{workout?.routine_name ?? 'Workout'}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={handleOpenExercisePicker}>
                            <IonIcon slot="start" icon={addOutline} />
                            Add Exercise
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* Timer + Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonIcon icon={timeOutline} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formattedTime}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <IonBadge color={completedSets === totalSets && totalSets > 0 ? 'success' : 'medium'}>
                            {completedSets} / {totalSets} sets
                        </IonBadge>

                        <IonBadge color={startedExercises === totalExercises && totalExercises > 0 ? 'success' : 'medium'}>
                            {startedExercises} / {totalExercises} exercises
                        </IonBadge>
                    </div>
                </div>

                <IonList>
                    {workout?.exercises.map(we => (
                        <div key={we.id} style={{ marginBottom: '16px' }}>
                            <IonItemSliding>
                                <IonItem>
                                    <IonLabel>
                                        <h2>{we.exercise.name}</h2>
                                        <p>{we.exercise.muscle_groups.map(mg => mg.name).join(', ')}</p>
                                    </IonLabel>
                                </IonItem>
                                <IonItemOptions side="end">
                                    <IonItemOption color="danger" onClick={() => handleRemoveExercise(we.id)}>
                                        Remove
                                    </IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>

                            <table style={{ width: '100%', borderCollapse: 'collapse', padding: '0 16px' }}>
                                <thead>
                                    <tr style={{ color: 'var(--ion-color-medium)', fontSize: '0.8rem' }}>
                                        <th style={{ padding: '4px 8px', textAlign: 'center', width: '40px' }}>✓</th>
                                        <th style={{ padding: '4px 8px', textAlign: 'center', width: '40px' }}>#</th>
                                        <th style={{ padding: '4px 8px', textAlign: 'center' }}>Reps</th>
                                        <th style={{ padding: '4px 8px', textAlign: 'center' }}>kg</th>
                                        <th style={{ width: '40px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {we.sets.map((set, i) => (
                                        <tr
                                            key={set.id}
                                            style={{ background: set.completed ? 'var(--ion-color-success-tint)' : 'transparent' }}
                                        >
                                            <td style={{ textAlign: 'center', padding: '4px' }}>
                                                <IonCheckbox
                                                    checked={set.completed}
                                                    onIonChange={() => handleToggleSet(set.id, set.completed)}
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center', padding: '4px', color: 'var(--ion-color-medium)' }}>
                                                {i + 1}
                                            </td>
                                            <td style={{ padding: '4px' }}>
                                                <input
                                                    type="number"
                                                    defaultValue={set.reps}
                                                    onBlur={async e => {
                                                        await updateWorkoutSet(set.id, Number(e.target.value), set.weight);
                                                        await load();
                                                    }}
                                                    style={inputStyle}
                                                />
                                            </td>
                                            <td style={{ padding: '4px' }}>
                                                <input
                                                    type="number"
                                                    defaultValue={set.weight ?? ''}
                                                    placeholder="-"
                                                    onBlur={async e => {
                                                        await updateWorkoutSet(set.id, set.reps, e.target.value === '' ? null : Number(e.target.value));
                                                        await load();
                                                    }}
                                                    style={inputStyle}
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center', padding: '4px' }}>
                                                <span
                                                    onClick={() => handleRemoveSet(set.id)}
                                                    style={{ color: 'var(--ion-color-danger)', cursor: 'pointer', fontSize: '1.2rem' }}
                                                >
                                                    ✕
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <IonItem
                                button
                                onClick={() => handleAddSet(we.id, we.sets[we.sets.length - 1])}
                                style={{ '--background': 'transparent' }}
                            >
                                <IonIcon slot="start" icon={addOutline} color="primary" />
                                <IonLabel color="primary">Add Set</IonLabel>
                            </IonItem>
                        </div>
                    ))}
                </IonList>

                {!isFinished && (
                    <IonButton expand="full" color="success" className="ion-margin" onClick={handleComplete}>
                        Complete Workout
                    </IonButton>
                )}

                {isFinished && (
                    <div style={{ textAlign: 'center', padding: '16px', color: 'var(--ion-color-success)' }}>
                        <IonIcon icon={checkmarkCircle} style={{ fontSize: '2rem' }} />
                        <p>Workout completed</p>
                    </div>
                )}

                {/* Exercise Picker Modal */}
                <IonModal isOpen={isPickerOpen} onDidDismiss={() => { setIsPickerOpen(false); }}>
                    <ExercisePicker
                        exercises={exercises}
                        onSelect={handleAddExercise}
                        onDismiss={() => setIsPickerOpen(false)}
                        onExercisesChanged={async () => setExercises(await getExercises())}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default WorkoutDetail;