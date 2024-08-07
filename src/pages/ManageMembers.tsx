import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonText
} from '@ionic/react';
import { peopleOutline, schoolOutline, logOutOutline, addCircleOutline, personAddOutline, checkboxOutline, folderOpenOutline, footstepsOutline, documentTextOutline } from 'ionicons/icons';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { getCurrentUser, signOut } from '../firebaseConfig'; // Import getCurrentUser and signOut functions
import './Dashboard.css';
import DashboardHeader from '../components/DashboardHeader';

const ManageMembers: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>('Guest');

  useEffect(() => {
    const user = getCurrentUser(); // Get current authenticated user
    if (user) {
      setDisplayName(user.displayName || 'User'); // Set display name from user's profile
    }
  }, []);

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className="ion-padding custom-background" color='background'>
        <div className="welcome-text">
          <IonText>Hello {displayName}, Select your option to manage members</IonText>
        </div>
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6" size-lg="4">
              <IonCard button routerLink="/add-member" className="dashboard-card">
                <IonCardHeader>
                  <IonIcon icon={personAddOutline} className="dashboard-icon" />
                  <IonCardTitle className="dashboard-title">Add Member</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  Add new members
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-md="6" size-lg="4">
              <IonCard button routerLink="/member-list" className="dashboard-card">
                <IonCardHeader>
                  <IonIcon icon={peopleOutline} className="dashboard-icon" />
                  <IonCardTitle className="dashboard-title">Member List</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  View and Manage all members
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default ManageMembers;
