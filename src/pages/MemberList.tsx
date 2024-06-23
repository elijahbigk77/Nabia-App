import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { getAllMembers, MemberData } from '../firebaseConfig';

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const fetchedMembers = await getAllMembers();
    setMembers(fetchedMembers);
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding">
        <IonList>
          {members.map((member, index) => (
            <IonItem key={index}>
              <IonLabel>
                <h2>{member.name}</h2>
                <p>{`Birthdate: ${member.birthdate}`}</p>
                <p>{`Residential Address: ${member.residentialAddress}`}</p>
                <p>{`School Address: ${member.schoolAddress}`}</p>
                <p>{`Parent/Guardian: ${member.parentGuardianName}`}</p>
                <p>{`Relationship: ${member.parentGuardianRelationship}`}</p>
                <p>{`Parent/Guardian Contact: ${member.parentGuardianContact}`}</p>
                <p>{`Teacher: ${member.teacherName}`}</p>
                <p>{`Teacher Contact: ${member.teacherContact}`}</p>
                <p>{`Teacher Class: ${member.teacherClass}`}</p>
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
