import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

const AddMember: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]); // State to hold members
  const [name, setName] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const history = useHistory();

  const handleAddMember = () => {
    const newMember = { name, birthday, email };
    setMembers([...members, newMember]); // Add new member to state
    history.push({
      pathname: '/member-list',
      state: { members: [...members, newMember] } // Pass members array to MemberList
    });
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <IonInput value={name} onIonChange={e => setName(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Birthday</IonLabel>
          <IonInput type="date" value={birthday} onIonChange={e => setBirthday(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
        </IonItem>
        <IonButton expand="full" onClick={handleAddMember}>Add Member</IonButton>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default AddMember;

interface Member {
  name: string;
  birthday: string;
  email: string;
}