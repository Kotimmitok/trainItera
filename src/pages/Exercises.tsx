import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItemSliding, IonItem, IonItemOptions, IonLabel,
    IonItemOption, IonButton, IonModal, IonInput, IonButtons,
    IonCheckbox, useIonViewWillEnter,
    IonIcon,
    IonToast
} from '@ionic/react';
import { useState } from 'react';
import { Exercise, MuscleGroup } from '../db/models/exercise.model';
import { createExercise, deleteExercise, getExercises, updateExercise } from '../db/repositories/exercises.repository';
import { getMuscleGroups } from '../db/repositories/muscle_groups.repository';
import { addOutline, checkmark } from 'ionicons/icons';

interface ExerciseEditState {
    id: number | null;
    name: string;
    muscleGroupIds: number[];
}

const Exercises: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editState, setEditState] = useState<ExerciseEditState>({ id: null, name: '', muscleGroupIds: [] });
    const [showToast, setShowToast] = useState(false);

    const load = async () => {
        setExercises(await getExercises());
        setMuscleGroups(await getMuscleGroups());
    };

    const openNew = () => {
        setEditState({ id: null, name: '', muscleGroupIds: [] });
        setIsOpen(true);
    };

    const openEdit = (exercise: Exercise) => {
        setEditState({
            id: exercise.id,
            name: exercise.name,
            muscleGroupIds: exercise.muscle_groups.map(mg => mg.id)
        });
        setIsOpen(true);
    };

    const toggleMuscleGroup = (id: number) => {
        setEditState(prev => ({
            ...prev,
            muscleGroupIds: prev.muscleGroupIds.includes(id)
                ? prev.muscleGroupIds.filter(x => x !== id)
                : [...prev.muscleGroupIds, id]
        }));
    };

    const handleSave = async () => {
        if (!editState.name.trim()) {
            setShowToast(true);
            return;
        }
        if (editState.id) {
            await updateExercise(editState.id, editState.name, editState.muscleGroupIds);
        } else {
            await createExercise(editState.name, editState.muscleGroupIds);
        }
        setIsOpen(false);
        await load();
    };

    const handleDelete = async (id: number) => {
        await deleteExercise(id);
        await load();
    };

    useIonViewWillEnter(() => { load(); });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Exercises</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" expand="full" onClick={openNew}>
                            <IonIcon slot="start" icon={addOutline} />
                            New
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {exercises.map((exercise) => (
                        <IonItemSliding key={exercise.id}>
                            <IonItem button onClick={() => openEdit(exercise)}>
                                <IonLabel>
                                    <h2>{exercise.name}</h2>
                                    <p>{exercise.muscle_groups.map(mg => mg.name).join(', ')}</p>
                                </IonLabel>
                            </IonItem>
                            <IonItemOptions side="end">
                                <IonItemOption color="danger" onClick={() => handleDelete(exercise.id)}>
                                    Delete
                                </IonItemOption>
                            </IonItemOptions>
                        </IonItemSliding>
                    ))}
                </IonList>

                <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{editState.id ? 'Edit Exercise' : 'New Exercise'}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton color="primary" expand="full" onClick={handleSave} className="ion-margin-top">
                                    <IonIcon slot="start" icon={checkmark} />
                                    {editState.id ? 'Update' : 'Save'}
                                </IonButton>
                                <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonInput
                            label="Exercise name"
                            labelPlacement="floating"
                            value={editState.name}
                            onIonInput={e => setEditState(prev => ({ ...prev, name: e.detail.value! }))}
                        />
                        <IonList>
                            {muscleGroups.map(mg => (
                                <IonItem key={mg.id}>
                                    <IonCheckbox
                                        slot="start"
                                        checked={editState.muscleGroupIds.includes(mg.id)}
                                        onIonChange={() => toggleMuscleGroup(mg.id)}
                                    />
                                    <IonLabel>{mg.name}</IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonContent>
                </IonModal>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Please enter an exercise name."
                    duration={2000}
                    color="danger"
                />

            </IonContent>
        </IonPage>
    );
};

export default Exercises;