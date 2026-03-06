import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem
} from '@ionic/react';

const Workouts: React.FC = () => (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Workouts</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent>
            <IonList>
                <IonItem>Today</IonItem>
                <IonItem>Yesterday</IonItem>
            </IonList>
        </IonContent>
    </IonPage>
);

export default Workouts;