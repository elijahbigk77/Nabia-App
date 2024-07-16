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
import { peopleOutline, schoolOutline, logOutOutline, addCircleOutline, personAddOutline, checkboxOutline } from 'ionicons/icons';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { getCurrentUser, signOut } from '../firebaseConfig'; // Import getCurrentUser and signOut functions
import './Dashboard.css';

const Dashboard: React.FC = () => {
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
          <IonText>{displayName},Select your option to manage Clubs</IonText>
        </div>
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6" size-lg="4">
              <IonCard button routerLink="/club-page" className="dashboard-card">
                <IonCardHeader>
                  <IonIcon icon={addCircleOutline} className="dashboard-icon" />
                  <IonCardTitle className="dashboard-title">Create/View Club</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  View and Manage all clubs
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-md="6" size-lg="4">
              <IonCard button routerLink="/club-attendance-list" className="dashboard-card">
                <IonCardHeader>
                  <IonIcon icon={checkboxOutline} className="dashboard-icon" />
                  <IonCardTitle className="dashboard-title"> Club Attendance</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                Take Club Attendance
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-md="6" size-lg="4">
              <IonCard button routerLink="/attendance-record" className="dashboard-card">
                <IonCardHeader>
                  <IonIcon icon={checkboxOutline} className="dashboard-icon" />
                  <IonCardTitle className="dashboard-title"> Club Attendance Record</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                View Club Members' Attendance Records
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

export default Dashboard;
