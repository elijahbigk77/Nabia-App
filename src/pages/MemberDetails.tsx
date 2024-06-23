import React from 'react';
import { IonPage, IonIcon, IonContent, IonButton, IonText } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import './Dashboard.css';
import { personAddOutline } from 'ionicons/icons';

interface LocationState {
  username: string;
}

const Dashboard: React.FC = () => {
  const location = useLocation<{
    username: string; state: LocationState 
}>();
  const history = useHistory();
  const username = location.state?.username || 'Guest';

  const navigateToAddMember = () => {
    history.push('/add-member');
  };

  const navigateToMemberList = () => {
    history.push('/member-list')
  }

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className="ion-padding" color="background">
        <div className="dashboard-container">
          <p className="welcome-text">
            <IonText>Hello {username}, Welcome to the Nabia App</IonText>
          </p>
          <div className="add-member">
            <IonButton className="add-member-button" onClick={navigateToAddMember}>
              <IonIcon slot="start" icon={personAddOutline} />
              Add Member
            </IonButton>
            <IonButton  onClick={navigateToMemberList}>
              <IonIcon slot="start" icon={personAddOutline} />
              Member List
            </IonButton>
          </div>
        </div>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default Dashboard;
