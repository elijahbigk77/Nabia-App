import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

interface LocationState {
  username: string;
}

const Dashboard: React.FC = () => {
  const location = useLocation<{
      username: string; state: LocationState 
}>();
  const username = location.state?.username || 'Guest';

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className='ion-padding' color='background'>
        <p className='welcome-text'>Hello {username}, Welcome to the Nabia App</p>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default Dashboard;