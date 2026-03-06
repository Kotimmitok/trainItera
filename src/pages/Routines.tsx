import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem
} from '@ionic/react';

const Routines: React.FC = () => (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Routines</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent>
            <IonList>
                <IonItem>Full Body Routine</IonItem>
                <IonItem>Push Pull Legs</IonItem>
                <IonItem>Cardio Routine</IonItem>
            </IonList>
        </IonContent>
    </IonPage>
);

export default Routines;