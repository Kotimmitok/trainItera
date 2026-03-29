import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption,
    IonLabel, IonButton, IonModal, IonButtons, IonIcon,
    useIonViewWillEnter,
    IonNote
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Workout } from '../db/models/workout.model';
import { Routine } from '../db/models/routine.model';
import { getWorkouts, createWorkoutFromRoutine, deleteWorkout } from '../db/repositories/workouts.repository';
import { getRoutines } from '../db/repositories/routines.repository';
import WorkoutTimer from '../components/WorkoutTimer';

const Workouts: React.FC = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const history = useHistory();

    const load = async () => {
        setWorkouts(await getWorkouts());
        setRoutines(await getRoutines());
    };

    const handleStartWorkout = async (routine: Routine) => {
        const workoutId = await createWorkoutFromRoutine(routine);
        setIsPickerOpen(false);
        history.push(`/workouts/${workoutId}`);
    };

    const handleDelete = async (id: number) => {
        await deleteWorkout(id);
        await load();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDuration = (started: string, finished: string | null) => {
        if (!finished) return 'In progress';
        const diff = new Date(finished).getTime() - new Date(started).getTime();
        const mins = Math.ceil(diff / 60000);
        return `${mins} min`;
    };

    const daysAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    useIonViewWillEnter(() => { load(); });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Workouts</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={() => setIsPickerOpen(true)}>
                            <IonIcon slot="start" icon={addOutline} />
                            Start new Workout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {workouts.map(workout => (
                        <IonItemSliding key={workout.id}>
                            <IonItem button onClick={() => history.push(`/workouts/${workout.id}`)}>
                                <IonLabel>
                                    <h2>{workout.routine_name ?? 'Custom Workout'}</h2>
                                    <p>{formatDate(workout.started_at)}</p>
                                    <p>{formatDuration(workout.started_at, workout.finished_at)}</p>
                                    {!workout.finished_at && <p><WorkoutTimer startedAt={workout.started_at} finishedAt={workout.finished_at} /></p>}
                                </IonLabel>
                                <IonNote slot="end" style={{ alignSelf: 'center' }}>
                                    {daysAgo(workout.started_at)}
                                </IonNote>
                            </IonItem>
                            <IonItemOptions side="end">
                                <IonItemOption color="danger" onClick={() => handleDelete(workout.id)}>
                                    Delete
                                </IonItemOption>
                            </IonItemOptions>
                        </IonItemSliding>
                    ))}
                </IonList>

                {/* Routine Picker Modal */}
                <IonModal isOpen={isPickerOpen} onDidDismiss={() => setIsPickerOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Select Routine</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsPickerOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonList>
                            {routines.map(routine => (
                                <IonItem key={routine.id} button onClick={() => handleStartWorkout(routine)}>
                                    <IonLabel>
                                        <h2>{routine.name}</h2>
                                        <p>{routine.exercises.length} exercises</p>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Workouts;