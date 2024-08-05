import './MainHeader.css';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonItem,IonIcon, IonButton } from '@ionic/react';



interface ContainerProps { }

const Header: React.FC<ContainerProps> = () => {
  
  return (
    <IonHeader>
      <IonItem color='background'>
      <IonButtons slot="start">
      </IonButtons>
      <IonToolbar className='top-bar' color='background'>
        <IonTitle className='title'>Nabia Fellows App</IonTitle>
      </IonToolbar>
      </IonItem>
    </IonHeader>
  );
};

export default Header;
