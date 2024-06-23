import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonModal, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { MemberData, getAllMembers } from '../firebaseConfig';

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const fetchedMembers = await getAllMembers();
    setMembers(fetchedMembers);
  };

  const openModal = (member: MemberData) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Function to calculate age based on birthdate
  const calculateAge = (birthdate: string): string => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding">
        <IonList>
          {members.map((member, index) => (
            <IonCard key={index} onClick={() => openModal(member)}>
              <IonCardHeader>
                <IonCardTitle>{member.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel>
                  <p>{`Birthdate: ${member.birthdate}`}</p>
                  <p>{`Age: ${calculateAge(member.birthdate)}`}</p>
                </IonLabel>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Modal to display member details */}
        <IonModal isOpen={showModal} onDidDismiss={closeModal}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{selectedMember?.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonLabel>
                <p>{`Birthdate: ${selectedMember?.birthdate}`}</p>
                <p>{`Age: ${calculateAge(selectedMember?.birthdate || '')}`}</p>
                <p>{`Residential Address: ${selectedMember?.residentialAddress}`}</p>
                <p>{`School Address: ${selectedMember?.schoolAddress}`}</p>
                <p>{`Parent/Guardian: ${selectedMember?.parentGuardianName}`}</p>
                <p>{`Relationship: ${selectedMember?.parentGuardianRelationship}`}</p>
                <p>{`Parent/Guardian Contact: ${selectedMember?.parentGuardianContact}`}</p>
                <p>{`Teacher: ${selectedMember?.teacherName}`}</p>
                <p>{`Teacher Contact: ${selectedMember?.teacherContact}`}</p>
                <p>{`Teacher Class: ${selectedMember?.teacherClass}`}</p>
              </IonLabel>
              <IonButton onClick={closeModal}>Close</IonButton>
            </IonCardContent>
          </IonCard>
        </IonModal>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default MemberList;
