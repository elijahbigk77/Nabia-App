import React from 'react';
import { IonPage, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonText } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import './Dashboard.css';
import { personAddOutline, warning } from 'ionicons/icons';

interface LocationState {
  username: string;
}

const Dashboard: React.FC = () => {
  const location = useLocation<{
    username: string;
    state: LocationState;
  }>();
  const history = useHistory();
  const username = location.state?.username || 'Guest';

  const navigateToAddMember = () => {
    history.push('/add-member');
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className='ion-padding' color='background'>

      <p>
      <IonText className='welcome-text'> Hello {username}, Welcome to the Nabia App </IonText>
        <IonButton onClick={navigateToAddMember}>
            <IonIcon slot="start" icon={personAddOutline} />
            Add Member
        </IonButton>
      </p>
      
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default Dashboard;
