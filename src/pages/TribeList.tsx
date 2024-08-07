import React from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonText, IonCard, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Tribe, tribes } from '../firebaseConfig';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import './TribeList.css';

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
                <IonLabel ><IonText ><p className='description'>Select a Tribe to view and manage members in that tribe</p></IonText></IonLabel>
                <IonList>
                    {groupedTribes.map(group => (
                        <React.Fragment key={group.mother}>
                            <IonItem lines="none" className="item-background-color">
                                <IonLabel className='moms' color="dark" style={{ fontWeight: 'bold', opacity: 0.4 }}>
                                    {group.mother}
                                </IonLabel>
                            </IonItem>
                            {group.children.map((tribe: Tribe) => (
                                <IonCard key={tribe.id} color='dark' onClick={() => handleTribeClick(tribe.id)} className="item-background-color">
                                    <IonCardContent>
                                        <IonLabel>{tribe.name}</IonLabel>
                                    </IonCardContent>
                                </IonCard>
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
