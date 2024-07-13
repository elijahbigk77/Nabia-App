// AttendanceTakenModal.tsx

import React from 'react';
import { IonModal, IonButton, IonContent, IonText } from '@ionic/react';

interface Props {
    isOpen: boolean;
    clubName: string;
    onClose: () => void;
}

const AttendanceTakenModal: React.FC<Props> = ({ isOpen, clubName, onClose }) => {
    return (
        <IonModal isOpen={isOpen}>
            <IonContent className="ion-padding">
                <IonText>
                    <h2>Attendance already taken</h2>
                    <p>Attendance has already been taken for {clubName} club. Please wait until tomorrow to take attendance for another day.</p>
                </IonText>
                <IonButton expand="block" onClick={onClose}>Ok</IonButton>
            </IonContent>
        </IonModal>
    );
};

export default AttendanceTakenModal;
