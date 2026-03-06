import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem
} from '@ionic/react';

const Exercises: React.FC = () => (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Exercises</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent>
            <IonList>
                <IonItem>Pullup</IonItem>
                <IonItem>Dip</IonItem>
                <IonItem>Squat</IonItem>
                <IonItem>Deadlift</IonItem>
            </IonList>
        </IonContent>
    </IonPage>
);

export default Exercises;