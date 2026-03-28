import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption,
    IonLabel, IonButton, IonModal, IonInput, IonButtons,
    IonBackButton, IonSearchbar, IonIcon, IonGrid, IonRow, IonCol,
    useIonViewWillEnter
} from '@ionic/react';
import { addOutline, checkmark, trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Routine } from '../db/models/routine.model';
import { Exercise } from '../db/models/exercise.model';
import { getRoutineById, addExerciseToRoutine, removeExerciseFromRoutine, renameRoutine, updateExerciseSets } from '../db/repositories/routines.repository';
import { getExercises } from '../db/repositories/exercises.repository';

interface SetInput {
    reps: string;
    weight: string;
}

interface ExerciseEditState {
    routineExerciseId: number | null;
    exercise: Exercise;
    sets: SetInput[];
}


const RoutineDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [search, setSearch] = useState('');

    const [editState, setEditState] = useState<ExerciseEditState | null>(null);

    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [newName, setNewName] = useState('');

    const load = async () => {
        try {
            setRoutine(await getRoutineById(Number(id)));
            setExercises(await getExercises());
        } catch (err) {
            console.error('load error:', err);
        }
    };

    const filteredExercises = exercises.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle_groups.some(mg => mg.name.toLowerCase().includes(search.toLowerCase()))
    );

    const openExerciseConfig = (exercise: Exercise, routineExerciseId: number | null, sets: SetInput[]) => {
        setEditState({ exercise, routineExerciseId, sets });
        setIsConfigOpen(true);
    };

    const handleSelectExercise = (exercise: Exercise) => {
        setIsPickerOpen(false);
        openExerciseConfig(exercise, null, [{ reps: '10', weight: '0' }]);
        setIsConfigOpen(true);
    };

    const handleAddSetRow = () => {
        // TODO smart proposal of next set values based on previous sets
        setEditState(prev => {
            if (!prev) return prev;
            const last = prev.sets[prev.sets.length - 1];
            return {
                ...prev,
                sets: [...prev.sets, { reps: last.reps, weight: last.weight }]
            };
        });
    };

    const handleRemoveSetRow = (index: number) => {
        setEditState(prev => {
            if (!prev) return prev;
            return { ...prev, sets: prev.sets.filter((_, i) => i !== index) };
        });
    };

    const handleSetInputChange = (index: number, field: 'reps' | 'weight', value: string) => {
        setEditState(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                sets: prev.sets.map((s, i) => i === index ? { ...s, [field]: value } : s)
            };
        });
    };

    const handleRename = async () => {
        if (!newName.trim()) return;
        await renameRoutine(Number(id), newName);
        setIsRenameOpen(false);
        await load();
    };

    const handleAdd = async () => {
        if (!editState) return;

        const sets = editState.sets.map(s => ({
            reps: Number(s.reps),
            weight: s.weight === '' ? null : Number(s.weight)
        }));

        if (editState.routineExerciseId) {
            await updateExerciseSets(editState.routineExerciseId, sets);
        } else {
            await addExerciseToRoutine(Number(id), editState.exercise.id, sets);
        }

        setEditState(null);
        setIsConfigOpen(false);
        await load();
    };

    const handleRemove = async (routineExerciseId: number) => {
        await removeExerciseFromRoutine(routineExerciseId);
        await load();
    };

    useIonViewWillEnter(() => { load(); });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/routines" />
                    </IonButtons>
                    <IonTitle
                        onClick={() => {
                            setNewName(routine?.name ?? '');
                            setIsRenameOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                    >{routine?.name ?? 'Routine'}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={() => setIsPickerOpen(true)} className="ion-margin">
                            <IonIcon slot="start" icon={addOutline} />
                            Add Exercise
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {routine?.exercises.map(re => (
                        <IonItemSliding key={re.id}>
                            <IonItem
                                onClick={() => openExerciseConfig(re.exercise, re.id, re.sets.map(s => ({
                                    reps: s.reps.toString(),
                                    weight: s.weight?.toString() ?? ''
                                })))}
                            >
                                <IonLabel>
                                    <h2>{re.exercise.name}</h2>
                                    <p>{re.exercise.muscle_groups.map(mg => mg.name).join(', ')}</p>
                                    {re.sets.map((s, i) => (
                                        <p key={s.id}>
                                            Set {i + 1}: {s.reps} reps{s.weight != null ? ` @ ${s.weight} kg` : ''}
                                        </p>
                                    ))}
                                </IonLabel>
                            </IonItem>
                            <IonItemOptions side="end">
                                <IonItemOption color="danger" onClick={() => handleRemove(re.id)}>
                                    Remove
                                </IonItemOption>
                            </IonItemOptions>
                        </IonItemSliding>
                    ))}
                </IonList>

                {/* Rename Routine Modal */}
                <IonModal isOpen={isRenameOpen} onDidDismiss={() => setIsRenameOpen(false)} breakpoints={[0, 0.3]} initialBreakpoint={0.3}>
                    <IonContent className="ion-padding">
                        <IonInput
                            label="Routine name"
                            labelPlacement="floating"
                            value={newName}
                            onIonInput={e => setNewName(e.detail.value!)}
                            clearInput={true}
                        />
                        <IonButton expand="full" onClick={handleRename} className="ion-margin-top">
                            Rename
                        </IonButton>
                    </IonContent>
                </IonModal>

                {/* Exercise Picker Modal */}
                <IonModal isOpen={isPickerOpen} onDidDismiss={() => { setIsPickerOpen(false); setSearch(''); }}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Select Exercise</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsPickerOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                        <IonToolbar>
                            <IonSearchbar
                                value={search}
                                onIonInput={e => setSearch(e.detail.value!)}
                                placeholder="Search by name or muscle group..."
                                debounce={0}
                            />
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonList>
                            {filteredExercises.map(exercise => (
                                <IonItem key={exercise.id} button onClick={() => handleSelectExercise(exercise)}>
                                    <IonLabel>
                                        <h2>{exercise.name}</h2>
                                        <p>{exercise.muscle_groups.map(mg => mg.name).join(', ')}</p>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonContent>
                </IonModal>

                {/* Sets Config Modal */}
                <IonModal isOpen={isConfigOpen} onDidDismiss={() => setIsConfigOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{editState?.exercise?.name}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton color="primary" onClick={handleAdd} className="ion-margin-top">
                                    <IonIcon slot="start" icon={checkmark} />
                                    {editState?.routineExerciseId ? 'Update Sets' : 'Add to Routine'}
                                </IonButton>
                                <IonButton onClick={() => setIsConfigOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="1"><strong>#</strong></IonCol>
                                <IonCol><strong>Reps</strong></IonCol>
                                <IonCol><strong>Weight (kg)</strong></IonCol>
                                <IonCol size="1"></IonCol>
                            </IonRow>
                            {editState?.sets.map((s, i) => (
                                <IonRow key={i}>
                                    <IonCol size="1" style={{ display: 'flex', alignItems: 'center' }}>
                                        {i + 1}
                                    </IonCol>
                                    <IonCol>
                                        <IonInput
                                            type="number"
                                            value={s.reps}
                                            onIonInput={e => handleSetInputChange(i, 'reps', e.detail.value!)}
                                        />
                                    </IonCol>
                                    <IonCol>
                                        <IonInput
                                            type="number"
                                            value={s.weight}
                                            placeholder="optional"
                                            onIonInput={e => handleSetInputChange(i, 'weight', e.detail.value!)}
                                        />
                                    </IonCol>
                                    <IonCol size="1" style={{ display: 'flex', alignItems: 'center' }}>
                                        {editState?.sets.length > 1 && (
                                            <IonIcon
                                                icon={trashOutline}
                                                color="danger"
                                                onClick={() => handleRemoveSetRow(i)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        )}
                                    </IonCol>
                                </IonRow>
                            ))}
                        </IonGrid>

                        <IonButton expand="full" fill="outline" onClick={handleAddSetRow} className="ion-margin-top">
                            <IonIcon slot="start" icon={addOutline} />
                            Add Set
                        </IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default RoutineDetail;