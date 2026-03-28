import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption,
    IonLabel, IonButton, IonModal, IonInput, IonButtons,
    useIonViewWillEnter,
    IonIcon
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Routine } from '../db/models/routine.model';
import { createRoutine, deleteRoutine, getRoutines } from '../db/repositories/routines.repository';
import { addOutline, checkmark } from 'ionicons/icons';

const Routines: React.FC = () => {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const history = useHistory();

    const load = async () => {
        const result = await getRoutines();
        setRoutines(result);
    };

    const handleAdd = async () => {
        try {
            await createRoutine(name);
            setName('');
            setIsOpen(false);
            await load();
        } catch (err) {
            console.error('createRoutine error:', err);
        }
    };

    const handleDelete = async (id: number) => {
        await deleteRoutine(id);
        await load();
    };

    // Load routines when the page is entered
    useIonViewWillEnter(() => {
        load();
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonTitle>Routines</IonTitle>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={() => setIsOpen(true)}>
                            <IonIcon slot="start" icon={addOutline} />
                            Add Routine
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {routines.map(routine => (
                        <IonItemSliding key={routine.id}>
                            <IonItem button onClick={() =>
                                history.push(`/routines/${routine.id}`)
                            }
                            >
                                <IonLabel>
                                    <h2>{routine.name}</h2>
                                    <p>{routine.exercises.length} exercises</p>
                                </IonLabel>
                            </IonItem>
                            <IonItemOptions side="end">
                                <IonItemOption color="danger" onClick={() => handleDelete(routine.id)}>
                                    Delete
                                </IonItemOption>
                            </IonItemOptions>
                        </IonItemSliding>
                    ))}
                </IonList>


                <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>New Routine</IonTitle>
                            <IonButtons slot="end">
                                <IonButton color="primary" expand="full" onClick={handleAdd} className="ion-margin-top">
                                    <IonIcon slot="start" icon={checkmark} />
                                    Save
                                </IonButton>
                                <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonInput
                            label="Routine name"
                            labelPlacement="floating"
                            value={name}
                            onIonInput={e => setName(e.detail.value!)}
                        />
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Routines;