import './MainHeader.css';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';

interface ContainerProps { }

const MainHeader: React.FC<ContainerProps> = () => {
  return (
    <IonHeader>
      <IonToolbar className='top-bar' color='background'>
        <IonTitle className='title'>Nabia App</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
