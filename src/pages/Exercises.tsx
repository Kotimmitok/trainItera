import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItemSliding, IonItem, IonItemOptions, IonLabel,
    IonItemOption, IonButton, IonModal, IonInput, IonButtons,
    IonCheckbox
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { Exercise, MuscleGroup } from '../db/models/exercise.model';
import { createExercise, deleteExercise, getExercises } from '../db/repositories/exercises.repository';
import { getMuscleGroups } from '../db/repositories/muscle_groups.repository';

const Exercises: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [selectedMgIds, setSelectedMgIds] = useState<number[]>([]);

    const load = async () => {
        setExercises(await getExercises());
        setMuscleGroups(await getMuscleGroups());
    };

    const toggleMuscleGroup = (id: number) => {
        setSelectedMgIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleAdd = async () => {
        if (!name.trim()) return;
        await createExercise(name, selectedMgIds);
        setName('');
        setSelectedMgIds([]);
        setIsOpen(false);
        await load();
    };

    const handleDelete = async (id: number) => {
        await deleteExercise(id);
        await load();
    };

    useEffect(() => { load(); }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Exercises</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {exercises.map((exercise) => (
                        <IonItemSliding key={exercise.id}>
                            <IonItem>
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

                <IonButton expand="full" onClick={() => setIsOpen(true)}>
                    Add Exercise
                </IonButton>

                <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>New Exercise</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonInput
                            label="Exercise name"
                            labelPlacement="floating"
                            value={name}
                            onIonInput={(e) => setName(e.detail.value!)}
                        />
                        <IonList>
                            {muscleGroups.map(mg => (
                                <IonItem key={mg.id}>
                                    <IonCheckbox
                                        slot="start"
                                        checked={selectedMgIds.includes(mg.id)}
                                        onIonChange={() => toggleMuscleGroup(mg.id)}
                                    />
                                    <IonLabel>{mg.name}</IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                        <IonButton expand="full" onClick={handleAdd} className="ion-margin-top">
                            Save
                        </IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Exercises;