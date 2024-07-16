import React from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Tribe, tribes } from '../firebaseConfig';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

// Define the tribes grouped by their mothers
const groupedTribes: { mother: string, children: Tribe[] }[] = [
    {
        mother: 'Leah',
        children: tribes.filter(tribe => ['Reuben', 'Simeon', 'Levi', 'Judah', 'Issachar', 'Zebulun'].includes(tribe.name))
    },
    {
        mother: 'Zilpah',
        children: tribes.filter(tribe => ['Gad', 'Asher'].includes(tribe.name))
    },
    {
        mother: 'Bilhah',
        children: tribes.filter(tribe => ['Dan', 'Naphtali'].includes(tribe.name))
    },
    {
        mother: 'Rachel',
        children: tribes.filter(tribe => ['Joseph', 'Benjamin'].includes(tribe.name))
    }
];

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
                    {groupedTribes.map(group => (
                        <React.Fragment key={group.mother}>
                            <IonItem lines="none" className="ion-text-center item-background-color">
                                <IonLabel color="medium">
                                    <IonText style={{ fontWeight: 'bold', opacity: 0.6 }}>
                                        {group.mother}
                                    </IonText>
                                </IonLabel>
                            </IonItem>
                            {group.children.map((tribe: Tribe) => (
                                <IonItem key={tribe.id} onClick={() => handleTribeClick(tribe.id)} className='item-background-color'>
                                    <IonLabel>{tribe.name}</IonLabel>
                                </IonItem>
                            ))}
                        </React.Fragment>
                    ))}
                </IonList>
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default TribeList;
