import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

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
        <p className='welcome-text'>Hello {username}, Welcome to the Nabia App</p>
        <IonButton onClick={navigateToAddMember}>Add Member</IonButton>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default Dashboard;