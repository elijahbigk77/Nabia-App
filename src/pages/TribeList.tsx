import React from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Tribe, tribes } from '../firebaseConfig';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

const TribeList: React.FC = () => {
    const history = useHistory();

    const handleTribeClick = (tribeId: string) => {
        history.push(`/tribe-member-list/${tribeId}`); // Navigate to TribeMemberList with tribeId
    };

    return (
        <IonPage>
            <MainHeader />
            <IonContent className="ion-padding item-background-color" color="background">
                <IonList>
                    {tribes.map((tribe: Tribe) => (
                        <IonItem key={tribe.id} onClick={() => handleTribeClick(tribe.id)} className='item-background-color'>
                            <IonLabel>{tribe.name}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default TribeList;
