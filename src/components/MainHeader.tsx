import './MainHeader.css';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonItem } from '@ionic/react';

interface ContainerProps { }

const MainHeader: React.FC<ContainerProps> = () => {
  return (
    <IonHeader>
      <IonItem color='background'>
      <IonButtons slot="start">
      <IonBackButton></IonBackButton>
      </IonButtons>
      <IonToolbar className='top-bar' color='background'>
        <IonTitle className='title'>Nabia Fellows App</IonTitle>
      </IonToolbar>
      </IonItem>
    </IonHeader>
  );
};

export default MainHeader;
