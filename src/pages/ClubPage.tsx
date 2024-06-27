import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAlert,
  IonToast
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, closeOutline } from 'ionicons/icons';
import { addClub, getAllClubs, ClubData, updateClub, deleteClub } from '../firebaseConfig';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

const ClubList: React.FC = () => {
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubLocation, setNewClubLocation] = useState('');
  const [editClubId, setEditClubId] = useState<string | null>(null);
  const [editClubName, setEditClubName] = useState('');
  const [editClubLocation, setEditClubLocation] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteClubId, setDeleteClubId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const fetchedClubs = await getAllClubs();
    setClubs(fetchedClubs);
  };

  const handleAddClub = async () => {
    if (newClubName && newClubLocation) {
      const success = await addClub({ name: newClubName, location: newClubLocation });
      if (success) {
        fetchClubs();
        setShowModal(false);
        setNewClubName('');
        setNewClubLocation('');
      }
    }
  };

  const handleEditClub = async () => {
    if (editClubId && editClubName && editClubLocation) {
      const success = await updateClub(editClubId, { name: editClubName, location: editClubLocation });
      if (success) {
        fetchClubs();
        setShowEditModal(false);
        setEditClubId(null);
        setEditClubName('');
        setEditClubLocation('');
      }
    }
  };

  const handleDeleteClub = async () => {
    if (deleteClubId) {
      const success = await deleteClub(deleteClubId);
      if (success) {
        fetchClubs();
        setShowDeleteAlert(false);
        setDeleteClubId(null);
        setShowToast(true);
        setToastMessage('Club deleted successfully');
      }
    }
  };

  const openEditModal = (club: ClubData) => {
    setEditClubId(club.id || null); // Use null coalescing operator to handle potential undefined
    setEditClubName(club.name);
    setEditClubLocation(club.location);
    setShowEditModal(true);
  };

  const openDeleteAlert = (clubId: string) => {
    setDeleteClubId(clubId);
    setShowDeleteAlert(true);
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding" color="background">
        <IonList>
          {clubs.map((club, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>{club.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{`Location: ${club.location}`}</p>
                <IonButton size="small" onClick={() => openEditModal(club)}>
                  <IonIcon icon={createOutline} slot="icon-only" />
                </IonButton>
                <IonButton size="small" onClick={() => openDeleteAlert(club.id || '')}>
                  <IonIcon icon={trashOutline} slot="icon-only" />
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Add Club Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Club Name</IonLabel>
              <IonInput value={newClubName} onIonChange={e => setNewClubName(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Location</IonLabel>
              <IonInput value={newClubLocation} onIonChange={e => setNewClubLocation(e.detail.value!)} />
            </IonItem>
            <IonButton expand="block" onClick={handleAddClub}>
              Create Club
            </IonButton>
            <IonButton expand="block" color="light" onClick={() => setShowModal(false)}>
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Edit Club Modal */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Club Name</IonLabel>
              <IonInput value={editClubName} onIonChange={e => setEditClubName(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Location</IonLabel>
              <IonInput value={editClubLocation} onIonChange={e => setEditClubLocation(e.detail.value!)} />
            </IonItem>
            <IonButton expand="block" onClick={handleEditClub}>
              Save Changes
            </IonButton>
            <IonButton expand="block" color="light" onClick={() => setShowEditModal(false)}>
              <IonIcon icon={closeOutline} slot="start" />
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Delete Club Alert */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Delete Club"
          message="Are you sure you want to delete this club?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Delete',
              handler: handleDeleteClub
            }
          ]}
        />

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default ClubList;
