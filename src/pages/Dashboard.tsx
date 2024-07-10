import React, { useEffect, useState } from 'react';
import { IonPage, IonIcon, IonContent, IonButton, IonText } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import './Dashboard.css';
import { personAddOutline } from 'ionicons/icons';
import { getCurrentUser, signOut } from '../firebaseConfig'; // Import getCurrentUser and signOut functions

interface LocationState {
  username: string;
}

const Dashboard: React.FC = () => {
  const location = useLocation<{ username: string; state: LocationState }>();
  const history = useHistory();
  const [displayName, setDisplayName] = useState<string>('Guest');

  useEffect(() => {
    const user = getCurrentUser(); // Get current authenticated user
    if (user) {
      setDisplayName(user.displayName || 'User'); // Set display name from user's profile
    }
  }, []);

  const navigateToAddMember = () => {
    history.push('/add-member');
  };

  const navigateToMemberList = () => {
    history.push('/member-list');
  };

  const navigateToTribeList = () => {
    history.push('/tribe-list');
  };

  const navigateToClubPage = () => {
    history.push('/club-page');
  };


  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className="ion-padding" color="background">
        <div className="dashboard-container">
          <p className="welcome-text">
            <IonText>Hello {displayName}, Welcome to the Nabia App</IonText>
          </p>
          <div className="add-member">
            <IonButton className="add-member-button" onClick={navigateToAddMember}>
              <IonIcon slot="start" icon={personAddOutline} />
              Add Member
            </IonButton>
            <IonButton onClick={navigateToMemberList}>
              <IonIcon slot="start" icon={personAddOutline} />
              Member List
            </IonButton>
            <IonButton onClick={navigateToTribeList}>
              <IonIcon slot="start" icon={personAddOutline} />
              View Tribes
            </IonButton>
            <IonButton onClick={navigateToClubPage}>
              <IonIcon slot="start" icon={personAddOutline} />
              Create/View Club
            </IonButton>
          </div>
        </div>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default Dashboard;
