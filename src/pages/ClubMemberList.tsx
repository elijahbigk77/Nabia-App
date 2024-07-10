// ClubMemberList.tsx

import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { getMembersByClubId, MemberData } from '../firebaseConfig';
import { useParams } from 'react-router-dom';

interface RouteParams {
  clubId: string;
}

const ClubMemberList: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const { clubId } = useParams<RouteParams>();

  useEffect(() => {
    fetchMembers(clubId);
  }, [clubId]);

  const fetchMembers = async (clubId: string) => {
    const fetchedMembers = await getMembersByClubId(clubId);
    setMembers(fetchedMembers);
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding" color="background">
        <IonList>
          {members.map((member, index) => (
            <IonItem key={index}>
              <IonLabel>{member.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default ClubMemberList;
