// ClubMemberList.tsx

import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { getMembersByClubId, MemberData, updateMember, deleteMember, Tribe, tribes, ClubData, getTribes, getAllClubs } from '../firebaseConfig';
import { useParams } from 'react-router-dom';

import { pencilOutline, trashOutline } from 'ionicons/icons';
import { toast } from '../toast';

interface RouteParams {
  clubId: string;
}

const ClubMemberList: React.FC = () => {
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

  const { clubId } = useParams<RouteParams>();
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [tribesList, setTribesList] = useState<Tribe[]>([]);

  useEffect(() => {
    fetchTribes();
    fetchClubs();
    fetchMembers(clubId);
  }, [clubId]);

  const fetchMembers = async (clubId: string) => {
    const fetchedMembers = await getMembersByClubId(clubId);
    setMembers(fetchedMembers);
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
      toast("Please fill in all required fields.");
      return;
    }

    if (editMemberData.id) {
      const memberId = editMemberData.id;
      const updated = await updateMember(memberId, editMemberData);
      if (updated) {
        fetchMembers(clubId); // Refresh member list after update
        closeModal();
      }
    }
  };

  const handleDeleteMember = async () => {
    if (selectedMember) {
      const memberId = selectedMember.id;
      const deleted = await deleteMember(memberId);
      if (deleted) {
        fetchMembers(clubId); // Refresh member list after delete
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

  // Find the selected club's name
  const selectedClubName = clubs.find(club => club.id === clubId)?.name || '';

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className="ion-padding" color="background">
        <h2>Members of {selectedClubName}</h2>
        <IonList>
                    {members.map((member, index) => (
                        <IonCard key={index} onClick={() => openModal(member)}>
                            <IonCardHeader>
                                <IonCardTitle>{member.name}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <p>{`Birthdate: ${formatBirthdate(member.birthdate)}`}</p>
                                <p>{`Age: ${calculateAge(member.birthdate)}`}</p>
                            </IonCardContent>
                        </IonCard>
                    ))}
                </IonList>

        {/* Member Details Modal */}
        <IonModal isOpen={showModal} onDidDismiss={closeModal} className="full-screen-modal">
          {editMode ? (
            <IonContent fullscreen>
              <MainHeader />
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput
                  value={editMemberData.name}
                  onIonInput={(e: any) => setEditMemberData({ ...editMemberData, name: e.target.value })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Birthdate</IonLabel>
                <IonInput
                  type="date"
                  value={editMemberData.birthdate}
                  onIonInput={(e: any) => setEditMemberData({ ...editMemberData, birthdate: e.target.value })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Residential Address</IonLabel>
                <IonInput
                  value={editMemberData.residentialAddress}
                  onIonInput={(e: any) => setEditMemberData({ ...editMemberData, residentialAddress: e.target.value })}
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
              <IonItem>
                <IonLabel position="stacked">Tribe</IonLabel>
                <IonSelect
                  value={editMemberData.tribeId}
                  onIonChange={(e: any) =>
                    setEditMemberData({ ...editMemberData, tribeId: e.target.value })
                  }
                >
                  {tribesList.map((tribe: Tribe) => (
                    <IonSelectOption key={tribe.id} value={tribe.id}>
                      {tribe.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Club</IonLabel>
                <IonSelect
                  value={editMemberData.clubId}
                  onIonChange={(e: any) =>
                    setEditMemberData({ ...editMemberData, clubId: e.target.value })
                  }
                >
                  {clubs.map((club: ClubData) => (
                    <IonSelectOption key={club.id} value={club.id}>
                      {club.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonButton expand="block" onClick={handleEditMember}>
                Save Changes
              </IonButton>
              <IonButton expand="block" color="medium" onClick={closeModal}>
                Cancel
              </IonButton>
            </IonContent>
          ) : (
            <IonContent className="profile-modal">
              <MainHeader />
              <IonItem>
                <p>{selectedMember?.name}</p>
              </IonItem>
              <IonItem>
                <p>Birthdate: {formatBirthdate(selectedMember?.birthdate || '')}</p>
              </IonItem>
              <IonItem>
                <p>Age: {calculateAge(selectedMember?.birthdate || '')}</p>
              </IonItem>
              <IonItem>
                <p>Residential Address: {selectedMember?.residentialAddress}</p>
              </IonItem>
              <IonItem>
                <p>School Address: {selectedMember?.schoolAddress}</p>
              </IonItem>
              <IonItem>
                <p>Parent/Guardian: {selectedMember?.parentGuardianName}</p>
              </IonItem>
              <IonItem>
                <p>Relationship: {selectedMember?.parentGuardianRelationship}</p>
              </IonItem>
              <IonItem>
                <p>Parent/Guardian Contact: {selectedMember?.parentGuardianContact}</p>
              </IonItem>
              <IonItem>
                <p>Teacher: {selectedMember?.teacherName}</p>
              </IonItem>
              <IonItem>
                <p>Teacher Contact: {selectedMember?.teacherContact}</p>
              </IonItem>
              <IonItem>
                <p>Teacher Class: {selectedMember?.teacherClass}</p>
              </IonItem>
              <IonItem><p>{`Tribe: ${tribesList.find((tribe: Tribe) => tribe.id === selectedMember?.tribeId)?.name}`}</p></IonItem>
              <IonItem><p>{`Club: ${clubs.find((club: ClubData) => club.id === selectedMember?.clubId)?.name}`}</p></IonItem>
              <IonButton onClick={closeModal} color='danger'>Close</IonButton>
              <IonButton color="dark" onClick={() => setEditMode(true)}>
                <IonIcon icon={pencilOutline} />
              </IonButton>
              <IonButton color="dark" onClick={() => setShowDeleteAlert(true)}>
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonContent>
          )}
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

export default ClubMemberList;
