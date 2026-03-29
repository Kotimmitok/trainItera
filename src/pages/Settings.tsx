import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonToggle, IonSelect,
    IonSelectOption, IonInput, IonNote, IonListHeader
} from '@ionic/react';
import { useState } from 'react';
import { getSettings, saveSettings, Settings } from '../db/settings';

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<Settings>(getSettings());

    const update = (patch: Partial<Settings>) => {
        const updated = { ...settings, ...patch };
        setSettings(updated);
        saveSettings(updated);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {/* General */}
                <IonList>
                    <IonListHeader>
                        <IonLabel>General</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel>Language</IonLabel>
                        <IonSelect
                            value={settings.language}
                            onIonChange={e => update({ language: e.detail.value })}
                        >
                            <IonSelectOption value="en">English</IonSelectOption>
                            <IonSelectOption value="de">Deutsch</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Weight Unit</IonLabel>
                        <IonSelect
                            value={settings.weight_unit}
                            onIonChange={e => update({ weight_unit: e.detail.value })}
                        >
                            <IonSelectOption value="kg">kg</IonSelectOption>
                            <IonSelectOption value="lbs">lbs</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>

                {/* Rest */}
                <IonList>
                    <IonListHeader>
                        <IonLabel>Rest Timer</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel>Enable Rest Timer</IonLabel>
                        <IonToggle
                            checked={settings.rest_enabled}
                            onIonChange={e => update({ rest_enabled: e.detail.checked })}
                        />
                    </IonItem>
                    {settings.rest_enabled && (
                        <>
                            <IonItem>
                                <IonLabel>Default Rest (seconds)</IonLabel>
                                <IonInput
                                    type="number"
                                    value={settings.default_rest_seconds}
                                    style={{ textAlign: 'right' }}
                                    onIonBlur={e => update({
                                        default_rest_seconds: Number((e.target as HTMLIonInputElement).value)
                                    })}
                                />
                            </IonItem>
                            <IonItem lines="none">
                                <IonNote style={{ fontSize: '0.8rem', padding: '4px 0 8px' }}>
                                    This value is used when no rest time is set on the routine exercise.
                                </IonNote>
                            </IonItem>
                        </>
                    )}
                </IonList>

            </IonContent>
        </IonPage>
    );
};

export default SettingsPage;