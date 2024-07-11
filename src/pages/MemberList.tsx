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
  IonAlert,
  IonInput,
  IonItem,
  IonDatetime,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { MemberData, getAllMembers, deleteMember, updateMember, getTribes } from '../firebaseConfig';
import './MemberList.css';
import { toast } from '../toast';
import { tribes, Tribe, ClubData, getAllClubs } from '../firebaseConfig';
import { useLocation } from 'react-router-dom';

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
    teacherClass: '',
    tribeId: '',
    clubId: ''
  });
  const [tribesList, setTribesList] = useState<Tribe[]>([]);
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const location = useLocation<{ refresh: boolean }>();

  useEffect(() => {
    fetchMembers();
    fetchTribes();
    fetchClubs();
  }, [location.state?.refresh]);

  const fetchMembers = async () => {
    const fetchedMembers = await getAllMembers();
    const validMembers = fetchedMembers.filter(member => member.name && member.name.trim() !== '');
    const invalidMembers = fetchedMembers.filter(member => !member.name || member.name.trim() === '');

    // Delete invalid members from Firestore
    for (const member of invalidMembers) {
      await deleteMember(member.id);
    }

    setMembers(validMembers);
  };

  const fetchTribes = async () => {
    const fetchedTribes = await getTribes();
    setTribesList(fetchedTribes);
  };

  const fetchClubs = async () => {
    const fetchedClubs = await getAllClubs();
    setClubs(fetchedClubs);
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
    // Validate required fields
    if (!editMemberData.name) {
      toast('Please fill in all required fields.');
      return;
    }

    const memberId = editMemberData.id;
    const updated = await updateMember(memberId, editMemberData);
    if (updated) {
      fetchMembers(); // Refresh member list after update
      closeModal();
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

  const formatBirthdate = (birthdate: string): string => {
    const date = new Date(birthdate);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Suffix for day (e.g., 1st, 2nd, 3rd, 4th)
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = suffixes[day % 10] || 'th';

    // Array of month names
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[monthIndex];

    return `${day}${suffix} ${month}, ${year}`;
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding item-background-color" color="background">
        <IonList>
          {members.map((member, index) => (
            <IonCard key={index} onClick={() => openModal(member)}>
              <IonCardHeader>
                <IonCardTitle>{member.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel>
                  <p>{`Birthdate: ${formatBirthdate(member.birthdate)}`}</p>
                  <p>{`Age: ${calculateAge(member.birthdate)}`}</p>
                </IonLabel>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Modal to display member details */}
        <IonModal isOpen={showModal} onDidDismiss={closeModal} className="full-screen-modal item-background-color">
          {editMode ? (
            <IonContent fullscreen>
              <MainHeader />
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput
                  value={editMemberData.name || ''}
                  onIonInput={(e: any) => setEditMemberData({ ...editMemberData, name: e.target.value })}
                />
              </IonItem>
              <IonItem className='item-background-color'>
                <p><IonLabel position="stacked">Birthdate</IonLabel></p>
                <IonDatetime color='success'
                  value={editMemberData.birthdate || ''}
                  onIonChange={(e: any) => setEditMemberData({ ...editMemberData, birthdate: e.detail.value! })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Residential Address</IonLabel>
                <IonInput
                  value={editMemberData.residentialAddress || ''}
                  onIonInput={(e: any) =>
                    setEditMemberData({ ...editMemberData, residentialAddress: e.target.value })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">School Address</IonLabel>
                <IonInput
                  value={editMemberData.schoolAddress || ''}
                  onIonInput={(e: any) => setEditMemberData({ ...editMemberData, schoolAddress: e.target.value })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Parent/Guardian Name</IonLabel>
                <IonInput
                  value={editMemberData.parentGuardianName || ''}
                  onIonInput={(e: any) =>
                    setEditMemberData({ ...editMemberData, parentGuardianName: e.target.value })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Parent/Guardian Relationship</IonLabel>
                <IonInput
                  value={editMemberData.parentGuardianRelationship || ''}
                  onIonInput={(e: any) =>
                    setEditMemberData({ ...editMemberData, parentGuardianRelationship: e.target.value })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Parent/Guardian Contact</IonLabel>
                <IonInput
                  value={editMemberData.parentGuardianContact || ''}
                  onIonInput={(e: any) =>
                    setEditMemberData({ ...editMemberData, parentGuardianContact: e.target.value })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Teacher Name</IonLabel>
                <IonInput
                  value={editMemberData.teacherName || ''}
                  onIonInput={(e: any) => setEditMemberData({ ...editMemberData, teacherName: e.target.value })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Teacher Contact</IonLabel>
                <IonInput
                  value={editMemberData.teacherContact || ''}
                  onIonInput={(e: any) =>
                    setEditMemberData({ ...editMemberData, teacherContact: e.target.value })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Teacher Class</IonLabel>
                <IonInput
                  value={editMemberData.teacherClass || ''}
                  onIonInput={(e: any) => setEditMemberData({ ...editMemberData, teacherClass: e.target.value })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Tribe</IonLabel>
                <IonSelect
                  value={editMemberData.tribeId || ''}
                  onIonChange={(e) => setEditMemberData({ ...editMemberData, tribeId: e.detail.value! })}
                >
                  {tribesList.map((tribe, index) => (
                    <IonSelectOption key={index} value={tribe.id}>
                      {tribe.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Club</IonLabel>
                <IonSelect
                  value={editMemberData.clubId || ''}
                  onIonChange={(e) => setEditMemberData({ ...editMemberData, clubId: e.detail.value! })}
                >
                  {clubs.map((club, index) => (
                    <IonSelectOption key={index} value={club.id}>
                      {club.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonButton expand="block" onClick={handleEditMember}>
                Save
              </IonButton>
              <IonButton expand="block" color="medium" onClick={() => setEditMode(false)}>
                Cancel
              </IonButton>
            </IonContent>
          ) : (
            <IonContent className="ion-padding">
              <h2>{selectedMember?.name}</h2>
              <p>
                <strong>Birthdate:</strong> {selectedMember?.birthdate}
              </p>
              <p>
                <strong>Age:</strong> {calculateAge(selectedMember?.birthdate || '')}
              </p>
              <p>
                <strong>Residential Address:</strong> {selectedMember?.residentialAddress}
              </p>
              <p>
                <strong>School Address:</strong> {selectedMember?.schoolAddress}
              </p>
              <p>
                <strong>Parent/Guardian Name:</strong> {selectedMember?.parentGuardianName}
              </p>
              <p>
                <strong>Parent/Guardian Relationship:</strong> {selectedMember?.parentGuardianRelationship}
              </p>
              <p>
                <strong>Parent/Guardian Contact:</strong> {selectedMember?.parentGuardianContact}
              </p>
              <p>
                <strong>Teacher Name:</strong> {selectedMember?.teacherName}
              </p>
              <p>
                <strong>Teacher Contact:</strong> {selectedMember?.teacherContact}
              </p>
              <p>
                <strong>Teacher Class:</strong> {selectedMember?.teacherClass}
              </p>
              <p>
                <strong>Tribe:</strong> {tribesList.find(tribe => tribe.id === selectedMember?.tribeId)?.name}
              </p>
              <p>
                <strong>Club:</strong> {clubs.find(club => club.id === selectedMember?.clubId)?.name}
              </p>
              <IonButton expand="block" onClick={() => setEditMode(true)}>
                Edit
              </IonButton>
              <IonButton expand="block" color="danger" onClick={() => setShowDeleteAlert(true)}>
                Delete
              </IonButton>
              <IonButton expand="block" onClick={closeModal}>
                Close
              </IonButton>
            </IonContent>
          )}
        </IonModal>

        {/* Alert for deleting member */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Delete Member'}
          message={'Are you sure you want to delete this member?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Delete',
              handler: handleDeleteMember,
            },
          ]}
        />
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default MemberList;
