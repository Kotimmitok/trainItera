import {
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonButtons,
    IonSearchbar, IonCheckbox, IonModal, IonInput, IonIcon,
    IonToast
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useState } from 'react';
import { Exercise, MuscleGroup } from '../db/models/exercise.model';
import { createExercise, getExercises } from '../db/repositories/exercises.repository';
import { getMuscleGroups } from '../db/repositories/muscle_groups.repository';

interface Props {
    exercises: Exercise[];
    onSelect: (exercise: Exercise) => void;
    onDismiss: () => void;
    onExercisesChanged: () => void;
}

const ExercisePicker: React.FC<Props> = ({ exercises, onSelect, onDismiss, onExercisesChanged }) => {
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
    const [selectedMgIds, setSelectedMgIds] = useState<number[]>([]);
    const [showToast, setShowToast] = useState(false);

    const filteredExercises = exercises.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle_groups.some(mg => mg.name.toLowerCase().includes(search.toLowerCase()))
    );

    const handleOpenCreate = async () => {
        setMuscleGroups(await getMuscleGroups());
        setNewName('');
        setSelectedMgIds([]);
        setIsCreateOpen(true);
    };

    const toggleMuscleGroup = (id: number) => {
        setSelectedMgIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!newName.trim()) {
            setShowToast(true);
            return;
        }
        await createExercise(newName, selectedMgIds);
        setIsCreateOpen(false);
        onExercisesChanged();
    };

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Select Exercise</IonTitle>
                    <IonButtons slot="start">
                        <IonButton onClick={onDismiss}>Cancel</IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={handleOpenCreate}>
                            <IonIcon slot="start" icon={addOutline} />
                            New
                        </IonButton>
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
                        <IonItem key={exercise.id} button onClick={() => onSelect(exercise)}>
                            <IonLabel>
                                <h2>{exercise.name}</h2>
                                <p>{exercise.muscle_groups.map(mg => mg.name).join(', ')}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>

            {/* Create Exercise Modal */}
            <IonModal isOpen={isCreateOpen} onDidDismiss={() => setIsCreateOpen(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>New Exercise</IonTitle>
                        <IonButtons slot="end">
                            <IonButton color='primary' expand="full" onClick={handleCreate} className="ion-margin-top">
                                Save
                            </IonButton>
                            <IonButton onClick={() => setIsCreateOpen(false)}>Cancel</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonInput
                        label="Exercise name"
                        labelPlacement="floating"
                        value={newName}
                        onIonInput={e => setNewName(e.detail.value!)}
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
                </IonContent>
            </IonModal>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message="Please enter an exercise name."
                duration={2000}
                color="danger"
            />
        </>
    );
};

export default ExercisePicker;