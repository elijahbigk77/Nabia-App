import React from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Tribe, tribes } from '../firebaseConfig'; // Adjust the path as per your project structure

const TribeList: React.FC = () => {
    const history = useHistory();

    const handleTribeClick = (tribeId: string) => {
        history.push(`/tribe-member-list/${tribeId}`); // Navigate to TribeMemberList with tribeId
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonList>
                    {tribes.map((tribe: Tribe) => (
                        <IonItem key={tribe.id} onClick={() => handleTribeClick(tribe.id)}>
                            <IonLabel>{tribe.name}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default TribeList;
