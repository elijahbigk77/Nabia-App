import './MainHeader.css';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonItem,IonIcon, IonButton } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { signOut } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';

interface ContainerProps { }

const MainHeader: React.FC<ContainerProps> = () => {
  const history = useHistory();

  const handleSignOut = async () => {
    await signOut();
    history.push('/home');
  };

  return (
    <IonHeader>
      <IonItem color='background'>
      <IonButtons slot="start">
      <IonBackButton></IonBackButton>
      </IonButtons>
      <IonToolbar className='top-bar' color='background'>
        <IonTitle className='title'>Nabia Fellows App</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={handleSignOut}>
            <IonIcon icon={logOutOutline} />
            Sign Out
          </IonButton>
        </IonButtons>
      </IonToolbar>
      </IonItem>
    </IonHeader>
  );
};

export default MainHeader;
