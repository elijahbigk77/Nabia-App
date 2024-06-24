import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonModal,
  IonButton,
  IonLabel,
  IonIcon,
  IonButtons,
  IonAlert,
  IonInput,
  IonItem,
  IonDatetime
} from '@ionic/react';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { MemberData, getAllMembers, deleteMember, updateMember } from '../firebaseConfig';
import './MemberList.css';

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editMemberData, setEditMemberData] = useState<MemberData>({
    id: '',
    name: '',
    birthdate: '',
    residentialAddress: '',
    schoolAddress: '',
    parentGuardianName: '',
    parentGuardianRelationship: '',
    parentGuardianContact: '',
    teacherName: '',
    teacherContact: '',
    teacherClass: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const fetchedMembers = await getAllMembers();
    setMembers(fetchedMembers);
  };

  const openModal = (member: MemberData) => {
    setSelectedMember(member);
    setEditMode(false); 
    setEditMemberData(member); 
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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

  const handleEditMember = async () => {
    if (editMemberData.id) {
      const memberId = editMemberData.id;
      const updated = await updateMember(memberId, editMemberData);
      if (updated) {
        fetchMembers(); // Refresh member list after update
        closeModal();
      }
    }
  };

  const handleDeleteMember = async () => {
    if (selectedMember) {
      const memberId = selectedMember.id;
      const deleted = await deleteMember(memberId);
      if (deleted) {
        fetchMembers(); // Refresh member list after delete
        setShowDeleteAlert(false);
        closeModal();
      }
    }
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding" color="background">
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
        <IonModal isOpen={showModal} onDidDismiss={closeModal} className='full-screen-modal'>
        <MainHeader />
          <IonCard className='profile-card'>
            <IonCardHeader>
              <IonCardTitle>{editMode ? 'Edit Member' : selectedMember?.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {editMode ? (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Name</IonLabel>
                    <IonInput
                      value={editMemberData.name}
                      onIonInput={(e: any) => setEditMemberData({ ...editMemberData, name: e.target.value })}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Birthdate</IonLabel>
                    <IonDatetime
                      
                      value={editMemberData.birthdate}
                      onIonChange={(e: any) => setEditMemberData({ ...editMemberData, birthdate: e.detail.value! })}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Residential Address</IonLabel>
                    <IonInput
                      value={editMemberData.residentialAddress}
                      onIonInput={(e: any) =>
                        setEditMemberData({ ...editMemberData, residentialAddress: e.target.value })
                      }
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">School Address</IonLabel>
                    <IonInput
                      value={editMemberData.schoolAddress}
                      onIonInput={(e: any) => setEditMemberData({ ...editMemberData, schoolAddress: e.target.value })}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Parent/Guardian Name</IonLabel>
                    <IonInput
                      value={editMemberData.parentGuardianName}
                      onIonInput={(e: any) =>
                        setEditMemberData({ ...editMemberData, parentGuardianName: e.target.value })
                      }
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Parent/Guardian Relationship</IonLabel>
                    <IonInput
                      value={editMemberData.parentGuardianRelationship}
                      onIonInput={(e: any) =>
                        setEditMemberData({ ...editMemberData, parentGuardianRelationship: e.target.value })
                      }
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Parent/Guardian Contact</IonLabel>
                    <IonInput
                      value={editMemberData.parentGuardianContact}
                      onIonInput={(e: any) =>
                        setEditMemberData({ ...editMemberData, parentGuardianContact: e.target.value })
                      }
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Teacher Name</IonLabel>
                    <IonInput
                      value={editMemberData.teacherName}
                      onIonInput={(e: any) => setEditMemberData({ ...editMemberData, teacherName: e.target.value })}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Teacher Contact</IonLabel>
                    <IonInput
                      value={editMemberData.teacherContact}
                      onIonInput={(e: any) =>
                        setEditMemberData({ ...editMemberData, teacherContact: e.target.value })
                      }
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Teacher Class</IonLabel>
                    <IonInput
                      value={editMemberData.teacherClass}
                      onIonInput={(e: any) => setEditMemberData({ ...editMemberData, teacherClass: e.target.value })}
                    />
                  </IonItem>
                  <IonButton expand="block" onClick={handleEditMember}>
                    Save Changes
                  </IonButton>
                </>
              ) : (
                <>
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
                </>
              )}
              <IonButton onClick={closeModal}>Close</IonButton>
              <IonButton color="dark" onClick={() => setEditMode(true)}>
                <IonIcon icon={pencilOutline} />
              </IonButton>
              <IonButton color="dark" onClick={() => setShowDeleteAlert(true)}>
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonCardContent>
          </IonCard>
          <MainFooter />
        </IonModal>

        {/* Alert for delete confirmation */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Confirm Delete'}
          message={`Are you sure you want to delete ${selectedMember?.name}?`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Delete',
              handler: handleDeleteMember
            }
          ]}
        />
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default MemberList;
