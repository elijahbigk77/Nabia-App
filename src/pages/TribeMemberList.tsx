import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { useParams } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { MemberData, getMembersByTribeId } from '../firebaseConfig'; // Adjust import as per your project
import './MemberList.css';

const TribeMemberList: React.FC = () => {
    const { tribeId } = useParams<{ tribeId: string }>();
    const [members, setMembers] = useState<MemberData[]>([]);

    useEffect(() => {
        fetchMembers();
    }, [tribeId]); // Fetch members when tribeId changes

    const fetchMembers = async () => {
        const fetchedMembers = await getMembersByTribeId(tribeId); // Fetch members by tribeId
        setMembers(fetchedMembers);
    };

    return (
        <IonPage>
            <MainHeader />
            <IonContent fullscreen className="ion-padding" color="background">
                <IonList>
                    {members.map((member, index) => (
                        <IonCard key={index}>
                            <IonCardHeader>
                                <IonCardTitle>{member.name}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <p>{`Birthdate: ${member.birthdate}`}</p>
                                {/* Add more member details as needed */}
                            </IonCardContent>
                        </IonCard>
                    ))}
                </IonList>
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default TribeMemberList;
