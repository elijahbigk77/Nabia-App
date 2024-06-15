import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

const MemberList: React.FC = () => {
  const location = useLocation<{ members: Member[] }>();
  const members = location.state?.members || []; // Retrieve members from location state

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding">
        <IonList>
          {members.map((member, index) => (
            <IonItem key={index}>
              <IonLabel>
                <h2>{member.name}</h2>
                <p>Birthday: {member.birthday}</p>
                <p>Email: {member.email}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default MemberList;

interface Member {
  name: string;
  birthday: string;
  email: string;
}